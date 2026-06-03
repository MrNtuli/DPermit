import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ApiService } from '../../services/api.service';
import { Permit } from '../../interfaces/models';

@Component({
  selector: 'app-permit-document-page',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button defaultHref="/"></ion-back-button></ion-buttons>
        <ion-title>Digital Permit Document</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <app-permit-document *ngIf="permit" [permit]="permit"></app-permit-document>

      <div class="actions no-print" *ngIf="permit">
        <ion-button expand="block" color="primary" (click)="downloadPng()">
          <ion-icon name="image-outline" slot="start"></ion-icon>
          Download as Picture (PNG)
        </ion-button>
        <ion-button expand="block" color="secondary" (click)="downloadPdf()">
          <ion-icon name="document-outline" slot="start"></ion-icon>
          Download as PDF
        </ion-button>
        <ion-button expand="block" fill="outline" (click)="printDocument()">
          <ion-icon name="print-outline" slot="start"></ion-icon>
          Print Permit
        </ion-button>
      </div>

      <ion-card class="no-print" *ngIf="permit">
        <ion-card-header><ion-card-title>How verification works</ion-card-title></ion-card-header>
        <ion-card-content>
          <ol>
            <li>HR captures this compliance record in DigiPermit.</li>
            <li>Download or print this document (PNG/PDF).</li>
            <li>Foreign national carries it, or HR shows it at a checkpoint.</li>
            <li>Verification officer scans the <strong>QR code</strong> with the camera.</li>
            <li>DigiPermit checks the database and returns Valid / Expired / Revoked.</li>
          </ol>
        </ion-card-content>
      </ion-card>

      <ion-spinner *ngIf="loading" name="crescent" class="center"></ion-spinner>
    </ion-content>
  `,
  styles: [`
    .actions { max-width: 720px; margin: 20px auto; display: flex; flex-direction: column; gap: 10px; }
    .center { display: block; margin: 48px auto; }
    @media print {
      .no-print { display: none !important; }
      ion-header { display: none !important; }
    }
  `],
  standalone: false,
})
export class PermitDocumentPage implements OnInit {
  permit: Permit | null = null;
  loading = true;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private toast: ToastController
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.get<Permit>(`/permits/${id}`).subscribe({
        next: res => { this.permit = res.data; this.loading = false; },
        error: async () => {
          this.loading = false;
          (await this.toast.create({ message: 'Permit not found', color: 'danger' })).present();
        },
      });
    }
  }

  private async captureElement(): Promise<HTMLCanvasElement | null> {
    const el = document.getElementById('permit-document-export');
    if (!el) return null;
    return html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
  }

  async downloadPng() {
    const canvas = await this.captureElement();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `DigiPermit-${this.permit?.permit_number || 'permit'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    (await this.toast.create({ message: 'Picture downloaded', color: 'success', duration: 2000 })).present();
  }

  async downloadPdf() {
    const canvas = await this.captureElement();
    if (!canvas) return;
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth() - 20;
    const h = (canvas.height * w) / canvas.width;
    pdf.addImage(img, 'PNG', 10, 10, w, h);
    pdf.save(`DigiPermit-${this.permit?.permit_number || 'permit'}.pdf`);
    (await this.toast.create({ message: 'PDF downloaded', color: 'success', duration: 2000 })).present();
  }

  printDocument() {
    window.print();
  }
}
