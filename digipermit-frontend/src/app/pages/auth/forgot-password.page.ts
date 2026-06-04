import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  template: `
    <ion-content class="login-page">
      <div class="login-wrap">
        <div class="login-card">
          <div class="login-brand">
            <div class="logo"><ion-icon name="mail-outline"></ion-icon></div>
            <h1>Reset password</h1>
            <p>Enter your account email. We will send a reset link if the account exists.</p>
          </div>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <ion-item lines="none" class="field field-item">
              <ion-input formControlName="email" type="email" label="Email" labelPlacement="stacked"
                placeholder="you@organisation.demo"></ion-input>
            </ion-item>
            <ion-button expand="block" type="submit" [disabled]="form.invalid || sent" class="submit-btn">
              {{ sent ? 'Email sent' : 'Send reset link' }}
            </ion-button>
          </form>
          <p class="reset-hint" *ngIf="sent">{{ successMessage }}</p>
          <ion-button fill="clear" routerLink="/login" size="small">← Back to sign in</ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .reset-hint {
      font-size: 0.85rem;
      color: var(--dp-text-muted, #64748b);
      margin: 12px 0 0;
      line-height: 1.45;
    }
  `],
  standalone: false,
})
export class ForgotPasswordPage {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });
  sent = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private loading: LoadingController,
    private toast: ToastController,
  ) {}

  async submit() {
    const loader = await this.loading.create({ message: 'Sending...' });
    await loader.present();
    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: async (res) => {
        await loader.dismiss();
        this.sent = true;
        this.successMessage = res.message || res.data?.message || 'Check your inbox for the reset link.';
        const t = await this.toast.create({ message: this.successMessage, color: 'success', duration: 4000 });
        t.present();
      },
      error: async (err) => {
        await loader.dismiss();
        const t = await this.toast.create({
          message: err.error?.message || 'Could not send reset email',
          color: 'danger',
          duration: 3000,
        });
        t.present();
      },
    });
  }
}
