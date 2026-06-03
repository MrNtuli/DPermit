import { Component, Input } from '@angular/core';

/** Manual + QR verification shortcuts for employer, university, and clinic roles. */
@Component({
  selector: 'app-verify-quick-actions',
  template: `
    <div class="panel-card verify-actions-panel">
      <h2 class="panel-title">{{ title }}</h2>
      <p class="verify-actions-note" *ngIf="subtitle">{{ subtitle }}</p>
      <div class="action-grid cols-2">
        <a class="action-card" routerLink="/verification/manual">
          <ion-icon name="search-outline"></ion-icon>
          <div><h3>Manual Lookup</h3><p>Verify by permit number</p></div>
        </a>
        <a class="action-card" routerLink="/verification/qr">
          <ion-icon name="qr-code-outline"></ion-icon>
          <div><h3>QR Scan</h3><p>Camera or manual QR entry</p></div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .verify-actions-panel { margin-top: 16px; }
    .verify-actions-note {
      font-size: 0.78rem;
      color: var(--dp-text-muted);
      margin: -8px 0 12px;
    }
    .action-grid.cols-2 {
      grid-template-columns: 1fr;
    }
    @media (min-width: 576px) {
      .action-grid.cols-2 { grid-template-columns: repeat(2, 1fr); }
    }
  `],
  standalone: false,
})
export class VerifyQuickActionsComponent {
  @Input() title = 'Verify permit';
  @Input() subtitle = 'Check validity at reception or desk using manual lookup or QR scan.';
}
