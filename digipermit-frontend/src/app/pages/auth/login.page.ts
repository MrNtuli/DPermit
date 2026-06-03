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
            <ion-item lines="none" class="field">
              <ion-input formControlName="email" type="email" label="Email" labelPlacement="stacked" placeholder="you@organisation.demo"></ion-input>
            </ion-item>
            <ion-item lines="none" class="field">
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
  styles: [`
    .login-page { --background: var(--dp-surface, #f4f6f8); }
    .login-wrap {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 36px 28px 28px;
      background: #fff;
      border-radius: 16px;
      border: 1px solid var(--dp-border, #e2e8f0);
      box-shadow: 0 8px 32px rgba(27, 67, 50, 0.08);
    }
    .login-brand { text-align: center; margin-bottom: 28px; }
    .logo {
      width: 56px; height: 56px; border-radius: 12px;
      background: var(--dp-green-100, #d8f3dc);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 14px;
      ion-icon { font-size: 1.75rem; color: var(--ion-color-primary); }
    }
    h1 { margin: 0; font-size: 1.5rem; font-weight: 800; color: var(--dp-green-800); }
    .login-brand p { margin: 6px 0 0; color: var(--dp-text-muted); font-size: 0.9rem; }
    .field {
      --background: var(--dp-surface);
      border-radius: 10px;
      margin-bottom: 12px;
      border: 1px solid var(--dp-border);
    }
    .submit-btn { margin-top: 8px; --border-radius: 10px; font-weight: 600; }
    .demo-hint { display: block; margin-top: 14px; font-size: 0.72rem; line-height: 1.45; color: var(--dp-text-muted); }
    .secure-note { margin-top: 20px; font-size: 0.75rem; color: var(--dp-text-muted); }
  `],
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
