import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Permit, Notification } from '../../interfaces/models';

@Component({
  selector: 'app-fn-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>My Dashboard</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header title="Personal Compliance" subtitle="Your visa and permit records"></app-page-header>
      <ion-card *ngFor="let p of permits">
        <ion-card-header>
          <ion-card-title>{{ p.permit_types?.name }}</ion-card-title>
          <ion-card-subtitle>{{ p.permit_number }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <app-status-badge [status]="p.status"></app-status-badge>
          <app-expiry-countdown [expiryDate]="p.expiry_date"></app-expiry-countdown>
          <ion-button fill="outline" size="small" [routerLink]="['/permit-document', p.id]">View Permit Document</ion-button>
        </ion-card-content>
      </ion-card>
      <h3>Recent Notifications</h3>
      <ion-list>
        <ion-item *ngFor="let n of notifications">
          <ion-label><h3>{{ n.title }}</h3><p>{{ n.message }}</p></ion-label>
          <ion-badge *ngIf="!n.is_read" color="primary">New</ion-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class FnDashboardPage implements OnInit {
  permits: Permit[] = [];
  notifications: Notification[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<Permit[]>('/permits').subscribe(res => this.permits = res.data as Permit[]);
    this.api.get<Notification[]>('/notifications').subscribe(res => this.notifications = (res.data as Notification[]).slice(0, 5));
  }
}

@Component({
  selector: 'app-fn-permits',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>My Permits</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let p of permits" [routerLink]="['/permit-document', p.id]" button>
          <ion-label>
            <h2>{{ p.permit_types?.name }}</h2>
            <p>{{ p.permit_number }} · Expires {{ p.expiry_date }}</p>
          </ion-label>
          <app-status-badge [status]="p.status"></app-status-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class FnPermitsPage implements OnInit {
  permits: Permit[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<Permit[]>('/permits').subscribe(res => this.permits = res.data as Permit[]); }
}

@Component({
  selector: 'app-fn-qr',
  template: `<ion-header><ion-toolbar><ion-buttons slot="start"><ion-back-button defaultHref="/foreign-national/permits"></ion-back-button></ion-buttons></ion-toolbar></ion-header><ion-content></ion-content>`,
  standalone: false,
})
export class FnQrPage implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.router.navigate(['/permit-document', id], { replaceUrl: true });
  }
}

@Component({
  selector: 'app-fn-notifications',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Notifications</ion-title></ion-toolbar></ion-header>
    <ion-content>
      <ion-list>
        <ion-item *ngFor="let n of notifications" (click)="markRead(n)">
          <ion-label [class.unread]="!n.is_read"><h3>{{ n.title }}</h3><p>{{ n.message }}</p><p><small>{{ n.created_at | date:'medium' }}</small></p></ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`.unread h3 { font-weight:700; }`],
  standalone: false,
})
export class FnNotificationsPage implements OnInit {
  notifications: Notification[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }
  load() { this.api.get<Notification[]>('/notifications').subscribe(res => this.notifications = res.data as Notification[]); }
  markRead(n: Notification) {
    if (!n.is_read) this.api.put(`/notifications/${n.id}/read`, {}).subscribe(() => { n.is_read = true; });
  }
}

@Component({
  selector: 'app-fn-requests',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>Update Requests</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list>
        <ion-item *ngFor="let r of requests">
          <ion-label><h3>{{ r.request_type | titlecase }}</h3><p>{{ r.notes }}</p></ion-label>
          <app-status-badge [status]="r.status"></app-status-badge>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class FnRequestsPage implements OnInit {
  requests: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() { this.api.get<any[]>('/renewal-update-requests').subscribe(res => this.requests = res.data as any[]); }
}
