import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<ion-badge [color]="color">{{ status | titlecase }}</ion-badge>`,
  standalone: false,
})
export class StatusBadgeComponent {
  @Input() status = '';

  get color(): string {
    const map: Record<string, string> = {
      active: 'success', valid: 'success', approved: 'success',
      expiring_soon: 'warning', expiring: 'warning',
      expired: 'danger', revoked: 'danger', rejected: 'danger', suspicious: 'danger',
      pending: 'medium', pending_verification: 'medium', renewal_in_progress: 'tertiary',
      open: 'warning', resolved: 'success', archived: 'medium', not_found: 'dark',
    };
    return map[this.status] || 'medium';
  }
}
