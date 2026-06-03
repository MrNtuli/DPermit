import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { toDataURL } from 'qrcode';

@Component({
  selector: 'app-qr-display',
  template: `
    <div class="qr-wrap" *ngIf="qrDataUrl">
      <img [src]="qrDataUrl" [alt]="'QR code for ' + value" class="qr-image" />
    </div>
    <ion-spinner *ngIf="loading" name="crescent"></ion-spinner>
    <p class="qr-value" *ngIf="showValue && value">{{ value }}</p>
  `,
  styles: [`
    .qr-wrap { display:flex; justify-content:center; padding:12px; background:#fff; border-radius:12px; border:2px solid var(--ion-color-primary); }
    .qr-image { width:220px; height:220px; }
    .qr-value { font-family:monospace; font-size:0.75rem; color:var(--ion-color-medium); margin-top:8px; word-break:break-all; }
  `],
  standalone: false,
})
export class QrDisplayComponent implements OnChanges {
  @Input() value = '';
  @Input() showValue = true;
  qrDataUrl = '';
  loading = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value'] && this.value) {
      this.generate();
    }
  }

  private async generate() {
    this.loading = true;
    try {
      this.qrDataUrl = await toDataURL(this.value, {
        width: 280,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#1565c0', light: '#ffffff' },
      });
    } finally {
      this.loading = false;
    }
  }
}
