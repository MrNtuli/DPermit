import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
        <p class="filter-subtitle">Charts and KPI cards update automatically when you change a filter</p>
      </div>
      <div class="filter-grid">
        <ion-item lines="none" *ngIf="filterOptions.can_filter_organisation">
          <ion-select label="Organisation" labelPlacement="stacked" interface="popover"
            [(ngModel)]="orgSelectValue" (ionChange)="onOrganisationChange($event.detail.value)">
            <ion-select-option value="">All organisations</ion-select-option>
            <ion-select-option *ngFor="let org of filterOptions.organisations" [value]="org.id">
              {{ org.name }}
            </ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Period" labelPlacement="stacked" interface="popover"
            [(ngModel)]="filters.days" (ionChange)="onFilterChange()">
            <ion-select-option *ngFor="let p of filterOptions.periods" [value]="p.value">{{ p.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Scan type" labelPlacement="stacked" interface="popover"
            [(ngModel)]="scanTypeSelectValue" (ionChange)="onScanTypeChange($event.detail.value)">
            <ion-select-option *ngFor="let s of filterOptions.scan_types" [value]="s.value">{{ s.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Verification result" labelPlacement="stacked" interface="popover"
            [(ngModel)]="verificationResultSelectValue" (ionChange)="onVerificationResultChange($event.detail.value)">
            <ion-select-option *ngFor="let r of filterOptions.verification_results" [value]="r.value">{{ r.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none">
          <ion-select label="Permit status" labelPlacement="stacked" interface="popover"
            [(ngModel)]="permitStatusSelectValue" (ionChange)="onPermitStatusChange($event.detail.value)">
            <ion-select-option *ngFor="let s of filterOptions.permit_statuses" [value]="s.value">{{ s.label }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-item lines="none" *ngIf="showAlerts">
          <ion-select label="Alerts" labelPlacement="stacked" interface="popover"
            [(ngModel)]="filters.alert_status" (ionChange)="onFilterChange()">
            <ion-select-option *ngFor="let a of filterOptions.alert_statuses" [value]="a.value">{{ a.label }}</ion-select-option>
          </ion-select>
        </ion-item>
      </div>
      <div class="filter-actions">
        <ion-button size="small" fill="outline" (click)="resetFilters()">Reset filters</ion-button>
        <ion-spinner *ngIf="loading" name="crescent" class="filter-spinner"></ion-spinner>
        <span class="filter-badge" *ngIf="!loading && filtersActive">Filters active</span>
      </div>
      <p class="active-filters" *ngIf="activeFilterSummary">{{ activeFilterSummary }}</p>
    </div>

    <div class="charts-section charts-busy" *ngIf="data">
      <div class="charts-grid">
        <div class="panel-card chart-panel">
          <h2 class="panel-title">Permit Status Distribution</h2>
          <p class="chart-note">{{ permitScopeNote }}</p>
          <app-chart-canvas *ngIf="permitChart" [config]="permitChart" [revision]="chartRevision"></app-chart-canvas>
          <p class="empty-chart" *ngIf="!permitChart">No permit records match the current filters.</p>
        </div>
        <div class="panel-card chart-panel">
          <h2 class="panel-title">Verification Activity ({{ data.period_days }} days)</h2>
          <p class="chart-note">Daily scans — filtered by period, organisation, scan type, and result</p>
          <app-chart-canvas *ngIf="trendChart && hasTrendData" [config]="trendChart" [revision]="chartRevision"></app-chart-canvas>
          <p class="empty-chart" *ngIf="!hasTrendData">No verification activity matches the current filters.</p>
        </div>
        <div class="panel-card chart-panel">
          <h2 class="panel-title">Verification Results ({{ data.period_days }} days)</h2>
          <p class="chart-note">Outcome breakdown from checkpoint verifications</p>
          <app-chart-canvas *ngIf="resultChart" [config]="resultChart" [revision]="chartRevision"></app-chart-canvas>
          <p class="empty-chart" *ngIf="!resultChart">No verifications match the current filters.</p>
        </div>
        <div class="panel-card chart-panel" *ngIf="showAlerts">
          <h2 class="panel-title">{{ alertChartTitle }}</h2>
          <p class="chart-note">Compliance alerts in scope</p>
          <app-chart-canvas *ngIf="alertChart" [config]="alertChart" [revision]="chartRevision"></app-chart-canvas>
          <p class="empty-chart" *ngIf="!alertChart">No alerts match the current filters.</p>
        </div>
      </div>
    </div>
    <ion-spinner *ngIf="loading && !data" name="crescent" class="chart-spinner"></ion-spinner>
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
    .filter-spinner { width: 22px; height: 22px; }
    .filter-badge {
      font-size: 0.75rem;
      color: var(--ion-color-primary);
      background: rgba(45, 106, 79, 0.1);
      padding: 4px 10px;
      border-radius: 999px;
    }
    .active-filters {
      font-size: 0.78rem;
      color: var(--dp-text-muted);
      margin: 10px 0 0;
    }
    .charts-section { margin-bottom: 24px; }
    .charts-busy { opacity: 1; transition: opacity 0.15s; }
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
export class DashboardChartsComponent implements OnInit, OnDestroy {
  @Input() showAlerts = true;
  @Output() summaryChange = new EventEmitter<Record<string, number>>();

  loading = true;
  filtersActive = false;
  filterOptions: AnalyticsFilterOptions | null = null;
  filters: AnalyticsFilters = { ...DEFAULT_FILTERS };
  orgSelectValue = '';
  scanTypeSelectValue = '';
  verificationResultSelectValue = '';
  permitStatusSelectValue = '';
  data: DashboardChartData | null = null;
  permitChart: ChartConfiguration | null = null;
  trendChart: ChartConfiguration | null = null;
  resultChart: ChartConfiguration | null = null;
  alertChart: ChartConfiguration | null = null;
  chartRevision = 0;
  hasTrendData = false;
  activeFilterSummary = '';

  private refreshTimer?: ReturnType<typeof setTimeout>;

  constructor(private api: ApiService) {}

  get permitScopeNote(): string {
    if (!this.data) return '';
    const parts: string[] = ['Current permit records'];
    if (this.data.scoped_organisation_id) parts.push('selected organisation only');
    if (this.filters.permit_status) parts.push(`status: ${this.filters.permit_status.replace(/_/g, ' ')}`);
    return parts.join(' · ');
  }

  get alertChartTitle(): string {
    const status = this.filters.alert_status || 'open';
    if (status === 'resolved') return 'Resolved Alerts by Type';
    if (status === 'all') return 'All Alerts by Type';
    return 'Open Alerts by Type';
  }

  ngOnInit() {
    this.syncSelectValuesFromFilters();
    this.api.get<AnalyticsFilterOptions>('/analytics/filter-options').subscribe({
      next: res => {
        this.filterOptions = res.data;
        this.loadData();
      },
      error: () => this.loadData(),
    });
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
  }

  onOrganisationChange(value: string) {
    this.filters.organisation_id = value || null;
    this.orgSelectValue = value || '';
    this.onFilterChange();
  }

  onScanTypeChange(value: string) {
    this.filters.scan_type = value || null;
    this.scanTypeSelectValue = value || '';
    this.onFilterChange();
  }

  onVerificationResultChange(value: string) {
    this.filters.verification_result = value || null;
    this.verificationResultSelectValue = value || '';
    this.onFilterChange();
  }

  onPermitStatusChange(value: string) {
    this.filters.permit_status = value || null;
    this.permitStatusSelectValue = value || '';
    this.onFilterChange();
  }

  /** Debounced auto-refresh when any filter changes. */
  onFilterChange() {
    if (this.refreshTimer) clearTimeout(this.refreshTimer);
    this.refreshTimer = setTimeout(() => this.applyFilters(), 300);
  }

  applyFilters() {
    this.filtersActive = this.hasNonDefaultFilters();
    this.loadData();
  }

  resetFilters() {
    this.filters = { ...DEFAULT_FILTERS };
    this.syncSelectValuesFromFilters();
    this.filtersActive = false;
    this.loadData();
  }

  private syncSelectValuesFromFilters() {
    this.orgSelectValue = this.filters.organisation_id || '';
    this.scanTypeSelectValue = this.filters.scan_type || '';
    this.verificationResultSelectValue = this.filters.verification_result || '';
    this.permitStatusSelectValue = this.filters.permit_status || '';
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
        this.updateActiveFilterSummary(res.data);
        this.chartRevision++;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });

    this.api.get<Record<string, number>>('/analytics/summary', params).subscribe({
      next: res => this.summaryChange.emit(res.data),
    });
  }

  private updateActiveFilterSummary(data: DashboardChartData) {
    const applied = data.applied_filters;
    if (!applied) {
      this.activeFilterSummary = '';
      return;
    }
    const parts: string[] = [];
    if (applied.organisation_id && this.filterOptions) {
      const org = this.filterOptions.organisations.find(o => o.id === applied.organisation_id);
      parts.push(org ? org.name : 'Organisation filtered');
    }
    parts.push(`Period: ${applied.days} days`);
    if (applied.scan_type) parts.push(`Scan: ${applied.scan_type}`);
    if (applied.verification_result) parts.push(`Result: ${applied.verification_result.replace(/_/g, ' ')}`);
    if (applied.permit_status) parts.push(`Permit: ${applied.permit_status.replace(/_/g, ' ')}`);
    if (applied.alert_status && applied.alert_status !== 'open') parts.push(`Alerts: ${applied.alert_status}`);
    this.activeFilterSummary = parts.length ? `Showing: ${parts.join(' · ')}` : '';
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
    this.trendChart = null;

    if (d.permit_status.values.length) {
      const colors = d.permit_status.labels.map(l => STATUS_COLORS[l.toLowerCase()] || '#40916c');
      this.permitChart = {
        type: 'doughnut',
        data: {
          labels: d.permit_status.labels.map(l => this.titleCase(l)),
          datasets: [{ data: [...d.permit_status.values], backgroundColor: colors, borderWidth: 2, borderColor: '#fff' }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } },
        },
      };
    }

    this.hasTrendData = d.verification_trend.total.some(n => n > 0);
    if (this.hasTrendData) {
      this.trendChart = {
        type: 'line',
        data: {
          labels: [...d.verification_trend.labels],
          datasets: [
            {
              label: 'Total scans',
              data: [...d.verification_trend.total],
              borderColor: '#1b4332',
              backgroundColor: 'rgba(27, 67, 50, 0.08)',
              fill: true,
              tension: 0.3,
            },
            {
              label: 'Valid',
              data: [...d.verification_trend.valid],
              borderColor: '#40916c',
              backgroundColor: 'transparent',
              tension: 0.3,
            },
            {
              label: 'Failed / flagged',
              data: [...d.verification_trend.failed],
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
    }

    if (d.verification_results.values.length) {
      this.resultChart = {
        type: 'bar',
        data: {
          labels: d.verification_results.labels.map(l => this.titleCase(l)),
          datasets: [{
            label: 'Attempts',
            data: [...d.verification_results.values],
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
            data: [...d.alerts_by_type.values],
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
