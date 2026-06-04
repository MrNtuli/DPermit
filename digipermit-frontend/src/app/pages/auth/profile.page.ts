import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { UserProfile } from '../../interfaces/models';
import { LoadingController, ToastController } from '@ionic/angular';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const p = group.get('new_password')?.value;
  const c = group.get('confirm_password')?.value;
  return p && c && p !== c ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Profile</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner profile-card-wrap">
        <app-page-header title="My Profile" subtitle="Account details and security"></app-page-header>
        <ion-card *ngIf="profile">
          <ion-card-header>
            <ion-card-title>{{ profile.full_name }}</ion-card-title>
            <ion-card-subtitle>{{ profile.role | titlecase }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Email:</strong> {{ profile.email }}</p>
            <p *ngIf="profile.phone_number"><strong>Phone:</strong> {{ profile.phone_number }}</p>
            <p *ngIf="profile.organisations"><strong>Organisation:</strong> {{ profile.organisations.name }}</p>
            <p><strong>Status:</strong> <app-status-badge [status]="profile.status"></app-status-badge></p>
          </ion-card-content>
        </ion-card>

        <ion-card class="password-card">
          <ion-card-header>
            <ion-card-title>Change password</ion-card-title>
            <ion-card-subtitle>Update your sign-in password</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
              <ion-item lines="none" class="field-item">
                <ion-input formControlName="current_password" type="password" label="Current password"
                  labelPlacement="stacked"></ion-input>
              </ion-item>
              <ion-item lines="none" class="field-item">
                <ion-input formControlName="new_password" type="password" label="New password"
                  labelPlacement="stacked"></ion-input>
              </ion-item>
              <ion-item lines="none" class="field-item">
                <ion-input formControlName="confirm_password" type="password" label="Confirm new password"
                  labelPlacement="stacked"></ion-input>
              </ion-item>
              <ion-note color="danger" *ngIf="passwordForm.errors?.['passwordMismatch'] && passwordForm.touched">
                New passwords do not match
              </ion-note>
              <ion-button expand="block" type="submit" [disabled]="passwordForm.invalid" class="submit-password">
                Update password
              </ion-button>
            </form>
            <p class="password-hint">Forgot your current password? Sign out and use <a routerLink="/forgot-password">Forgot password</a> on the login page.</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .password-card { margin-top: 16px; }
    .field-item { margin-bottom: 8px; }
    .submit-password { margin-top: 12px; }
    .password-hint {
      font-size: 0.8rem;
      color: var(--dp-text-muted, #64748b);
      margin: 14px 0 0;
      line-height: 1.45;
    }
    .password-hint a { color: var(--dp-emerald, #1f7a5a); text-decoration: none; font-weight: 600; }
  `],
  standalone: false,
})
export class ProfilePage implements OnInit {
  profile: UserProfile | null = null;

  passwordForm = this.fb.group(
    {
      current_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]],
    },
    { validators: passwordsMatch },
  );

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private fb: FormBuilder,
    private loading: LoadingController,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.api.get<UserProfile>('/auth/profile').subscribe(res => (this.profile = res.data));
  }

  async changePassword() {
    const v = this.passwordForm.value;
    const loader = await this.loading.create({ message: 'Updating password...' });
    await loader.present();
    this.auth.changePassword(v.current_password!, v.new_password!).subscribe({
      next: async () => {
        await loader.dismiss();
        this.passwordForm.reset();
        const t = await this.toast.create({ message: 'Password changed successfully', color: 'success', duration: 3000 });
        t.present();
      },
      error: async (err) => {
        await loader.dismiss();
        const t = await this.toast.create({
          message: err.error?.message || 'Could not change password',
          color: 'danger',
          duration: 3500,
        });
        t.present();
      },
    });
  }
}

@Component({
  selector: 'app-access-denied',
  template: `
    <ion-content class="app-page">
      <div class="access-denied-wrap">
        <ion-icon name="lock-closed-outline"></ion-icon>
        <h2>Access Denied</h2>
        <p>You do not have permission to view this page.</p>
        <ion-button [routerLink]="dashboardRoute">Go to Dashboard</ion-button>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class AccessDeniedPage {
  dashboardRoute = '/login';
  constructor(auth: AuthService) { this.dashboardRoute = auth.getDashboardRoute(); }
}
