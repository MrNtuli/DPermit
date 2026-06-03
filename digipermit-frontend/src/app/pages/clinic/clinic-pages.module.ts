import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import { ClinicDashboardPage, ClinicListPage } from './clinic.pages';
import { RoleAlertsPage } from '../../shared/role-alerts/role-alerts.page';

const routes: Routes = [
  { path: 'dashboard', component: ClinicDashboardPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['clinic_admin'] } },
  { path: 'patients', component: ClinicListPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['clinic_admin'] } },
  { path: 'permits', component: ClinicListPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['clinic_admin'] } },
  { path: 'alerts', component: RoleAlertsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['clinic_admin'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [ClinicDashboardPage, ClinicListPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ClinicPagesModule {}
