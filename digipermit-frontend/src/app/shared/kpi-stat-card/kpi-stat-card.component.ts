import { Component, Input } from '@angular/core';
import { KpiTone, resolveKpiMeta } from './kpi-meta.util';

@Component({
  selector: 'app-kpi-stat',
  template: `
    <article class="kpi-stat" [class]="'tone-' + meta.tone">
      <div class="kpi-stat-icon" aria-hidden="true">
        <ion-icon [name]="meta.icon"></ion-icon>
      </div>
      <div class="kpi-stat-body">
        <p class="kpi-stat-value">{{ displayValue }}</p>
        <p class="kpi-stat-label">{{ label }}</p>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 0;
    }

    .kpi-stat {
      --kpi-accent: var(--dp-emerald, #1f7a5a);
      --kpi-icon-bg: var(--dp-mint, #eaf6f0);
      --kpi-icon-color: var(--dp-forest-deep, #0f3d2e);
      --kpi-value-color: var(--dp-forest-deep, #0f3d2e);

      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px 18px;
      min-height: 92px;
      background: var(--dp-card, #fff);
      border: 1px solid var(--dp-border, #e2e8f0);
      border-radius: var(--dp-radius-md, 12px);
      box-shadow: var(--dp-shadow-sm, 0 1px 3px rgba(15, 61, 46, 0.06));
      position: relative;
      overflow: hidden;
      transition: box-shadow 0.15s ease, transform 0.15s ease;
    }

    .kpi-stat::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--kpi-accent);
    }

    .kpi-stat:hover {
      box-shadow: var(--dp-shadow-md, 0 4px 12px rgba(15, 61, 46, 0.08));
    }

    .kpi-stat-icon {
      flex-shrink: 0;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--kpi-icon-bg);
      color: var(--kpi-icon-color);
    }

    .kpi-stat-icon ion-icon {
      font-size: 1.45rem;
    }

    .kpi-stat-body {
      min-width: 0;
      flex: 1;
    }

    .kpi-stat-value {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      line-height: 1.1;
      color: var(--kpi-value-color);
      letter-spacing: -0.02em;
    }

    .kpi-stat-label {
      margin: 6px 0 0;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--dp-text-muted, #64748b);
      line-height: 1.3;
    }

    .tone-info {
      --kpi-accent: #1f7a5a;
      --kpi-icon-bg: #eaf6f0;
      --kpi-icon-color: #0f3d2e;
    }

    .tone-success {
      --kpi-accent: #1f7a5a;
      --kpi-icon-bg: #d1fae5;
      --kpi-icon-color: #065f46;
      --kpi-value-color: #0f3d2e;
    }

    .tone-warning {
      --kpi-accent: #f59e0b;
      --kpi-icon-bg: #fef3c7;
      --kpi-icon-color: #b45309;
      --kpi-value-color: #b45309;
    }

    .tone-danger {
      --kpi-accent: #d64545;
      --kpi-icon-bg: #fee2e2;
      --kpi-icon-color: #b91c1c;
      --kpi-value-color: #b91c1c;
    }

    .tone-neutral {
      --kpi-accent: #334155;
      --kpi-icon-bg: #f1f5f9;
      --kpi-icon-color: #334155;
    }
  `],
  standalone: false,
})
export class KpiStatCardComponent {
  @Input() label = '';
  @Input() value: number | string = 0;
  @Input() tone?: KpiTone;
  @Input() icon?: string;

  get meta() {
    return resolveKpiMeta(this.label, this.tone, this.icon);
  }

  get displayValue(): string | number {
    const v = this.value;
    if (v === null || v === undefined || v === '') return 0;
    return v;
  }
}
