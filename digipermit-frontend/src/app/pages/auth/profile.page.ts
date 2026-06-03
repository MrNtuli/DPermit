import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { UserProfile } from '../../interfaces/models';

@Component({
  selector: 'app-profile',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Profile</ion-title></ion-toolbar></ion-header>
    <ion-content class="app-page">
      <div class="page-inner profile-card-wrap">
        <app-page-header title="My Profile" subtitle="Account details and organisation access"></app-page-header>
      <ion-card *ngIf="profile">
        <ion-card-header><ion-card-title>{{ profile.full_name }}</ion-card-title><ion-card-subtitle>{{ profile.role | titlecase }}</ion-card-subtitle></ion-card-header>
        <ion-card-content>
          <p><strong>Email:</strong> {{ profile.email }}</p>
          <p *ngIf="profile.phone_number"><strong>Phone:</strong> {{ profile.phone_number }}</p>
          <p *ngIf="profile.organisations"><strong>Organisation:</strong> {{ profile.organisations.name }}</p>
          <p><strong>Status:</strong> <app-status-badge [status]="profile.status"></app-status-badge></p>
        </ion-card-content>
      </ion-card>
      </div>
    </ion-content>
  `,
  standalone: false,
})
export class ProfilePage implements OnInit {
  profile: UserProfile | null = null;
  constructor(private auth: AuthService, private api: ApiService) {}
  ngOnInit() {
    this.api.get<UserProfile>('/auth/profile').subscribe(res => this.profile = res.data);
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
