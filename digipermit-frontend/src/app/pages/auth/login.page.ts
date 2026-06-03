import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="login-page">
      <div class="login-wrap">
        <div class="login-card">
          <div class="login-brand">
            <div class="logo"><ion-icon name="shield-checkmark"></ion-icon></div>
            <h1>DigiPermit</h1>
            <p>Sign in to your compliance dashboard</p>
          </div>
          <form [formGroup]="form" (ngSubmit)="login()">
            <ion-item lines="none" class="field field-item">
              <ion-input formControlName="email" type="email" label="Email" labelPlacement="stacked" placeholder="you@organisation.demo"></ion-input>
            </ion-item>
            <ion-item lines="none" class="field field-item">
              <ion-input formControlName="password" type="password" label="Password" labelPlacement="stacked"></ion-input>
            </ion-item>
            <ion-button expand="block" type="submit" [disabled]="form.invalid" class="submit-btn">Sign In</ion-button>
          </form>
          <ion-note class="demo-hint">
            Demo: hr&#64;acmeglobal.demo / verify&#64;digipermit.demo — Password: Demo&#64;12345
          </ion-note>
          <ion-note class="demo-hint">
            New accounts are created by a System Administrator under Admin → Users.
          </ion-note>
          <ion-button fill="clear" routerLink="/welcome" size="small">← Back to Home</ion-button>
        </div>
        <p class="secure-note">Secure · Role-based access · Audit logged</p>
      </div>
    </ion-content>
  `,
  styles: [`:host { display: block; }`],
  standalone: false,
})
export class LoginPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder, private auth: AuthService, private router: Router,
    private loading: LoadingController, private toast: ToastController
  ) {}

  async login() {
    const loader = await this.loading.create({ message: 'Signing in...' });
    await loader.present();
    this.auth.login(this.form.value.email!, this.form.value.password!).subscribe({
      next: async () => {
        await loader.dismiss();
        this.router.navigateByUrl(this.auth.getDashboardRoute());
      },
      error: async (err) => {
        await loader.dismiss();
        const t = await this.toast.create({ message: err.error?.message || 'Login failed', color: 'danger', duration: 3000 });
        t.present();
      },
    });
  }
}
