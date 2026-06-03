import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

/** Organisation-scoped alerts list (employer, university, clinic, immigration). */
@Component({
  selector: 'app-role-alerts-page',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons>
        <ion-title>Alerts</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="app-page">
      <div class="page-inner">
        <app-page-header
          title="Compliance Alerts"
          subtitle="Open and resolved alerts for your organisation only.">
        </app-page-header>
        <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
        <div class="data-list" *ngIf="!loading && alerts.length">
          <ion-item *ngFor="let a of alerts" lines="full">
            <ion-label>
              <h3>{{ a.alert_type | titlecase }}</h3>
              <p>{{ a.message }}</p>
              <p class="alert-meta">{{ a.priority }} · {{ a.created_at | date:'medium' }}</p>
            </ion-label>
            <app-status-badge [status]="a.status"></app-status-badge>
          </ion-item>
        </div>
        <app-empty-state *ngIf="!loading && !alerts.length" message="No alerts in your scope."></app-empty-state>
      </div>
    </ion-content>
  `,
  styles: [`
    .alert-meta { font-size: 0.78rem; color: var(--dp-text-muted); }
  `],
  standalone: false,
})
export class RoleAlertsPage implements OnInit {
  alerts: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.get<any[]>('/alerts').subscribe({
      next: res => {
        this.alerts = (res.data as any[]) || [];
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
