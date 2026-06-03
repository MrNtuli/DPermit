import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty-state">
      <div class="empty-icon"><ion-icon [name]="icon"></ion-icon></div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 48px 20px;
      background: var(--dp-mint);
      border: 1px dashed var(--dp-mint-dark);
      border-radius: var(--dp-radius-md);
    }
    .empty-icon ion-icon {
      font-size: 3rem;
      color: var(--dp-emerald);
      opacity: 0.6;
    }
    h3 {
      margin: 14px 0 6px;
      color: var(--dp-forest-deep);
      font-weight: 700;
      font-size: 1rem;
    }
    p {
      margin: 0;
      color: var(--dp-text-muted);
      font-size: 0.88rem;
      max-width: 360px;
      margin-inline: auto;
      line-height: 1.45;
    }
  `],
  standalone: false,
})
export class EmptyStateComponent {
  @Input() icon = 'folder-open-outline';
  @Input() title = 'No records found';
  @Input() message = 'There is nothing to display yet.';
}
