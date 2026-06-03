import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-university-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>International Students</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Study Visa Compliance" subtitle="Monitor international student permits"></app-page-header>
        <div class="kpi-grid" *ngIf="cards.length">
          <app-kpi-stat *ngFor="let s of cards" [label]="s.l" [value]="s.v"></app-kpi-stat>
        </div>
        <app-dashboard-charts (summaryChange)="onSummary($event)"></app-dashboard-charts>
        <app-verify-quick-actions
          title="Verify student permit"
          subtitle="Manual lookup or QR scan at international office desk.">
        </app-verify-quick-actions>
      </div>
    </ion-content>
  `,
  styles: [`h2{font-size:1.8rem;margin:0;color:var(--ion-color-primary)}`],
  standalone: false,
})
export class UniversityDashboardPage {
  cards: { l: string; v: number }[] = [];
  constructor(private api: ApiService) {}
  onSummary(data: any) {
    this.cards = [
      { l: 'Students', v: data.total_foreign_nationals }, { l: 'Active Visas', v: data.active_permits },
      { l: 'Expiring', v: data.expiring_permits }, { l: 'Alerts', v: data.unresolved_alerts },
    ];
  }
}

@Component({
  selector: 'app-university-list',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>{{ title }}</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list><ion-item *ngFor="let item of items"><ion-label><h2>{{ item.full_name || item.permit_number }}</h2><p>{{ item.nationality || item.permit_types?.name }}</p></ion-label><app-status-badge [status]="item.status"></app-status-badge></ion-item></ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class UniversityListPage implements OnInit {
  title = ''; items: any[] = [];
  constructor(private api: ApiService) {
    this.title = window.location.pathname.includes('students') ? 'International Students' : 'Study Visa Records';
  }
  ngOnInit() {
    const ep = window.location.pathname.includes('students') ? '/foreign-nationals' : '/permits';
    this.api.get<any[]>(ep).subscribe(res => this.items = res.data as any[]);
  }
}
