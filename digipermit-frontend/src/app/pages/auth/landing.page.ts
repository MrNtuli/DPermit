import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  template: `
    <ion-content class="landing">
      <div class="landing-wrap">
        <div class="brand-block">
          <div class="logo"><ion-icon name="shield-checkmark"></ion-icon></div>
          <h1>DigiPermit</h1>
          <p class="tagline">Foreign-National Visa &amp; Permit Compliance Monitoring</p>
        </div>
        <ion-note class="limitation">
          Compliance-monitoring only — does not issue official visas or replace government immigration authorities.
        </ion-note>
        <ion-button expand="block" routerLink="/login" class="cta">Sign In to Dashboard</ion-button>
        <p class="footer-note">Secure · Role-based · Multi-organisation</p>
      </div>
    </ion-content>
  `,
  styles: [`
    .landing {
      --background: linear-gradient(160deg, var(--dp-green-900, #0d2818) 0%, var(--dp-green-800, #1b4332) 45%, var(--dp-green-700, #2d6a4f) 100%);
    }
    .landing-wrap {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 24px;
      text-align: center;
      color: #fff;
      max-width: 440px;
      margin: 0 auto;
    }
    .logo {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      background: rgba(255,255,255,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      ion-icon { font-size: 2.5rem; }
    }
    h1 { font-size: 2.25rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
    .tagline { opacity: 0.9; margin: 10px 0 28px; font-size: 0.95rem; line-height: 1.5; }
    .limitation {
      display: block;
      width: 100%;
      margin-bottom: 28px;
      padding: 14px 16px;
      background: rgba(0,0,0,0.2);
      border-radius: 10px;
      font-size: 0.8rem;
      line-height: 1.45;
      color: rgba(255,255,255,0.9);
    }
    .cta { --border-radius: 10px; font-weight: 600; margin-bottom: 16px; }
    .footer-note { font-size: 0.75rem; opacity: 0.65; margin: 0; }
  `],
  standalone: false,
})
export class LandingPage {}
