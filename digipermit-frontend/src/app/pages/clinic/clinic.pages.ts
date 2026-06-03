import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-clinic-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Clinic Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Immigration Document Monitoring" subtitle="Foreign patient and employee records"></app-page-header>
        <div class="kpi-grid cols-3" *ngIf="cards.length">
          <div class="kpi-card" *ngFor="let s of cards">
            <p class="kpi-label">{{ s.l }}</p>
            <p class="kpi-value">{{ s.v }}</p>
          </div>
        </div>
        <app-verify-quick-actions
          title="Verify patient permit"
          subtitle="Manual lookup or QR scan at clinic reception.">
        </app-verify-quick-actions>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class ClinicDashboardPage implements OnInit {
  cards: { l: string; v: number }[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/analytics/summary').subscribe(res => {
      this.cards = [
        { l: 'Records', v: res.data.total_foreign_nationals },
        { l: 'Active Permits', v: res.data.active_permits },
        { l: 'Alerts', v: res.data.unresolved_alerts },
      ];
    });
  }
}

@Component({
  selector: 'app-clinic-list',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>{{ title }}</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list><ion-item *ngFor="let item of items"><ion-label><h2>{{ item.full_name || item.permit_number }}</h2><p>{{ item.foreign_national_type || item.permit_types?.name }}</p></ion-label><app-status-badge [status]="item.status"></app-status-badge></ion-item></ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class ClinicListPage implements OnInit {
  title = ''; items: any[] = [];
  constructor(private api: ApiService) {
    this.title = window.location.pathname.includes('patients') ? 'Foreign Nationals' : 'Permit Records';
  }
  ngOnInit() {
    const ep = window.location.pathname.includes('patients') ? '/foreign-nationals' : '/permits';
    this.api.get<any[]>(ep).subscribe(res => this.items = res.data as any[]);
  }
}
