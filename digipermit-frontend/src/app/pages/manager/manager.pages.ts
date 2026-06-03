import { Component, OnInit } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { AnalyticsRefreshService } from '../../services/analytics-refresh.service';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Analytics Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Read-Only Compliance Overview" subtitle="Manager / Auditor view — live platform analytics"></app-page-header>
        <div class="kpi-grid" *ngIf="cards.length">
          <app-kpi-stat *ngFor="let s of cards" [label]="s.l" [value]="s.v"></app-kpi-stat>
        </div>
        <app-dashboard-charts (summaryChange)="onSummary($event)"></app-dashboard-charts>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class ManagerDashboardPage implements ViewWillEnter {
  cards: { l: string; v: number }[] = [];
  constructor(
    private api: ApiService,
    private analyticsRefresh: AnalyticsRefreshService,
  ) {}
  ionViewWillEnter() {
    this.analyticsRefresh.requestRefresh();
  }
  onSummary(data: any) {
    this.cards = [
      { l: 'Total Permits', v: data.total_permits },
      { l: 'Active', v: data.active_permits },
      { l: 'Expired', v: data.expired_permits },
      { l: 'Alerts', v: data.unresolved_alerts },
    ];
  }
}

@Component({
  selector: 'app-manager-reports',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Reports & AI Insights</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header title="Executive Reports" subtitle="AI insights and compliance summary"></app-page-header>
        <ion-card>
          <ion-card-header><ion-card-title>AI Executive Insights</ion-card-title><ion-card-subtitle>Rule-based analytics workflow (IS3)</ion-card-subtitle></ion-card-header>
          <ion-card-content>
            <ion-button (click)="loadAiInsights()">Generate Insight Summary</ion-button>
            <div *ngIf="insights">
              <p><strong>Risk level:</strong> <app-status-badge [status]="insights.risk_level"></app-status-badge></p>
              <p>{{ insights.summary }}</p>
              <h4>Insights</h4>
              <ul><li *ngFor="let i of insights.insights">{{ i }}</li></ul>
              <h4>Recommendations</h4>
              <ul><li *ngFor="let r of insights.recommendations">{{ r }}</li></ul>
            </div>
          </ion-card-content>
        </ion-card>
        <app-dashboard-charts></app-dashboard-charts>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class ManagerReportsPage implements ViewWillEnter {
  insights: any = null;
  constructor(
    private api: ApiService,
    private analyticsRefresh: AnalyticsRefreshService,
  ) {}
  ionViewWillEnter() {
    this.analyticsRefresh.requestRefresh();
  }
  loadAiInsights() { this.api.get('/analytics/ai-insights').subscribe(res => this.insights = res.data); }
}
