import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ApiService } from '../../services/api.service';
import { VerificationResult } from '../../interfaces/models';

@Component({
  selector: 'app-verify-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Verification Dashboard" subtitle="Monitor compliance checks and verify permits at checkpoint"></app-page-header>

        <div class="kpi-grid cols-5">
          <div class="kpi-card"><p class="kpi-label">Total Permits</p><p class="kpi-value">{{ stats?.['total_permits'] || 0 }}</p></div>
          <div class="kpi-card accent-success"><p class="kpi-label">Active</p><p class="kpi-value">{{ stats?.['active_permits'] || 0 }}</p></div>
          <div class="kpi-card accent-warning"><p class="kpi-label">Expiring Soon</p><p class="kpi-value">{{ stats?.['expiring_permits'] || 0 }}</p></div>
          <div class="kpi-card accent-danger"><p class="kpi-label">Expired</p><p class="kpi-value">{{ stats?.['expired_permits'] || 0 }}</p></div>
          <div class="kpi-card accent-danger"><p class="kpi-label">Open Alerts</p><p class="kpi-value">{{ stats?.['unresolved_alerts'] || 0 }}</p></div>
        </div>

        <app-dashboard-charts (summaryChange)="stats = $event"></app-dashboard-charts>

        <div class="action-grid">
          <a class="action-card" routerLink="/verification/manual">
            <ion-icon name="search-outline"></ion-icon>
            <div><h3>Manual Lookup</h3><p>Verify by permit number</p></div>
          </a>
          <a class="action-card" routerLink="/verification/qr">
            <ion-icon name="qr-code-outline"></ion-icon>
            <div><h3>QR Scan</h3><p>Camera or manual QR entry</p></div>
          </a>
          <a class="action-card" routerLink="/verification/rfid">
            <ion-icon name="radio-outline"></ion-icon>
            <div><h3>RFID Simulation</h3><p>IoT checkpoint demo</p></div>
          </a>
        </div>

        <div class="panel-card">
          <h2 class="panel-title">Recent Verifications</h2>
          <div class="data-list">
            <ion-item *ngFor="let l of logs" lines="full">
              <ion-label>
                <h3>{{ l.permits?.permit_number || 'N/A' }}</h3>
                <p>{{ l.scan_type | titlecase }} · {{ l.created_at | date:'medium' }}</p>
              </ion-label>
              <app-status-badge [status]="l.verification_result"></app-status-badge>
            </ion-item>
            <ion-item *ngIf="!logs.length" lines="none">
              <ion-label color="medium">No verifications yet. Run a scan to get started.</ion-label>
            </ion-item>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class VerifyDashboardPage implements OnInit {
  logs: any[] = [];
  stats: Record<string, number> | null = null;
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any[]>('/verification-logs', { limit: '10' }).subscribe(res => this.logs = res.data as any[]);
  }
}

@Component({
  selector: 'app-verify-manual',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Verify Permit</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Manual Verification" subtitle="Enter a permit number to check validity"></app-page-header>
        <div class="verify-layout">
          <div class="verify-panel">
            <h2 class="panel-title">Permit Number Lookup</h2>
            <form [formGroup]="form" (ngSubmit)="verify()">
              <div class="form-card">
                <ion-item lines="none">
                  <ion-input formControlName="permit_number" label="Permit Number" labelPlacement="stacked" placeholder="e.g. WP-2024-ACME-001"></ion-input>
                </ion-item>
              </div>
              <ion-button expand="block" type="submit">Verify Permit</ion-button>
            </form>
          </div>
          <div class="verify-panel">
            <h2 class="panel-title">Verification Result</h2>
            <app-verify-result *ngIf="result" [result]="result"></app-verify-result>
            <div class="result-placeholder" *ngIf="!result">
              <ion-icon name="shield-outline"></ion-icon>
              <h3>Awaiting verification</h3>
              <p>Enter a permit number and tap Verify to see the compliance result.</p>
            </div>
          </div>
        </div>
      </div>
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
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Verify Permit</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Scan Permit QR Code" subtitle="Use your device camera or enter the QR value manually"></app-page-header>

        <div class="verify-layout">
          <div class="verify-panel">
            <h2 class="panel-title">Scan Permit QR Code</h2>
            <app-qr-scanner (scanned)="onQrScanned($event)"></app-qr-scanner>
            <p class="divider-label">Or enter manually</p>
            <form [formGroup]="form" (ngSubmit)="verify()">
              <div class="form-card">
                <ion-item lines="none">
                  <ion-input formControlName="qr_value" label="QR Code Value" labelPlacement="stacked"
                    placeholder="DIGIPERMIT:WP-2024-ACME-001"></ion-input>
                </ion-item>
              </div>
              <ion-button expand="block" type="submit" [disabled]="form.invalid">Verify QR Code</ion-button>
            </form>
          </div>
          <div class="verify-panel">
            <h2 class="panel-title">Verification Result</h2>
            <app-verify-result *ngIf="result" [result]="result"></app-verify-result>
            <div class="result-placeholder" *ngIf="!result">
              <ion-icon name="qr-code-outline"></ion-icon>
              <h3>Ready to scan</h3>
              <p>Point your camera at a DigiPermit QR code or paste the value above.</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`.divider-label { text-align: center; font-size: 0.8rem; color: var(--dp-text-muted); margin: 16px 0 8px; }`],
  standalone: false,
})
export class VerifyQrPage {
  form = this.fb.group({ qr_value: ['', Validators.required] });
  result: VerificationResult | null = null;
  constructor(private api: ApiService, private fb: FormBuilder, private toast: ToastController) {}

  onQrScanned(value: string) {
    this.form.patchValue({ qr_value: value });
    this.verify();
  }

  verify() {
    if (this.form.invalid) return;
    this.api.post<VerificationResult>('/verify/qr', this.form.value).subscribe({
      next: async res => {
        this.result = res.data;
        const t = await this.toast.create({ message: 'QR verification complete', duration: 2000, color: 'success' });
        t.present();
      },
      error: async e => {
        const t = await this.toast.create({ message: e.error?.message || 'Verification failed', color: 'danger' });
        t.present();
      },
    });
  }
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
    <div *ngIf="result" class="verify-result-wrap">
      <app-verification-certificate [result]="result"></app-verification-certificate>

      <div class="actions no-print">
        <ion-button expand="block" color="primary" (click)="downloadPng()">
          <ion-icon name="image-outline" slot="start"></ion-icon>
          Download as Picture (PNG)
        </ion-button>
        <ion-button expand="block" color="secondary" (click)="downloadPdf()">
          <ion-icon name="document-outline" slot="start"></ion-icon>
          Download as PDF
        </ion-button>
        <ion-button expand="block" fill="outline" (click)="printDocument()">
          <ion-icon name="print-outline" slot="start"></ion-icon>
          Print Certificate
        </ion-button>
      </div>
    </div>
  `,
  styles: [`
    .verify-result-wrap { max-width: 100%; margin: 0; }
    .actions { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
    @media print {
      .no-print { display: none !important; }
      ion-header, ion-menu, .scanner-panel, form, app-page-header { display: none !important; }
    }
  `],
  standalone: false,
})
export class VerifyResultComponent {
  @Input() result!: VerificationResult;

  constructor(private toast: ToastController) {}

  private fileBase(): string {
    const permit = this.result?.permit_number || this.result?.verification_result || 'verification';
    return `DigiPermit-Verification-${permit}`;
  }

  private async captureElement(): Promise<HTMLCanvasElement | null> {
    const el = document.getElementById('verification-certificate-export');
    if (!el) return null;
    return html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
  }

  async downloadPng() {
    const canvas = await this.captureElement();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${this.fileBase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    (await this.toast.create({ message: 'Verification certificate downloaded', color: 'success', duration: 2000 })).present();
  }

  async downloadPdf() {
    const canvas = await this.captureElement();
    if (!canvas) return;
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth() - 20;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 10, 10, w, h);
    pdf.save(`${this.fileBase()}.pdf`);
    (await this.toast.create({ message: 'PDF downloaded', color: 'success', duration: 2000 })).present();
  }

  printDocument() {
    window.print();
  }
}
