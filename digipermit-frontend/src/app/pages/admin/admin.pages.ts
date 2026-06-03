import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import {
  ForeignNational, Organisation, ORG_REQUIRED_ROLES, ORGANISATION_TYPE_LABELS, ORGANISATION_TYPE_OPTIONS,
  ROLE_LABELS, ROLE_OPTIONS, UserProfile,
} from '../../interfaces/models';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Platform Overview" subtitle="Global compliance monitoring statistics"></app-page-header>
        <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
        <div class="kpi-grid" *ngIf="!loading && stats">
          <app-kpi-stat *ngFor="let s of statCards" [label]="s.label" [value]="s.value"></app-kpi-stat>
        </div>
        <app-dashboard-charts (summaryChange)="onSummary($event)"></app-dashboard-charts>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class AdminDashboardPage implements OnInit {
  stats: Record<string, number> | null = null;
  statCards: { label: string; value: number }[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  onSummary(data: Record<string, number>) {
    this.stats = data;
    this.statCards = [
      { label: 'Organisations', value: data['total_organisations'] || 0 },
      { label: 'Users', value: data['total_users'] || 0 },
      { label: 'Foreign Nationals', value: data['total_foreign_nationals'] || 0 },
      { label: 'Total Permits', value: data['total_permits'] || 0 },
      { label: 'Active', value: data['active_permits'] || 0 },
      { label: 'Expiring Soon', value: data['expiring_permits'] || 0 },
      { label: 'Expired', value: data['expired_permits'] || 0 },
      { label: 'Unresolved Alerts', value: data['unresolved_alerts'] || 0 },
    ];
    this.loading = false;
  }

  ngOnInit() {}
}

@Component({
  selector: 'app-admin-organisations',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
        <ion-title>Organisations</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/admin/organisations/create"><ion-icon name="add"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-page-header
        title="Organisations"
        subtitle="Register employers, universities, clinics, and other participating organisations (FR-3.2).">
      </app-page-header>
      <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
      <ion-list *ngIf="!loading && organisations.length">
        <ion-item *ngFor="let o of organisations">
          <ion-label>
            <h2>{{ o.name }}</h2>
            <p>{{ orgTypeLabel(o.organisation_type) }} · {{ o.registration_number }}</p>
            <p>{{ o.email }}</p>
          </ion-label>
          <app-status-badge [status]="o.status"></app-status-badge>
        </ion-item>
      </ion-list>
      <app-empty-state *ngIf="!loading && !organisations.length" message="No organisations yet. Add the first one."></app-empty-state>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button routerLink="/admin/organisations/create"><ion-icon name="add"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  standalone: false,
})
export class AdminOrganisationsPage implements OnInit {
  organisations: Organisation[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<Organisation[]>('/organisations').subscribe({
      next: res => { this.organisations = res.data as Organisation[]; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  orgTypeLabel(type: string) {
    return ORGANISATION_TYPE_LABELS[type] || type;
  }
}

@Component({
  selector: 'app-admin-create-organisation',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/admin/organisations"></ion-back-button></ion-buttons>
        <ion-title>Add Organisation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-page-header
        title="Register Organisation"
        subtitle="Create a new participating organisation before provisioning its users.">
      </app-page-header>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-item><ion-input formControlName="name" label="Organisation Name" labelPlacement="stacked"></ion-input></ion-item>
        <ion-item>
          <ion-select formControlName="organisation_type" label="Type" labelPlacement="stacked">
            <ion-select-option *ngFor="let t of typeOptions" [value]="t.value">{{ t.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item><ion-input formControlName="registration_number" label="Registration Number" labelPlacement="stacked" placeholder="e.g. EMP-2026-001"></ion-input></ion-item>
        <ion-item><ion-input formControlName="email" type="email" label="Contact Email" labelPlacement="stacked"></ion-input></ion-item>
        <ion-item><ion-input formControlName="phone_number" label="Phone (optional)" labelPlacement="stacked"></ion-input></ion-item>
        <ion-item><ion-textarea formControlName="address" label="Address (optional)" labelPlacement="stacked" [autoGrow]="true"></ion-textarea></ion-item>
        <ion-button expand="block" type="submit" [disabled]="form.invalid || submitting" class="ion-margin-top">
          Create Organisation
        </ion-button>
      </form>
    </ion-content>
  `,
  standalone: false,
})
export class AdminCreateOrganisationPage {
  typeOptions = ORGANISATION_TYPE_OPTIONS;
  submitting = false;

  form = this.fb.group({
    name: ['', Validators.required],
    organisation_type: ['employer', Validators.required],
    registration_number: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone_number: [''],
    address: [''],
  });

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastController
  ) {}

  async submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const v = this.form.value;
    const body: Record<string, string> = {
      name: v.name!,
      organisation_type: v.organisation_type!,
      registration_number: v.registration_number!,
      email: v.email!,
    };
    if (v.phone_number) body['phone_number'] = v.phone_number;
    if (v.address) body['address'] = v.address;

    this.api.post<Organisation>('/organisations', body).subscribe({
      next: async () => {
        this.submitting = false;
        const t = await this.toast.create({ message: 'Organisation created', color: 'success', duration: 2500 });
        t.present();
        this.router.navigate(['/admin/organisations']);
      },
      error: async (err) => {
        this.submitting = false;
        const t = await this.toast.create({
          message: err.error?.message || 'Failed to create organisation',
          color: 'danger',
          duration: 3500,
        });
        t.present();
      },
    });
  }
}

@Component({
  selector: 'app-admin-verification-logs',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
        <ion-title>Verification Logs</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header
          title="Verification Logs"
          subtitle="Audit trail of manual lookups, QR scans, and RFID checkpoint events across all organisations.">
        </app-page-header>

        <div class="log-filters panel-card">
          <ion-item lines="none">
            <ion-select label="Scan type" labelPlacement="stacked" interface="popover"
              [(ngModel)]="filterScanType" (ionChange)="loadLogs()">
              <ion-select-option value="">All types</ion-select-option>
              <ion-select-option value="manual">Manual lookup</ion-select-option>
              <ion-select-option value="qr">QR scan</ion-select-option>
              <ion-select-option value="rfid">RFID</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item lines="none">
            <ion-select label="Outcome" labelPlacement="stacked" interface="popover"
              [(ngModel)]="filterResult" (ionChange)="loadLogs()">
              <ion-select-option value="">All outcomes</ion-select-option>
              <ion-select-option value="valid">Valid</ion-select-option>
              <ion-select-option value="expiring_soon">Expiring soon</ion-select-option>
              <ion-select-option value="pending_verification">Pending verification</ion-select-option>
              <ion-select-option value="expired">Expired</ion-select-option>
              <ion-select-option value="not_found">Not found</ion-select-option>
              <ion-select-option value="suspicious">Suspicious</ion-select-option>
            </ion-select>
          </ion-item>
        </div>

        <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
        <div class="data-list log-list" *ngIf="!loading && logs.length">
          <ion-item *ngFor="let l of logs" lines="full" class="log-row">
            <ion-icon [name]="scanIcon(l.scan_type)" slot="start" class="log-icon" aria-hidden="true"></ion-icon>
            <ion-label>
              <h2>{{ l.permits?.permit_number || 'Unknown permit' }}</h2>
              <p class="log-meta">
                {{ l.profiles?.full_name || 'Unknown officer' }}
                · {{ scanLabel(l.scan_type) }}
                <span *ngIf="l.organisations?.name"> · {{ l.organisations.name }}</span>
              </p>
              <p class="log-time">{{ l.created_at | date:'medium' }}</p>
              <p class="log-note" *ngIf="l.verification_note">{{ l.verification_note }}</p>
            </ion-label>
            <app-status-badge [status]="l.verification_result"></app-status-badge>
          </ion-item>
        </div>
        <app-empty-state *ngIf="!loading && !logs.length"
          message="No verification logs match the selected filters.">
        </app-empty-state>
      </div>
    </ion-content>
  `,
  styles: [`
    .log-filters {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
      margin-bottom: 16px;
    }
    @media (min-width: 576px) {
      .log-filters { grid-template-columns: 1fr 1fr; }
    }
    .log-list { margin-top: 8px; }
    .log-icon {
      color: var(--dp-emerald, #1f7a5a);
      font-size: 1.4rem;
      margin-inline-end: 12px;
    }
    .log-meta, .log-time {
      font-size: 0.82rem;
      color: var(--dp-text-muted, #64748b);
    }
    .log-time { margin-top: 4px; }
    .log-note {
      font-size: 0.78rem;
      font-style: italic;
      margin-top: 6px;
    }
    .log-row ion-label h2 {
      font-weight: 700;
      color: var(--dp-forest-deep, #0f3d2e);
    }
  `],
  standalone: false,
})
export class AdminVerificationLogsPage implements OnInit {
  logs: any[] = [];
  loading = true;
  filterScanType = '';
  filterResult = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    const params: Record<string, string> = { limit: '100' };
    if (this.filterScanType) params['scan_type'] = this.filterScanType;
    if (this.filterResult) params['verification_result'] = this.filterResult;
    this.api.get<any[]>('/verification-logs', params).subscribe({
      next: res => {
        this.logs = (res.data as any[]) || [];
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  scanLabel(scanType: string): string {
    const map: Record<string, string> = {
      manual: 'Manual lookup',
      qr: 'QR scan',
      rfid: 'RFID scan',
      camera_simulation: 'Camera simulation',
    };
    return map[scanType] || (scanType || 'Scan').replace(/_/g, ' ');
  }

  scanIcon(scanType: string): string {
    const map: Record<string, string> = {
      manual: 'search-outline',
      qr: 'qr-code-outline',
      rfid: 'radio-outline',
      camera_simulation: 'camera-outline',
    };
    return map[scanType] || 'scan-outline';
  }
}

@Component({
  selector: 'app-admin-list',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>{{ title }}</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header [title]="title"></app-page-header>
      <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
      <ion-list *ngIf="!loading && items.length">
        <ion-item *ngFor="let item of items" detail="false">
          <ion-label><h2>{{ getLabel(item) }}</h2><p>{{ getSub(item) }}</p></ion-label>
          <app-status-badge *ngIf="item.status" [status]="item.status"></app-status-badge>
          <app-status-badge *ngIf="item.is_active !== undefined" [status]="item.is_active ? 'active' : 'archived'"></app-status-badge>
        </ion-item>
      </ion-list>
      <app-empty-state *ngIf="!loading && !items.length"></app-empty-state>
    </ion-content>
  `,
  standalone: false,
})
export class AdminListPage implements OnInit {
  title = '';
  endpoint = '';
  items: any[] = [];
  loading = true;

  constructor(private api: ApiService) {
    const path = window.location.pathname;
    if (path.includes('organisations')) { this.title = 'Organisations'; this.endpoint = '/organisations'; }
    else if (path.includes('users')) { this.title = 'Users & Roles'; this.endpoint = '/users'; }
    else if (path.includes('permit-types')) { this.title = 'Permit Types'; this.endpoint = '/permit-types'; }
    else if (path.includes('permits')) { this.title = 'All Permits'; this.endpoint = '/permits'; }
    else if (path.includes('alerts')) { this.title = 'Alerts'; this.endpoint = '/alerts'; }
    else if (path.includes('iot-devices')) { this.title = 'IoT Devices'; this.endpoint = '/iot/devices'; }
  }

  ngOnInit() {
    this.api.get<any[]>(this.endpoint).subscribe({
      next: res => { this.items = res.data as any[]; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  getLabel(item: any) {
    return item.name || item.full_name || item.permit_number || item.title || item.device_name || item.alert_type || item.id;
  }
  getSub(item: any) {
    return item.email || item.role || item.message || item.verification_result || item.organisation_type || '';
  }
}

@Component({
  selector: 'app-admin-users',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
        <ion-title>Users &amp; Roles</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/admin/users/create"><ion-icon name="person-add"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-page-header
        title="Users &amp; Roles"
        subtitle="Accounts are created by system administrators (FR-3.1). HR registers employee records separately.">
      </app-page-header>
      <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
      <ion-list *ngIf="!loading && users.length">
        <ion-item *ngFor="let u of users">
          <ion-label>
            <h2>{{ u.full_name }}</h2>
            <p>{{ u.email }} · {{ roleLabel(u.role) }}</p>
            <p *ngIf="u.organisations">{{ u.organisations.name }}</p>
          </ion-label>
          <app-status-badge [status]="u.status"></app-status-badge>
        </ion-item>
      </ion-list>
      <app-empty-state *ngIf="!loading && !users.length" message="No users yet. Create the first account."></app-empty-state>
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button routerLink="/admin/users/create"><ion-icon name="add"></ion-icon></ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  standalone: false,
})
export class AdminUsersPage implements OnInit {
  users: UserProfile[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<UserProfile[]>('/users').subscribe({
      next: res => { this.users = res.data as UserProfile[]; this.loading = false; },
      error: () => this.loading = false,
    });
  }

  roleLabel(role: string) {
    return ROLE_LABELS[role] || role;
  }
}

@Component({
  selector: 'app-admin-create-user',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/admin/users"></ion-back-button></ion-buttons>
        <ion-title>Create User</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-page-header
        title="Provision User Account"
        subtitle="Assign role and organisation. For foreign nationals, link an existing employee record (FR-4.3).">
      </app-page-header>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <ion-item><ion-input formControlName="full_name" label="Full Name" labelPlacement="stacked"></ion-input></ion-item>
        <ion-item><ion-input formControlName="email" type="email" label="Email" labelPlacement="stacked"></ion-input></ion-item>
        <ion-item><ion-input formControlName="password" type="password" label="Temporary Password" labelPlacement="stacked"></ion-input></ion-item>
        <ion-item><ion-input formControlName="phone_number" label="Phone (optional)" labelPlacement="stacked"></ion-input></ion-item>
        <ion-item>
          <ion-select formControlName="role" label="Role" labelPlacement="stacked" (ionChange)="onRoleChange()">
            <ion-select-option *ngFor="let r of roleOptions" [value]="r.value">{{ r.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item *ngIf="needsOrganisation">
          <ion-select formControlName="organisation_id" label="Organisation" labelPlacement="stacked" (ionChange)="onOrgChange()">
            <ion-select-option *ngFor="let o of organisations" [value]="o.id">{{ o.name }} ({{ o.organisation_type }})</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item *ngIf="isForeignNational">
          <ion-select formControlName="foreign_national_id" label="Link Foreign National Record" labelPlacement="stacked">
            <ion-select-option *ngFor="let fn of foreignNationals" [value]="fn.id">
              {{ fn.full_name }} · {{ fn.passport_number }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-note class="hint" *ngIf="isForeignNational && !foreignNationals.length">
          No unlinked employee records for this organisation. HR must register the employee first.
        </ion-note>
        <ion-button expand="block" type="submit" [disabled]="form.invalid || submitting" class="ion-margin-top">
          Create User Account
        </ion-button>
      </form>
    </ion-content>
  `,
  styles: [`.hint { display:block; padding:8px 16px; font-size:0.85rem; color:var(--ion-color-medium); }`],
  standalone: false,
})
export class AdminCreateUserPage implements OnInit {
  roleOptions = ROLE_OPTIONS;
  organisations: Organisation[] = [];
  foreignNationals: ForeignNational[] = [];
  allForeignNationals: ForeignNational[] = [];
  linkedFnIds = new Set<string>();
  submitting = false;

  form = this.fb.group({
    full_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone_number: [''],
    role: ['employer_hr', Validators.required],
    organisation_id: [''],
    foreign_national_id: [''],
  });

  constructor(
    private api: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastController
  ) {}

  get needsOrganisation() {
    return ORG_REQUIRED_ROLES.includes(this.form.value.role || '');
  }

  get isForeignNational() {
    return this.form.value.role === 'foreign_national';
  }

  ngOnInit() {
    this.api.get<Organisation[]>('/organisations').subscribe(res => {
      this.organisations = (res.data as Organisation[]).filter(o => o.status === 'active');
    });
    this.api.get<UserProfile[]>('/users').subscribe(res => {
      (res.data as UserProfile[]).forEach(u => {
        if (u.foreign_national_id) this.linkedFnIds.add(u.foreign_national_id);
      });
    });
    this.api.get<ForeignNational[]>('/foreign-nationals').subscribe(res => {
      this.allForeignNationals = res.data as ForeignNational[];
      this.filterForeignNationals();
    });
    this.updateValidators();
  }

  onRoleChange() {
    this.form.patchValue({ organisation_id: '', foreign_national_id: '' });
    this.updateValidators();
    this.filterForeignNationals();
  }

  onOrgChange() {
    this.form.patchValue({ foreign_national_id: '' });
    this.filterForeignNationals();
  }

  updateValidators() {
    const orgCtrl = this.form.get('organisation_id')!;
    const fnCtrl = this.form.get('foreign_national_id')!;
    if (this.needsOrganisation) {
      orgCtrl.setValidators(Validators.required);
    } else {
      orgCtrl.clearValidators();
      orgCtrl.setValue('');
    }
    if (this.isForeignNational) {
      fnCtrl.setValidators(Validators.required);
    } else {
      fnCtrl.clearValidators();
      fnCtrl.setValue('');
    }
    orgCtrl.updateValueAndValidity();
    fnCtrl.updateValueAndValidity();
  }

  filterForeignNationals() {
    const orgId = this.form.value.organisation_id;
    this.foreignNationals = this.allForeignNationals.filter(fn =>
      fn.status === 'active' &&
      (!orgId || fn.organisation_id === orgId) &&
      !this.linkedFnIds.has(fn.id)
    );
  }

  async submit() {
    if (this.form.invalid) return;
    this.submitting = true;
    const v = this.form.value;
    const body: Record<string, string> = {
      full_name: v.full_name!,
      email: v.email!,
      password: v.password!,
      role: v.role!,
    };
    if (v.phone_number) body['phone_number'] = v.phone_number;
    if (v.organisation_id) body['organisation_id'] = v.organisation_id;
    if (v.foreign_national_id) body['foreign_national_id'] = v.foreign_national_id;

    this.api.post('/users', body).subscribe({
      next: async () => {
        this.submitting = false;
        const t = await this.toast.create({ message: 'User account created', color: 'success', duration: 2500 });
        t.present();
        this.router.navigate(['/admin/users']);
      },
      error: async (err) => {
        this.submitting = false;
        const t = await this.toast.create({
          message: err.error?.message || 'Failed to create user',
          color: 'danger',
          duration: 3500,
        });
        t.present();
      },
    });
  }
}

@Component({
  selector: 'app-admin-analytics',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Analytics</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Platform Analytics" subtitle="Charts driven by live database views and verification logs"></app-page-header>
        <app-dashboard-charts></app-dashboard-charts>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class AdminAnalyticsPage {}
