import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<ion-badge [color]="color">{{ displayStatus }}</ion-badge>`,
  standalone: false,
})
export class StatusBadgeComponent {
  @Input() status = '';

  get displayStatus(): string {
    if (!this.status) return '';
    return this.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

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
