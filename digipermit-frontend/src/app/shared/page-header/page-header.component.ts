import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="page-header">
      <div class="page-header-text">
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--dp-text, #1a202c);
    }
    p {
      margin: 6px 0 0;
      color: var(--dp-text-muted, #64748b);
      font-size: 0.9rem;
      line-height: 1.4;
    }
    @media (max-width: 576px) {
      h1 { font-size: 1.25rem; }
    }
  `],
  standalone: false,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
