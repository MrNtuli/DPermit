import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <ion-content class="login-page">
      <div class="login-card">
        <h1>DigiPermit</h1>
        <p>Sign in to your account</p>
        <form [formGroup]="form" (ngSubmit)="login()">
          <ion-item><ion-input formControlName="email" type="email" label="Email" labelPlacement="stacked"></ion-input></ion-item>
          <ion-item><ion-input formControlName="password" type="password" label="Password" labelPlacement="stacked"></ion-input></ion-item>
          <ion-button expand="block" type="submit" [disabled]="form.invalid">Sign In</ion-button>
        </form>
        <ion-note class="demo-hint">
          Demo: hr&#64;acmeglobal.demo / james.okonkwo&#64;demo.mail / verify&#64;digipermit.demo — Password: Demo&#64;12345
        </ion-note>
        <ion-button fill="clear" routerLink="/welcome">Back to Home</ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    .login-page { --background: #f4f6f9; }
    .login-card { max-width:400px; margin:10vh auto; padding:32px; background:#fff; border-radius:12px; box-shadow:0 4px 24px rgba(0,0,0,0.08); }
    h1 { text-align:center; color:var(--ion-color-primary); margin:0 0 4px; }
    p { text-align:center; color:var(--ion-color-medium); margin-bottom:24px; }
    .demo-hint { display:block; margin-top:16px; font-size:0.75rem; line-height:1.4; }
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
