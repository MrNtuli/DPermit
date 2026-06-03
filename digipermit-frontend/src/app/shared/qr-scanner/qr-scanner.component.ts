import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-qr-scanner',
  template: `
    <div class="scanner-panel">
      <div id="digipermit-qr-reader" class="reader-box" [class.hidden]="!scanning"></div>
      <ion-button *ngIf="!scanning" expand="block" color="secondary" (click)="startScanner()">
        <ion-icon name="camera-outline" slot="start"></ion-icon>
        Start Camera Scan
      </ion-button>
      <ion-button *ngIf="scanning" expand="block" color="medium" (click)="stopScanner()">
        Stop Camera
      </ion-button>
      <ion-note *ngIf="error" color="danger" class="error-note">{{ error }}</ion-note>
      <ion-note class="hint">Allow camera access when prompted. Point at the DigiPermit QR on the permit card.</ion-note>
    </div>
  `,
  styles: [`
    .scanner-panel { margin: 16px 0; }
    .reader-box { width: 100%; max-width: 400px; margin: 0 auto 12px; border-radius: 12px; overflow: hidden; }
    .reader-box.hidden { display: none; }
    .hint, .error-note { display: block; margin-top: 8px; font-size: 0.85rem; }
  `],
  standalone: false,
})
export class QrScannerComponent implements OnDestroy {
  @Output() scanned = new EventEmitter<string>();

  scanning = false;
  error = '';
  private scanner: Html5Qrcode | null = null;
  private readonly readerId = 'digipermit-qr-reader';

  async startScanner() {
    this.error = '';
    this.scanning = true;
    try {
      this.scanner = new Html5Qrcode(this.readerId);
      await this.scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          this.scanned.emit(decodedText);
          this.stopScanner();
        },
        () => { /* ignore scan failures while searching */ }
      );
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Camera access failed. Use manual entry or check browser permissions.';
      this.scanning = false;
    }
  }

  async stopScanner() {
    if (this.scanner?.isScanning) {
      try {
        await this.scanner.stop();
        await this.scanner.clear();
      } catch { /* ignore */ }
    }
    this.scanner = null;
    this.scanning = false;
  }

  ngOnDestroy() {
    this.stopScanner();
  }
}
