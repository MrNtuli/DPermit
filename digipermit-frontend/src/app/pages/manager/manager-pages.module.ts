import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import { ManagerDashboardPage, ManagerReportsPage } from './manager.pages';

const routes: Routes = [
  { path: 'dashboard', component: ManagerDashboardPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager', 'auditor'] } },
  { path: 'reports', component: ManagerReportsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['manager', 'auditor'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [ManagerDashboardPage, ManagerReportsPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ManagerPagesModule {}
