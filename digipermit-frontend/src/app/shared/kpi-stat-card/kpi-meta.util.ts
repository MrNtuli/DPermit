export type KpiTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface KpiMeta {
  tone: KpiTone;
  icon: string;
}

const LABEL_PRESETS: Record<string, KpiMeta> = {
  organisations: { tone: 'info', icon: 'business-outline' },
  users: { tone: 'info', icon: 'people-outline' },
  'foreign nationals': { tone: 'info', icon: 'globe-outline' },
  'foreign employees': { tone: 'info', icon: 'briefcase-outline' },
  students: { tone: 'info', icon: 'school-outline' },
  records: { tone: 'info', icon: 'folder-open-outline' },
  'total permits': { tone: 'info', icon: 'documents-outline' },
  'active work visas': { tone: 'success', icon: 'checkmark-circle-outline' },
  'active visas': { tone: 'success', icon: 'checkmark-circle-outline' },
  'active permits': { tone: 'success', icon: 'checkmark-circle-outline' },
  active: { tone: 'success', icon: 'checkmark-circle-outline' },
  'expiring soon': { tone: 'warning', icon: 'time-outline' },
  expiring: { tone: 'warning', icon: 'time-outline' },
  expired: { tone: 'danger', icon: 'close-circle-outline' },
  'unresolved alerts': { tone: 'danger', icon: 'notifications-outline' },
  'open alerts': { tone: 'danger', icon: 'notifications-outline' },
  alerts: { tone: 'danger', icon: 'notifications-outline' },
  'pending verification': { tone: 'warning', icon: 'hourglass-outline' },
  'pending requests': { tone: 'warning', icon: 'hourglass-outline' },
  'renewal requests': { tone: 'warning', icon: 'refresh-outline' },
};

export function resolveKpiMeta(label: string, tone?: KpiTone, icon?: string): KpiMeta {
  if (tone && icon) return { tone, icon };
  const key = label.trim().toLowerCase();
  const preset = LABEL_PRESETS[key];
  if (preset) {
    return tone ? { tone, icon: icon || preset.icon } : icon ? { tone: preset.tone, icon } : preset;
  }
  const l = key;
  if (l.includes('expir') && !l.includes('expired')) return { tone: tone || 'warning', icon: icon || 'time-outline' };
  if (l.includes('expired') || l.includes('revoked')) return { tone: tone || 'danger', icon: icon || 'close-circle-outline' };
  if (l.includes('alert') || l.includes('unresolved')) return { tone: tone || 'danger', icon: icon || 'notifications-outline' };
  if (l.includes('active') || l.includes('valid')) return { tone: tone || 'success', icon: icon || 'checkmark-circle-outline' };
  if (l.includes('pending')) return { tone: tone || 'warning', icon: icon || 'hourglass-outline' };
  if (l.includes('permit') || l.includes('visa')) return { tone: tone || 'info', icon: icon || 'document-text-outline' };
  if (l.includes('user') || l.includes('employee') || l.includes('student') || l.includes('foreign')) {
    return { tone: tone || 'info', icon: icon || 'people-outline' };
  }
  return { tone: tone || 'neutral', icon: icon || 'stats-chart-outline' };
}
