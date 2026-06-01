import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `
    <ion-content class="landing">
      <div class="hero">
        <ion-icon name="shield-checkmark" color="primary"></ion-icon>
        <h1>DigiPermit</h1>
        <p>Foreign-National Visa &amp; Permit Compliance Monitoring</p>
        <ion-note class="limitation">
          DigiPermit is a compliance-monitoring platform. It does not issue official visas or replace government immigration authorities.
        </ion-note>
        <div class="actions">
          <ion-button expand="block" routerLink="/login">Sign In</ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .landing { --background: linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%); }
    .hero { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:32px; text-align:center; color:#fff; }
    ion-icon { font-size:72px; margin-bottom:16px; }
    h1 { font-size:2.5rem; font-weight:800; margin:0; }
    p { opacity:0.9; margin:8px 0 24px; max-width:400px; }
    .limitation { display:block; max-width:480px; margin-bottom:32px; padding:12px; background:rgba(255,255,255,0.1); border-radius:8px; font-size:0.85rem; line-height:1.4; }
    .actions { width:100%; max-width:320px; }
  `],
  standalone: false,
})
export class LandingPage {}
