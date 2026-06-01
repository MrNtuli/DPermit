import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="page-header">
      <div>
        <h1>{{ title }}</h1>
        <p *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.page-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
    h1 { margin:0; font-size:1.5rem; font-weight:700; } p { margin:4px 0 0; color:var(--ion-color-medium); }`],
  standalone: false,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}
