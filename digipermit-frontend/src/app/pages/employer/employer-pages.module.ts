import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import { EmployerDashboardPage, EmployerEmployeesPage, EmployerPermitsPage, EmployerRequestsPage } from './employer.pages';
import { RoleAlertsPage } from '../../shared/role-alerts/role-alerts.page';

const routes: Routes = [
  { path: 'dashboard', component: EmployerDashboardPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['employer_hr'] } },
  { path: 'employees', component: EmployerEmployeesPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['employer_hr'] } },
  { path: 'permits', component: EmployerPermitsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['employer_hr'] } },
  { path: 'requests', component: EmployerRequestsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['employer_hr'] } },
  { path: 'alerts', component: RoleAlertsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['employer_hr'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [EmployerDashboardPage, EmployerEmployeesPage, EmployerPermitsPage, EmployerRequestsPage],
  imports: [SharedModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class EmployerPagesModule {}
