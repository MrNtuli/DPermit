import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { ApiService } from '../../services/api.service';
import {
  AnalyticsFilterOptions,
  AnalyticsFilters,
  DashboardChartData,
} from '../../interfaces/models';

const STATUS_COLORS: Record<string, string> = {
  active: '#2d6a4f',
  'expiring soon': '#e9a319',
  expired: '#c0392b',
  revoked: '#6c757d',
  'pending verification': '#52796f',
  rejected: '#922b21',
};

const RESULT_COLORS = ['#2d6a4f', '#40916c', '#e9a319', '#c0392b', '#6c757d', '#1b4332', '#74c69d'];

const DEFAULT_FILTERS: AnalyticsFilters = {
  organisation_id: null,
  days: 14,
  scan_type: null,
  verification_result: null,
  permit_status: null,
  alert_status: 'open',
};

@Component({
  selector: 'app-dashboard-charts',
  template: `
    <div class="filter-panel panel-card" *ngIf="filterOptions">
      <div class="filter-header">
        <h2 class="panel-title">Analytics Filters</h2>
        <p class="filter-subtitle">Filter charts and KPIs by organisation, period, scan type, and outcome</p>
      </div>
      <div class="filter-grid">
        <ion-item lines="none" *ngIf="filterOptions.can_filter_organisation">
          <ion-select label="Organisation" labelPlacement="stacked" interface="popover"
            [value]="filters.organisation_id || ''"
            (ionChange)="filters.organisation_id = $event.detail.value || null">
            <ion-select-option value="">All organisations</ion-select-option>
            <ion-select-option *ngFor="let org of filterOptions.organisations" [value]="org.id">
              {{ org.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Period" labelPlacement="stacked" interface="popover"
            [value]="filters.days"
            (ionChange)="filters.days = +$event.detail.value">
            <ion-select-option *ngFor="let p of filterOptions.periods" [value]="p.value">{{ p.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Scan type" labelPlacement="stacked" interface="popover"
            [value]="filters.scan_type || ''"
            (ionChange)="filters.scan_type = $event.detail.value || null">
            <ion-select-option *ngFor="let s of filterOptions.scan_types" [value]="s.value">{{ s.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Verification result" labelPlacement="stacked" interface="popover"
            [value]="filters.verification_result || ''"
            (ionChange)="filters.verification_result = $event.detail.value || null">
            <ion-select-option *ngFor="let r of filterOptions.verification_results" [value]="r.value">{{ r.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Permit status" labelPlacement="stacked" interface="popover"
            [value]="filters.permit_status || ''"
            (ionChange)="filters.permit_status = $event.detail.value || null">
            <ion-select-option *ngFor="let s of filterOptions.permit_statuses" [value]="s.value">{{ s.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none" *ngIf="showAlerts">
          <ion-select label="Alerts" labelPlacement="stacked" interface="popover"
            [value]="filters.alert_status || 'open'"
            (ionChange)="filters.alert_status = $event.detail.value || 'open'">
            <ion-select-option *ngFor="let a of filterOptions.alert_statuses" [value]="a.value">{{ a.label }}</ion-select-option>
          </ion-select>
        </ion-item>
      </div>
      <div class="filter-actions">
        <ion-button size="small" (click)="applyFilters()">Apply filters</ion-button>
        <ion-button size="small" fill="outline" (click)="resetFilters()">Reset</ion-button>
        <span class="filter-badge" *ngIf="filtersActive">Filters applied</span>
      </div>
    </div>

    <div class="charts-section" *ngIf="!loading && data">
      <div class="charts-grid">
        <div class="panel-card chart-panel">
          <h2 class="panel-title">Permit Status Distribution</h2>
          <p class="chart-note">{{ scopeNote }}</p>
          <app-chart-canvas *ngIf="permitChart" [config]="permitChart"></app-chart-canvas>
          <p class="empty-chart" *ngIf="!data.permit_status.values.length">No permit records match the current filters.</p>
        </div>
        <div class="panel-card chart-panel">
          <h2 class="panel-title">Verification Activity ({{ data.period_days }} days)</h2>
          <p class="chart-note">Daily scans from verification logs</p>
          <app-chart-canvas *ngIf="trendChart" [config]="trendChart"></app-chart-canvas>
        </div>
        <div class="panel-card chart-panel">
          <h2 class="panel-title">Verification Results ({{ data.period_days }} days)</h2>
          <p class="chart-note">Outcome breakdown from checkpoint verifications</p>
          <app-chart-canvas *ngIf="resultChart" [config]="resultChart"></app-chart-canvas>
          <p class="empty-chart" *ngIf="!data.verification_results.values.length">No verifications match the current filters.</p>
        </div>
        <div class="panel-card chart-panel" *ngIf="showAlerts">
          <h2 class="panel-title">{{ alertChartTitle }}</h2>
          <p class="chart-note">Compliance alerts in scope</p>
          <app-chart-canvas *ngIf="alertChart" [config]="alertChart"></app-chart-canvas>
          <p class="empty-chart" *ngIf="!data.alerts_by_type.values.length">No alerts match the current filters.</p>
        </div>
      </div>
    </div>
    <ion-spinner *ngIf="loading" name="crescent" class="chart-spinner"></ion-spinner>
  `,
  styles: [`
    .filter-panel { margin-bottom: 16px; }
    .filter-header { margin-bottom: 8px; }
    .filter-subtitle {
      font-size: 0.78rem;
      color: var(--dp-text-muted);
      margin: -4px 0 0;
    }
    .filter-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 4px;
    }
    @media (min-width: 768px) {
      .filter-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 1100px) {
      .filter-grid { grid-template-columns: repeat(3, 1fr); }
    }
    .filter-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      flex-wrap: wrap;
    }
    .filter-badge {
      font-size: 0.75rem;
      color: var(--ion-color-primary);
      background: rgba(45, 106, 79, 0.1);
      padding: 4px 10px;
      border-radius: 999px;
    }
    .charts-section { margin-bottom: 24px; }
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 768px) {
      .charts-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .chart-panel { margin-bottom: 0; }
    .chart-note {
      font-size: 0.78rem;
      color: var(--dp-text-muted);
      margin: -8px 0 12px;
    }
    .empty-chart {
      text-align: center;
      color: var(--dp-text-muted);
      font-size: 0.85rem;
      padding: 40px 16px;
    }
    .chart-spinner { display: block; margin: 24px auto; }
  `],
  standalone: false,
})
export class DashboardChartsComponent implements OnInit {
  @Input() showAlerts = true;
  @Output() summaryChange = new EventEmitter<Record<string, number>>();

  loading = true;
  filtersActive = false;
  filterOptions: AnalyticsFilterOptions | null = null;
  filters: AnalyticsFilters = { ...DEFAULT_FILTERS };
  data: DashboardChartData | null = null;
  permitChart: ChartConfiguration | null = null;
  trendChart: ChartConfiguration | null = null;
  resultChart: ChartConfiguration | null = null;
  alertChart: ChartConfiguration | null = null;

  constructor(private api: ApiService) {}

  get scopeNote(): string {
    if (!this.data) return '';
    const parts = [`Last ${this.data.period_days} days`];
    if (this.data.scoped_organisation_id) parts.push('scoped to selected organisation');
    return `Live counts from permit records (${parts.join(' · ')})`;
  }

  get alertChartTitle(): string {
    const status = this.filters.alert_status || 'open';
    if (status === 'resolved') return 'Resolved Alerts by Type';
    if (status === 'all') return 'All Alerts by Type';
    return 'Open Alerts by Type';
  }

  ngOnInit() {
    this.api.get<AnalyticsFilterOptions>('/analytics/filter-options').subscribe({
      next: res => {
        this.filterOptions = res.data;
        this.loadData();
      },
      error: () => this.loadData(),
    });
  }

  applyFilters() {
    this.filtersActive = this.hasNonDefaultFilters();
    this.loadData();
  }

  resetFilters() {
    this.filters = { ...DEFAULT_FILTERS };
    this.filtersActive = false;
    this.loadData();
  }

  private hasNonDefaultFilters(): boolean {
    return Boolean(
      this.filters.organisation_id
      || this.filters.scan_type
      || this.filters.verification_result
      || this.filters.permit_status
      || (this.filters.days && this.filters.days !== 14)
      || (this.filters.alert_status && this.filters.alert_status !== 'open'),
    );
  }

  private loadData() {
    this.loading = true;
    const params = this.toQueryParams(this.filters);

    this.api.get<DashboardChartData>('/analytics/charts', params).subscribe({
      next: res => {
        this.data = res.data;
        this.buildCharts();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });

    this.api.get<Record<string, number>>('/analytics/summary', params).subscribe({
      next: res => this.summaryChange.emit(res.data),
    });
  }

  private toQueryParams(filters: AnalyticsFilters): Record<string, string> {
    const params: Record<string, string> = {};
    if (filters.organisation_id) params['organisation_id'] = filters.organisation_id;
    if (filters.days) params['days'] = String(filters.days);
    if (filters.scan_type) params['scan_type'] = filters.scan_type;
    if (filters.verification_result) params['verification_result'] = filters.verification_result;
    if (filters.permit_status) params['permit_status'] = filters.permit_status;
    if (filters.alert_status) params['alert_status'] = filters.alert_status;
    return params;
  }

  private buildCharts() {
    if (!this.data) return;
    const d = this.data;

    this.permitChart = null;
    this.resultChart = null;
    this.alertChart = null;

    if (d.permit_status.values.length) {
      const colors = d.permit_status.labels.map(l => STATUS_COLORS[l.toLowerCase()] || '#40916c');
      this.permitChart = {
        type: 'doughnut',
        data: {
          labels: d.permit_status.labels.map(l => this.titleCase(l)),
          datasets: [{ data: d.permit_status.values, backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        },
      };
    }

    this.trendChart = {
      type: 'line',
      data: {
        labels: d.verification_trend.labels,
        datasets: [
          {
            label: 'Total scans',
            data: d.verification_trend.total,
            borderColor: '#1b4332',
            backgroundColor: 'rgba(27, 67, 50, 0.08)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Valid',
            data: d.verification_trend.valid,
            borderColor: '#40916c',
            backgroundColor: 'transparent',
            tension: 0.3,
          },
          {
            label: 'Failed / flagged',
            data: d.verification_trend.failed,
            borderColor: '#c0392b',
            backgroundColor: 'transparent',
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
          x: { ticks: { maxRotation: 45, minRotation: 0 } },
        },
        plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
      },
    };

    if (d.verification_results.values.length) {
      this.resultChart = {
        type: 'bar',
        data: {
          labels: d.verification_results.labels.map(l => this.titleCase(l)),
          datasets: [{
            label: 'Attempts',
            data: d.verification_results.values,
            backgroundColor: d.verification_results.labels.map((_, i) => RESULT_COLORS[i % RESULT_COLORS.length]),
            borderRadius: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        },
      };
    }

    if (this.showAlerts && d.alerts_by_type.values.length) {
      this.alertChart = {
        type: 'bar',
        data: {
          labels: d.alerts_by_type.labels.map(l => this.titleCase(l)),
          datasets: [{
            label: 'Alerts',
            data: d.alerts_by_type.values,
            backgroundColor: '#e9a319',
            borderRadius: 6,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } },
        },
      };
    }
  }

  private titleCase(s: string) {
    return s.replace(/\b\w/g, c => c.toUpperCase());
  }
}
