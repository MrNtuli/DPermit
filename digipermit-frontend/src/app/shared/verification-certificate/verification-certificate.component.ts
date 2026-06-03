import { Component, Input } from '@angular/core';
import { VerificationResult } from '../../interfaces/models';

@Component({
  selector: 'app-verification-certificate',
  template: `
    <div id="verification-certificate-export" class="cert" *ngIf="result">
      <div class="cert-header">
        <div class="brand">
          <ion-icon name="shield-checkmark"></ion-icon>
          <div>
            <h1>DigiPermit</h1>
            <p>Verification Certificate</p>
          </div>
        </div>
        <div class="scan-type">{{ scanTypeLabel }}</div>
      </div>

      <div class="banner">COMPLIANCE VERIFICATION RECORD — NOT AN OFFICIAL IMMIGRATION DOCUMENT</div>

      <div class="result-banner" [class]="resultClass">
        <span class="result-label">Verification Result</span>
        <strong class="result-value">{{ resultLabel }}</strong>
      </div>

      <div class="cert-body">
        <div class="field" *ngIf="result.permit_number">
          <span>Permit number</span><strong>{{ result.permit_number }}</strong>
        </div>
        <div class="field" *ngIf="result.foreign_national_name">
          <span>Foreign national</span><strong>{{ result.foreign_national_name }}</strong>
        </div>
        <div class="field" *ngIf="result.masked_passport_number">
          <span>Passport (masked)</span><strong>{{ result.masked_passport_number }}</strong>
        </div>
        <div class="field" *ngIf="result.permit_type">
          <span>Permit type</span><strong>{{ result.permit_type }}</strong>
        </div>
        <div class="field" *ngIf="result.organisation">
          <span>Organisation</span><strong>{{ result.organisation }}</strong>
        </div>
        <div class="field" *ngIf="result.issue_date">
          <span>Issue date</span><strong>{{ result.issue_date }}</strong>
        </div>
        <div class="field" *ngIf="result.expiry_date">
          <span>Expiry date</span><strong>{{ result.expiry_date }}</strong>
        </div>
        <div class="field" *ngIf="result.permit_status">
          <span>Permit status</span><strong>{{ result.permit_status | titlecase }}</strong>
        </div>
        <div class="field" *ngIf="result.days_until_expiry !== undefined && result.days_until_expiry !== null">
          <span>Days until expiry</span><strong>{{ result.days_until_expiry }}</strong>
        </div>
        <div class="field">
          <span>Verified at</span><strong>{{ result.timestamp | date:'medium' }}</strong>
        </div>
      </div>

      <div class="warning" *ngIf="result.warning_message">{{ result.warning_message }}</div>

      <div class="cert-footer">
        <p>This certificate confirms a DigiPermit compliance verification attempt. It does not replace official
        government immigration records or authority-issued permits.</p>
        <p class="ref">Scan type: {{ scanTypeLabel }} · Record generated {{ result.timestamp | date:'short' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .cert {
      max-width: 720px; margin: 0 auto; background: var(--dp-card);
      border: 2px solid var(--dp-emerald); border-radius: var(--dp-radius-md);
      overflow: hidden; box-shadow: var(--dp-shadow-lg);
      font-family: var(--dp-font); color: var(--dp-text);
    }
    .cert-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 20px 24px;
      background: linear-gradient(135deg, var(--dp-forest-deep), var(--dp-emerald));
      color: #fff;
    }
    .brand { display: flex; gap: 12px; align-items: center; }
    .brand ion-icon { font-size: 40px; }
    .brand h1 { margin: 0; font-size: 1.4rem; font-weight: 800; }
    .brand p { margin: 0; font-size: 0.75rem; opacity: 0.9; }
    .scan-type { font-size: 0.85rem; font-weight: 600; text-align: right; max-width: 140px; }
    .banner {
      background: var(--dp-amber-soft); color: #92400e; text-align: center;
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; padding: 8px 12px;
    }
    .result-banner { text-align: center; padding: 20px 24px; color: #fff; }
    .result-banner.valid { background: var(--dp-emerald); }
    .result-banner.expiring { background: var(--dp-amber); color: var(--dp-forest-deep); }
    .result-banner.invalid { background: var(--dp-danger); }
    .result-label { display: block; font-size: 0.75rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.06em; }
    .result-value { display: block; font-size: 1.75rem; margin-top: 4px; text-transform: uppercase; font-weight: 800; }
    .cert-body { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; padding: 24px; }
    .field span { display: block; font-size: 0.72rem; color: var(--dp-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .field strong { display: block; font-size: 0.95rem; margin-top: 2px; color: var(--dp-text); }
    .warning {
      margin: 0 24px 16px; padding: 12px 16px; background: var(--dp-danger-soft);
      color: var(--dp-danger); border-radius: var(--dp-radius-sm); font-size: 0.9rem; font-weight: 600;
    }
    .cert-footer {
      padding: 16px 24px 20px; background: var(--dp-surface); border-top: 1px solid var(--dp-border);
      font-size: 0.72rem; color: var(--dp-text-muted); line-height: 1.5;
    }
    .ref { margin-top: 8px; font-family: monospace; }
    @media print { .cert { box-shadow: none; border: 1px solid #ccc; max-width: 100%; } }
    @media (max-width: 600px) { .cert-body { grid-template-columns: 1fr; } }
  `],
  standalone: false,
})
export class VerificationCertificateComponent {
  @Input() result!: VerificationResult;

  get scanTypeLabel(): string {
    const map: Record<string, string> = { manual: 'Manual Lookup', qr: 'QR Code Scan', rfid: 'RFID Scan' };
    return map[this.result?.scan_type] || this.result?.scan_type || 'Verification';
  }

  get resultLabel(): string {
    return (this.result?.verification_result || 'unknown').replace(/_/g, ' ');
  }

  get resultClass(): string {
    const r = this.result?.verification_result;
    if (r === 'valid') return 'valid';
    if (r === 'expiring_soon') return 'expiring';
    return 'invalid';
  }
}
