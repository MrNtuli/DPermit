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
        <p class="footer-note">Secure · Role-based · Multi-organisation · Audit logged</p>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class LandingPage {}
