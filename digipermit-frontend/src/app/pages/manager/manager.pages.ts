import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-manager-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Analytics Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header title="Read-Only Compliance Overview" subtitle="Manager / Auditor view"></app-page-header>
      <ion-grid><ion-row><ion-col size="6" sizeMd="3" *ngFor="let s of cards"><ion-card><ion-card-content><h2>{{ s.v }}</h2><p>{{ s.l }}</p></ion-card-content></ion-card></ion-col></ion-row></ion-grid>
      <ion-card *ngFor="let section of sections"><ion-card-header><ion-card-title>{{ section.title }}</ion-card-title></ion-card-header><ion-card-content><pre>{{ section.data | json }}</pre></ion-card-content></ion-card>
    </ion-content>
  `,
  styles: [`h2{font-size:1.6rem;margin:0;color:var(--ion-color-primary)} pre{font-size:0.75rem;overflow:auto}`],
  standalone: false,
})
export class ManagerDashboardPage implements OnInit {
  cards: { l: string; v: number }[] = [];
  sections: { title: string; data: unknown }[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/analytics/summary').subscribe(res => {
      this.cards = [
        { l: 'Total Permits', v: res.data.total_permits }, { l: 'Active', v: res.data.active_permits },
        { l: 'Expired', v: res.data.expired_permits }, { l: 'Alerts', v: res.data.unresolved_alerts },
      ];
    });
    [{ title: 'Organisation Compliance', path: '/analytics/organisations' }, { title: 'Verification Trends', path: '/analytics/verifications' }].forEach(e => {
      this.api.get(e.path).subscribe(res => this.sections.push({ title: e.title, data: res.data }));
    });
  }
}

@Component({
  selector: 'app-manager-reports',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Reports & AI Insights</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
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
      <ion-card>
        <ion-card-header><ion-card-title>Compliance Summary Data</ion-card-title></ion-card-header>
        <ion-card-content>
          <ion-button fill="outline" (click)="loadReport()">Load Summary</ion-button>
          <pre *ngIf="report">{{ report | json }}</pre>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  standalone: false,
})
export class ManagerReportsPage {
  report: unknown = null;
  insights: any = null;
  constructor(private api: ApiService) {}
  loadReport() { this.api.get('/analytics/summary').subscribe(res => this.report = res.data); }
  loadAiInsights() { this.api.get('/analytics/ai-insights').subscribe(res => this.insights = res.data); }
}
