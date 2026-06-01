import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { ExpiryCountdownComponent } from './expiry-countdown/expiry-countdown.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';

@NgModule({
  declarations: [StatusBadgeComponent, ExpiryCountdownComponent, PageHeaderComponent, EmptyStateComponent],
  imports: [CommonModule, IonicModule, RouterModule],
  exports: [StatusBadgeComponent, ExpiryCountdownComponent, PageHeaderComponent, EmptyStateComponent, CommonModule, IonicModule, RouterModule],
})
export class SharedModule {}
