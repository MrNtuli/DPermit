const { supabaseAdmin } = require('../config/supabase');
const verificationService = require('./verificationService');
const alertService = require('./alertService');

async function getDevices(profile) {
  let query = supabaseAdmin.from('iot_devices').select('*, organisations(name)').order('created_at', { ascending: false });
  if (profile.role !== 'system_admin' && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

async function createDevice(deviceData, profile) {
  const orgId = profile.role === 'system_admin' ? deviceData.organisation_id : profile.organisation_id;
  const { data, error } = await supabaseAdmin.from('iot_devices').insert({
    ...deviceData,
    organisation_id: orgId,
  }).select().single();
  if (error) throw new Error(error.message);
  return data;
}

async function getEvents(profile, filters = {}) {
  let query = supabaseAdmin.from('iot_scan_events').select(`
    *, iot_devices(device_name, device_identifier), organisations(name)
  `).order('created_at', { ascending: false });

  if (profile.role !== 'system_admin' && profile.organisation_id) {
    query = query.eq('organisation_id', profile.organisation_id);
  }
  if (filters.scan_type) query = query.eq('scan_type', filters.scan_type);

  const { data, error } = await query.limit(filters.limit || 100);
  if (error) throw new Error(error.message);
  return data;
}

async function simulateScan({ device_id, scan_type, permit_number, rfid_tag, qr_value }, profile, ipAddress) {
  const { data: device } = await supabaseAdmin.from('iot_devices').select('*').eq('id', device_id).single();
  if (!device) throw new Error('IoT device not found');

  let result;
  if (scan_type === 'qr' && qr_value) {
    result = await verificationService.verifyByQr(qr_value, profile, { deviceId: device.device_identifier, ipAddress });
  } else if (scan_type === 'rfid' && rfid_tag) {
    result = await verificationService.verifyByRfid(rfid_tag, profile, { deviceId: device.device_identifier, ipAddress });
  } else if (permit_number) {
    result = await verificationService.verifyByNumber(permit_number, profile, { deviceId: device.device_identifier, ipAddress });
  } else {
    throw new Error('Provide permit_number, qr_value, or rfid_tag');
  }

  const { data: event, error } = await supabaseAdmin.from('iot_scan_events').insert({
    device_id,
    organisation_id: device.organisation_id,
    scan_type: scan_type || 'manual',
    permit_number: permit_number || result.permit_number,
    rfid_tag,
    verification_result: result.verification_result,
  }).select().single();

  if (error) throw new Error(error.message);
  return { ...result, iot_event: event };
}

module.exports = { getDevices, createDevice, getEvents, simulateScan };
