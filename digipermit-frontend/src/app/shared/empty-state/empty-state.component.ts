import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <ion-icon [name]="icon" size="large" color="medium"></ion-icon>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
    </div>
  `,
  styles: [`.empty { text-align:center; padding:48px 16px; color:var(--ion-color-medium); }
    h3 { margin:12px 0 4px; color:var(--ion-color-dark); }`],
  standalone: false,
})
export class EmptyStateComponent {
  @Input() icon = 'folder-open-outline';
  @Input() title = 'No records found';
  @Input() message = 'There is nothing to display yet.';
}
