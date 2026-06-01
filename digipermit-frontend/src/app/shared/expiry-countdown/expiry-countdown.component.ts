import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-expiry-countdown',
  template: `
    <div class="countdown" [class.urgent]="days <= 30" [class.expired]="days < 0">
      <ion-icon name="time-outline"></ion-icon>
      <span *ngIf="days >= 0">{{ days }} day(s) remaining</span>
      <span *ngIf="days < 0">Expired {{ -days }} day(s) ago</span>
    </div>
  `,
  styles: [`.countdown { display:flex; align-items:center; gap:8px; font-weight:600; }
    .urgent { color: var(--ion-color-warning); } .expired { color: var(--ion-color-danger); }`],
  standalone: false,
})
export class ExpiryCountdownComponent implements OnInit {
  @Input() expiryDate = '';
  days = 0;

  ngOnInit() {
    const today = new Date(); today.setHours(0,0,0,0);
    const exp = new Date(this.expiryDate); exp.setHours(0,0,0,0);
    this.days = Math.ceil((exp.getTime() - today.getTime()) / 86400000);
  }
}
