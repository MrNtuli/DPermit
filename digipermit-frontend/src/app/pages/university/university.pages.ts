import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-university-dashboard',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>International Students</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <app-page-header title="Study Visa Compliance" subtitle="Monitor international student permits"></app-page-header>
      <ion-grid><ion-row><ion-col size="6" *ngFor="let s of cards"><ion-card><ion-card-content><h2>{{ s.v }}</h2><p>{{ s.l }}</p></ion-card-content></ion-card></ion-col></ion-row></ion-grid>
    </ion-content>
  `,
  styles: [`h2{font-size:1.8rem;margin:0;color:var(--ion-color-primary)}`],
  standalone: false,
})
export class UniversityDashboardPage implements OnInit {
  cards: { l: string; v: number }[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.get<any>('/analytics/summary').subscribe(res => {
      this.cards = [
        { l: 'Students', v: res.data.total_foreign_nationals }, { l: 'Active Visas', v: res.data.active_permits },
        { l: 'Expiring', v: res.data.expiring_permits }, { l: 'Alerts', v: res.data.unresolved_alerts },
      ];
    });
  }
}

@Component({
  selector: 'app-university-list',
  template: `
    <ion-header><ion-toolbar><ion-buttons slot="start"><ion-menu-button></ion-menu-button></ion-buttons><ion-title>{{ title }}</ion-title></ion-toolbar></ion-header>
    <ion-content class="ion-padding">
      <ion-list><ion-item *ngFor="let item of items"><ion-label><h2>{{ item.full_name || item.permit_number }}</h2><p>{{ item.nationality || item.permit_types?.name }}</p></ion-label><app-status-badge [status]="item.status"></app-status-badge></ion-item></ion-list>
    </ion-content>
  `,
  standalone: false,
})
export class UniversityListPage implements OnInit {
  title = ''; items: any[] = [];
  constructor(private api: ApiService) {
    this.title = window.location.pathname.includes('students') ? 'International Students' : 'Study Visa Records';
  }
  ngOnInit() {
    const ep = window.location.pathname.includes('students') ? '/foreign-nationals' : '/permits';
    this.api.get<any[]>(ep).subscribe(res => this.items = res.data as any[]);
  }
}
