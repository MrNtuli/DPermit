import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastController, ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { AnalyticsRefreshService } from '../../services/analytics-refresh.service';

@Component({
  selector: 'app-employer-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Work Visa Compliance" subtitle="Monitor foreign employee permits"></app-page-header>
        <div class="kpi-grid" *ngIf="stats">
          <app-kpi-stat *ngFor="let s of cards" [label]="s.l" [value]="s.v"></app-kpi-stat>
        </div>
        <app-dashboard-charts (summaryChange)="onSummary($event)"></app-dashboard-charts>
        <app-verify-quick-actions
          title="Verify at reception"
          subtitle="Manual lookup or QR scan — same verification flow as university and clinic.">
        </app-verify-quick-actions>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class EmployerDashboardPage implements ViewWillEnter {
  stats: any = null;
  cards: { l: string; v: number }[] = [];
  constructor(
    private api: ApiService,
    private analyticsRefresh: AnalyticsRefreshService,
  ) {}
  ionViewWillEnter() {
    this.analyticsRefresh.requestRefresh();
  }
  onSummary(data: any) {
    this.stats = data;
    this.cards = [
      { l: 'Foreign Employees', v: data.total_foreign_nationals },
      { l: 'Active Work Visas', v: data.active_permits },
      { l: 'Expiring Soon', v: data.expiring_permits },
      { l: 'Expired', v: data.expired_permits },
      { l: 'Pending Requests', v: data.renewal_requests },
      { l: 'Open Alerts', v: data.unresolved_alerts },
    ];
  }
}

@Component({
  selector: 'app-employer-employees',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Foreign Employees</ion-title>
      <ion-buttons slot="end"><ion-button (click)="showForm = !showForm"><ion-icon name="add"></ion-icon></ion-button></ion-buttons>
    </ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-card *ngIf="showForm">
        <ion-card-header><ion-card-title>Register Employee</ion-card-title></ion-card-header>
        <ion-card-content>
          <p class="form-hint">Step 1 of 2 — Enter details from the person&apos;s <strong>passport</strong> (travel document). No permit number yet.</p>
          <form [formGroup]="form" (ngSubmit)="register()">
            <ion-item><ion-input formControlName="full_name" label="Full Name" labelPlacement="stacked"></ion-input></ion-item>
            <ion-item><ion-input formControlName="passport_number" label="Passport Number" labelPlacement="stacked" placeholder="e.g. FN88291034 — as printed on passport"></ion-input></ion-item>
            <ion-item><ion-input formControlName="nationality" label="Nationality" labelPlacement="stacked"></ion-input></ion-item>
            <ion-item><ion-input formControlName="email" label="Email" labelPlacement="stacked"></ion-input></ion-item>
            <ion-item><ion-select formControlName="foreign_national_type" label="Type" labelPlacement="stacked"><ion-select-option value="employee">Employee</ion-select-option><ion-select-option value="contractor">Contractor</ion-select-option></ion-select></ion-item>
            <ion-button expand="block" type="submit">Register</ion-button>
          </form>
        </ion-card-content>
      </ion-card>
      <ion-list>
        <ion-item *ngFor="let e of employees">
          <ion-label><h2>{{ e.full_name }}</h2><p>{{ e.nationality }} · {{ e.passport_number }}</p></ion-label>
          <app-status-badge [status]="e.status"></app-status-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .form-hint {
      font-size: 0.85rem;
      color: var(--dp-text-muted, #64748b);
      margin: 0 0 12px;
      line-height: 1.45;
    }
  `],
  standalone: false,
})
export class EmployerEmployeesPage implements OnInit {
  employees: any[] = [];
  showForm = false;
  form = this.fb.group({
    full_name: ['', Validators.required], passport_number: ['', Validators.required],
    nationality: ['', Validators.required], email: [''], foreign_national_type: ['employee'],
  });
  constructor(private api: ApiService, private fb: FormBuilder, private toast: ToastController) {}
  ngOnInit() { this.load(); }
  load() { this.api.get<any[]>('/foreign-nationals').subscribe(res => this.employees = res.data as any[]); }
  register() {
    this.api.post('/foreign-nationals', this.form.value).subscribe({
      next: async () => { this.showForm = false; this.form.reset({ foreign_national_type: 'employee' }); this.load();
        (await this.toast.create({ message: 'Employee registered', color: 'success', duration: 2000 })).present(); },
      error: async (e) => { (await this.toast.create({ message: e.error?.message || 'Failed', color: 'danger' })).present(); },
    });
  }
}

@Component({
  selector: 'app-employer-permits',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Permit Records</ion-title>
      <ion-buttons slot="end"><ion-button (click)="showForm = !showForm"><ion-icon name="add"></ion-icon></ion-button></ion-buttons>
    </ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-card *ngIf="showForm">
        <ion-card-header><ion-card-title>Capture Work Visa</ion-card-title></ion-card-header>
        <ion-card-content>
          <p class="form-hint">Step 2 of 2 — Enter details from the official <strong>visa / work permit</strong> (as issued by immigration — DigiPermit only monitors compliance).</p>
          <form [formGroup]="form" (ngSubmit)="capture()">
            <ion-item><ion-select formControlName="foreign_national_id" label="Employee" labelPlacement="stacked" (ionChange)="onEmployeeChange($event.detail.value)"><ion-select-option *ngFor="let e of employees" [value]="e.id">{{ e.full_name }}</ion-select-option></ion-select></ion-item>
            <ion-item><ion-select formControlName="permit_type_id" label="Permit Type" labelPlacement="stacked"><ion-select-option *ngFor="let t of types" [value]="t.id">{{ t.name }}</ion-select-option></ion-select></ion-item>
            <ion-item><ion-input formControlName="permit_number" label="Permit Number" labelPlacement="stacked" placeholder="e.g. WP-2024-ACME-001 — from visa label"></ion-input></ion-item>
            <ion-item><ion-input formControlName="passport_number" label="Passport Number" labelPlacement="stacked" placeholder="Filled from employee record"></ion-input></ion-item>
            <ion-item><ion-input formControlName="issue_date" type="date" label="Issue Date" labelPlacement="stacked"></ion-input></ion-item>
            <ion-item><ion-input formControlName="expiry_date" type="date" label="Expiry Date" labelPlacement="stacked"></ion-input></ion-item>
            <ion-button expand="block" type="submit">Capture Record</ion-button>
          </form>
        </ion-card-content>
      </ion-card>
      <ion-list>
        <ion-item *ngFor="let p of permits">
          <ion-label>
            <h2>{{ p.permit_number }}</h2>
            <p>{{ p.foreign_nationals?.full_name }} · {{ p.permit_types?.name }}</p>
            <app-expiry-countdown [expiryDate]="p.expiry_date"></app-expiry-countdown>
          </ion-label>
          <app-status-badge [status]="p.status"></app-status-badge>
          <ion-button slot="end" fill="clear" [routerLink]="['/permit-document', p.id]">
            <ion-icon name="document-text-outline"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    .form-hint {
      font-size: 0.85rem;
      color: var(--dp-text-muted, #64748b);
      margin: 0 0 12px;
      line-height: 1.45;
    }
  `],
  standalone: false,
})
export class EmployerPermitsPage implements OnInit {
  permits: any[] = []; employees: any[] = []; types: any[] = []; showForm = false;
  form = this.fb.group({
    foreign_national_id: ['', Validators.required], permit_type_id: ['', Validators.required],
    permit_number: ['', Validators.required], passport_number: ['', Validators.required],
    issue_date: ['', Validators.required], expiry_date: ['', Validators.required],
  });
  constructor(private api: ApiService, private fb: FormBuilder, private toast: ToastController) {}
  ngOnInit() {
    this.api.get<any[]>('/permits').subscribe(res => this.permits = res.data as any[]);
    this.api.get<any[]>('/foreign-nationals').subscribe(res => this.employees = res.data as any[]);
    this.api.get<any[]>('/permit-types').subscribe(res => this.types = res.data as any[]);
  }
  onEmployeeChange(employeeId: string) {
    const emp = this.employees.find(e => e.id === employeeId);
    if (emp?.passport_number) {
      this.form.patchValue({ passport_number: emp.passport_number });
    }
  }
  capture() {
    this.api.post('/permits', this.form.value).subscribe({
      next: async () => { this.showForm = false; this.ngOnInit();
        (await this.toast.create({ message: 'Permit captured', color: 'success' })).present(); },
      error: async (e) => { (await this.toast.create({ message: e.error?.message || 'Failed', color: 'danger' })).present(); },
    });
  }
}

@Component({
  selector: 'app-employer-requests',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Renewal Requests</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let r of requests">
          <ion-label><h3>{{ r.foreign_nationals?.full_name }}</h3><p>{{ r.notes }}</p></ion-label>
          <ion-button size="small" (click)="approve(r.id)">Approve</ion-button>
          <app-status-badge [status]="r.status"></app-status-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class EmployerRequestsPage implements OnInit {
  requests: any[] = [];
  constructor(private api: ApiService, private toast: ToastController) {}
  ngOnInit() { this.api.get<any[]>('/renewal-update-requests').subscribe(res => this.requests = res.data as any[]); }
  approve(id: string) {
    this.api.put(`/renewal-update-requests/${id}/approve`, {}).subscribe(async () => {
      this.ngOnInit(); (await this.toast.create({ message: 'Approved', color: 'success' })).present();
    });
  }
}
