import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import { ImmigrationDashboardPage, ImmigrationPendingPage, ImmigrationSuspiciousPage } from './immigration.pages';
import { RoleAlertsPage } from '../../shared/role-alerts/role-alerts.page';

const routes: Routes = [
  { path: 'dashboard', component: ImmigrationDashboardPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['immigration_officer'] } },
  { path: 'pending', component: ImmigrationPendingPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['immigration_officer'] } },
  { path: 'suspicious', component: ImmigrationSuspiciousPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['immigration_officer'] } },
  { path: 'alerts', component: RoleAlertsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['immigration_officer'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [ImmigrationDashboardPage, ImmigrationPendingPage, ImmigrationSuspiciousPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ImmigrationPagesModule {}
