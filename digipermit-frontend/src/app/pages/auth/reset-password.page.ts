import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const p = group.get('new_password')?.value;
  const c = group.get('confirm_password')?.value;
  return p && c && p !== c ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  template: `
    <ion-content class="login-page">
      <div class="login-wrap">
        <div class="login-card">
          <div class="login-brand">
            <div class="logo"><ion-icon name="key-outline"></ion-icon></div>
            <h1>New password</h1>
            <p *ngIf="accessToken">Choose a new password (at least 8 characters).</p>
            <p *ngIf="!accessToken" class="reset-error">This reset link is invalid or has expired.</p>
          </div>
          <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="accessToken">
            <ion-item lines="none" class="field field-item">
              <ion-input formControlName="new_password" type="password" label="New password"
                labelPlacement="stacked"></ion-input>
            </ion-item>
            <ion-item lines="none" class="field field-item">
              <ion-input formControlName="confirm_password" type="password" label="Confirm password"
                labelPlacement="stacked"></ion-input>
            </ion-item>
            <ion-note color="danger" *ngIf="form.errors?.['passwordMismatch'] && form.touched">
              Passwords do not match
            </ion-note>
            <ion-button expand="block" type="submit" [disabled]="form.invalid" class="submit-btn">
              Update password
            </ion-button>
          </form>
          <ion-button fill="clear" [routerLink]="accessToken ? '/forgot-password' : '/login'" size="small">
            {{ accessToken ? 'Request a new link' : '← Back to sign in' }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .reset-error { color: var(--ion-color-danger, #d64545); }
  `],
  standalone: false,
})
export class ResetPasswordPage implements OnInit {
  accessToken: string | null = null;

  form = this.fb.group(
    {
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: passwordsMatch },
  );

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loading: LoadingController,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.accessToken = this.parseRecoveryToken();
  }

  private parseRecoveryToken(): string | null {
    const readParams = (raw: string) => {
      const params = new URLSearchParams(raw.replace(/^\?/, '').replace(/^#/, ''));
      const type = params.get('type');
      const token = params.get('access_token');
      if (token && (!type || type === 'recovery')) return token;
      return null;
    };
    if (window.location.hash) {
      const fromHash = readParams(window.location.hash.substring(1));
      if (fromHash) return fromHash;
    }
    if (window.location.search) {
      return readParams(window.location.search);
    }
    return null;
  }

  async submit() {
    if (!this.accessToken) return;
    const loader = await this.loading.create({ message: 'Updating...' });
    await loader.present();
    this.auth.resetPassword(this.accessToken, this.form.value.new_password!).subscribe({
      next: async () => {
        await loader.dismiss();
        const t = await this.toast.create({
          message: 'Password updated. Sign in with your new password.',
          color: 'success',
          duration: 3500,
        });
        t.present();
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await loader.dismiss();
        const t = await this.toast.create({
          message: err.error?.message || 'Could not reset password',
          color: 'danger',
          duration: 3500,
        });
        t.present();
      },
    });
  }
}
