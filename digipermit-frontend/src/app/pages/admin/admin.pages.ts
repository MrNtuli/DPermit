import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Admin Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header title="Platform Overview" subtitle="Global compliance monitoring statistics"></app-page-header>
      <ion-grid *ngIf="stats">
        <ion-row>
          <ion-col size="6" sizeMd="3" *ngFor="let s of statCards">
            <ion-card class="stat-card"><ion-card-content><h2>{{ s.value }}</h2><p>{{ s.label }}</p></ion-card-content></ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
    </ion-content>
  `,
  styles: [`.stat-card h2 { font-size:2rem; margin:0; color:var(--ion-color-primary); } .stat-card p { margin:4px 0 0; color:var(--ion-color-medium); font-size:0.85rem; }`],
  standalone: false,
})
export class AdminDashboardPage implements OnInit {
  stats: Record<string, number> | null = null;
  statCards: { label: string; value: number }[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<Record<string, number>>('/analytics/summary').subscribe({
      next: res => {
        this.stats = res.data;
        this.statCards = [
          { label: 'Organisations', value: res.data['total_organisations'] || 0 },
          { label: 'Users', value: res.data['total_users'] || 0 },
          { label: 'Foreign Nationals', value: res.data['total_foreign_nationals'] || 0 },
          { label: 'Total Permits', value: res.data['total_permits'] || 0 },
          { label: 'Active', value: res.data['active_permits'] || 0 },
          { label: 'Expiring Soon', value: res.data['expiring_permits'] || 0 },
          { label: 'Expired', value: res.data['expired_permits'] || 0 },
          { label: 'Unresolved Alerts', value: res.data['unresolved_alerts'] || 0 },
        ];
        this.loading = false;
      },
      error: () => this.loading = false,
    });
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
    else if (path.includes('verification-logs')) { this.title = 'Verification Logs'; this.endpoint = '/verification-logs'; }
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
  selector: 'app-admin-analytics',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Analytics</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header title="Analytics" subtitle="Power BI ready data views"></app-page-header>
      <ion-card *ngFor="let section of sections">
        <ion-card-header><ion-card-title>{{ section.title }}</ion-card-title></ion-card-header>
        <ion-card-content><pre>{{ section.data | json }}</pre></ion-card-content>
      </ion-card>
    </ion-content>
  `,
  standalone: false,
})
export class AdminAnalyticsPage implements OnInit {
  sections: { title: string; data: unknown }[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    const endpoints = [
      { title: 'Expiry Forecast', path: '/analytics/expiry' },
      { title: 'Verification Summary', path: '/analytics/verifications' },
      { title: 'Alert Summary', path: '/analytics/alerts' },
      { title: 'Suspicious Activity', path: '/analytics/suspicious-activity' },
    ];
    endpoints.forEach(e => {
      this.api.get(e.path).subscribe(res => this.sections.push({ title: e.title, data: res.data }));
    });
  }
}
