import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { VerificationResult } from '../../interfaces/models';

@Component({
  selector: 'app-verify-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Verification</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header title="Verification Dashboard" subtitle="Verify permits by number, QR, or RFID"></app-page-header>
      <ion-grid>
        <ion-row>
          <ion-col size="12" sizeMd="4"><ion-button expand="block" routerLink="/verification/manual">Manual Lookup</ion-button></ion-col>
          <ion-col size="12" sizeMd="4"><ion-button expand="block" routerLink="/verification/qr" color="secondary">QR Scan</ion-button></ion-col>
          <ion-col size="12" sizeMd="4"><ion-button expand="block" routerLink="/verification/rfid" color="tertiary">RFID Simulation</ion-button></ion-col>
        </ion-row>
      </ion-grid>
      <h3>Recent Verifications</h3>
      <ion-list>
        <ion-item *ngFor="let l of logs">
          <ion-label><h3>{{ l.permits?.permit_number || 'N/A' }}</h3><p>{{ l.scan_type }} · {{ l.created_at | date:'short' }}</p></ion-label>
          <app-status-badge [status]="l.verification_result"></app-status-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class VerifyDashboardPage implements OnInit {
  logs: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<any[]>('/verification-logs', { limit: '10' }).subscribe(res => this.logs = res.data as any[]); }
}

@Component({
  selector: 'app-verify-manual',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Manual Verification</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="verify()">
        <ion-item><ion-input formControlName="permit_number" label="Permit Number" labelPlacement="stacked" placeholder="e.g. WP-2024-ACME-001"></ion-input></ion-item>
        <ion-button expand="block" type="submit">Verify</ion-button>
      </form>
      <app-verify-result *ngIf="result" [result]="result"></app-verify-result>
    </ion-content>
  `,
  standalone: false,
})
export class VerifyManualPage {
  form = this.fb.group({ permit_number: ['', Validators.required] });
  result: VerificationResult | null = null;
  constructor(private api: ApiService, private fb: FormBuilder, private toast: ToastController) {}
  verify() {
    this.api.post<VerificationResult>('/verify', this.form.value).subscribe({
      next: res => this.result = res.data,
      error: async e => (await this.toast.create({ message: e.error?.message || 'Failed', color: 'danger' })).present(),
    });
  }
}

@Component({
  selector: 'app-verify-qr',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>QR Verification</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="verify()">
        <ion-item><ion-input formControlName="qr_value" label="QR Code Value" labelPlacement="stacked" placeholder="DIGIPERMIT:WP-2024-ACME-001"></ion-input></ion-item>
        <ion-button expand="block" type="submit">Scan & Verify</ion-button>
      </form>
      <app-verify-result *ngIf="result" [result]="result"></app-verify-result>
    </ion-content>
  `,
  standalone: false,
})
export class VerifyQrPage {
  form = this.fb.group({ qr_value: ['', Validators.required] });
  result: VerificationResult | null = null;
  constructor(private api: ApiService, private fb: FormBuilder) {}
  verify() { this.api.post<VerificationResult>('/verify/qr', this.form.value).subscribe(res => this.result = res.data); }
}

@Component({
  selector: 'app-verify-rfid',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>RFID Simulation</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <form [formGroup]="form" (ngSubmit)="verify()">
        <ion-item><ion-select formControlName="device_id" label="IoT Device" labelPlacement="stacked"><ion-select-option *ngFor="let d of devices" [value]="d.id">{{ d.device_name }}</ion-select-option></ion-select></ion-item>
        <ion-item><ion-input formControlName="rfid_tag" label="RFID Tag" labelPlacement="stacked" placeholder="RFID-ACME-001"></ion-input></ion-item>
        <ion-button expand="block" type="submit">Simulate RFID Scan</ion-button>
      </form>
      <app-verify-result *ngIf="result" [result]="result"></app-verify-result>
    </ion-content>
  `,
  standalone: false,
})
export class VerifyRfidPage implements OnInit {
  form = this.fb.group({ device_id: ['', Validators.required], rfid_tag: ['', Validators.required] });
  devices: any[] = []; result: VerificationResult | null = null;
  constructor(private api: ApiService, private fb: FormBuilder) {}
  ngOnInit() { this.api.get<any[]>('/iot/devices').subscribe(res => this.devices = res.data as any[]); }
  verify() {
    this.api.post<any>('/iot/simulate', { ...this.form.value, scan_type: 'rfid' }).subscribe(res => this.result = res.data);
  }
}

@Component({
  selector: 'app-verify-logs',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Verification Logs</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <ion-list>
        <ion-item *ngFor="let l of logs">
          <ion-label><h3>{{ l.permits?.permit_number }}</h3><p>{{ l.scan_type }} · {{ l.created_at | date:'medium' }}</p></ion-label>
          <app-status-badge [status]="l.verification_result"></app-status-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class VerifyLogsPage implements OnInit {
  logs: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<any[]>('/verification-logs').subscribe(res => this.logs = res.data as any[]); }
}

@Component({
  selector: 'app-verify-result',
  template: `
    <ion-card [color]="cardColor" *ngIf="result">
      <ion-card-header><ion-card-title>Verification Result</ion-card-title><ion-card-subtitle>{{ result.timestamp | date:'medium' }}</ion-card-subtitle></ion-card-header>
      <ion-card-content>
        <h2><app-status-badge [status]="result.verification_result"></app-status-badge></h2>
        <p *ngIf="result.foreign_national_name"><strong>Name:</strong> {{ result.foreign_national_name }}</p>
        <p *ngIf="result.masked_passport_number"><strong>Passport:</strong> {{ result.masked_passport_number }}</p>
        <p *ngIf="result.permit_number"><strong>Permit:</strong> {{ result.permit_number }}</p>
        <p *ngIf="result.permit_type"><strong>Type:</strong> {{ result.permit_type }}</p>
        <p *ngIf="result.expiry_date"><strong>Expiry:</strong> {{ result.expiry_date }}</p>
        <p *ngIf="result.warning_message" class="warning">{{ result.warning_message }}</p>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`.warning { color: var(--ion-color-danger); font-weight:600; margin-top:12px; }`],
  standalone: false,
})
export class VerifyResultComponent {
  @Input() result!: VerificationResult;
  get cardColor() {
    const r = this.result?.verification_result;
    if (r === 'valid') return 'success';
    if (r === 'expiring_soon') return 'warning';
    return 'danger';
  }
}
