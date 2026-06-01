import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-immigration-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Compliance Review</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header title="Senior Compliance Officer" subtitle="Simulated immigration compliance review — not an official government system"></app-page-header>
      <ion-note color="warning" class="ion-padding">This is an academic simulation role. DigiPermit does not replace official immigration authorities.</ion-note>
      <ion-grid><ion-row><ion-col size="6" *ngFor="let s of cards"><ion-card><ion-card-content><h2>{{ s.v }}</h2><p>{{ s.l }}</p></ion-card-content></ion-card></ion-col></ion-row></ion-grid>
    </ion-content>
  `,
  standalone: false,
})
export class ImmigrationDashboardPage implements OnInit {
  cards: { l: string; v: number }[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/analytics/summary').subscribe(res => {
      this.cards = [
        { l: 'Pending Verification', v: res.data.pending_verification }, { l: 'Renewal Requests', v: res.data.renewal_requests },
        { l: 'Unresolved Alerts', v: res.data.unresolved_alerts },
      ];
    });
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
