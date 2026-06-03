import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { ExpiryCountdownComponent } from './expiry-countdown/expiry-countdown.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { QrDisplayComponent } from './qr-display/qr-display.component';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { PermitDocumentComponent } from './permit-document/permit-document.component';
import { VerificationCertificateComponent } from './verification-certificate/verification-certificate.component';
import { ChartCanvasComponent } from './dashboard-charts/chart-canvas.component';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { VerifyQuickActionsComponent } from './verify-quick-actions/verify-quick-actions.component';
import { KpiStatCardComponent } from './kpi-stat-card/kpi-stat-card.component';
import { RoleAlertsPage } from './role-alerts/role-alerts.page';

@NgModule({
  declarations: [StatusBadgeComponent, ExpiryCountdownComponent, PageHeaderComponent, EmptyStateComponent, QrDisplayComponent, QrScannerComponent, PermitDocumentComponent, VerificationCertificateComponent, ChartCanvasComponent, DashboardChartsComponent, VerifyQuickActionsComponent, KpiStatCardComponent, RoleAlertsPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  exports: [StatusBadgeComponent, ExpiryCountdownComponent, PageHeaderComponent, EmptyStateComponent, QrDisplayComponent, QrScannerComponent, PermitDocumentComponent, VerificationCertificateComponent, ChartCanvasComponent, DashboardChartsComponent, VerifyQuickActionsComponent, KpiStatCardComponent, RoleAlertsPage, CommonModule, FormsModule, IonicModule, RouterModule],
})
export class SharedModule {}
