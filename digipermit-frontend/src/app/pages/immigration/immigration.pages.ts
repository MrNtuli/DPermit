import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-immigration-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Compliance Review</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Senior Compliance Officer" subtitle="Simulated immigration compliance review"></app-page-header>
        <ion-note color="warning" class="sim-note">Academic simulation — not an official government system.</ion-note>
        <div class="kpi-grid" *ngIf="cards.length">
          <app-kpi-stat *ngFor="let s of cards" [label]="s.l" [value]="s.v"></app-kpi-stat>
        </div>
        <app-dashboard-charts (summaryChange)="onSummary($event)"></app-dashboard-charts>
      </div>
    </ion-content>
  `,
  styles: [`.sim-note { display:block; margin-bottom:16px; padding:10px 12px; background:#fff8e1; border-radius:8px; font-size:0.85rem; }`],
  standalone: false,
})
export class ImmigrationDashboardPage {
  cards: { l: string; v: number }[] = [];
  constructor(private api: ApiService) {}
  onSummary(data: any) {
    this.cards = [
      { l: 'Pending Verification', v: data.pending_verification }, { l: 'Renewal Requests', v: data.renewal_requests },
      { l: 'Unresolved Alerts', v: data.unresolved_alerts },
    ];
  }
}

@Component({
  selector: 'app-immigration-pending',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Pending Permits</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let p of permits">
          <ion-label><h2>{{ p.permit_number }}</h2><p>{{ p.foreign_nationals?.full_name }} · {{ p.permit_types?.name }}</p></ion-label>
          <ion-button size="small" (click)="validate(p.id)">Validate</ion-button>
          <ion-button size="small" color="danger" (click)="reject(p.id)">Reject</ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class ImmigrationPendingPage implements OnInit {
  permits: any[] = [];
  constructor(private api: ApiService, private toast: ToastController) {}
  ngOnInit() { this.api.get<any[]>('/permits', { status: 'pending_verification' }).subscribe(res => this.permits = res.data as any[]); }
  validate(id: string) { this.api.put(`/permits/${id}/validate`, {}).subscribe(async () => { this.ngOnInit(); (await this.toast.create({ message: 'Validated', color: 'success' })).present(); }); }
  reject(id: string) { this.api.put(`/permits/${id}/reject`, { reason: 'Incorrect record' }).subscribe(async () => { this.ngOnInit(); (await this.toast.create({ message: 'Rejected', color: 'warning' })).present(); }); }
}

@Component({
  selector: 'app-immigration-suspicious',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Suspicious Records</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list><ion-item *ngFor="let a of alerts"><ion-label><h3>{{ a.alert_type }}</h3><p>{{ a.message }}</p></ion-label><app-status-badge [status]="a.priority"></app-status-badge></ion-item></ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class ImmigrationSuspiciousPage implements OnInit {
  alerts: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<any[]>('/analytics/suspicious-activity').subscribe(res => this.alerts = res.data as any[]); }
}
