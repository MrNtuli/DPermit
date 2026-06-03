import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import {
  AdminDashboardPage, AdminListPage, AdminAnalyticsPage, AdminUsersPage, AdminCreateUserPage,
  AdminOrganisationsPage, AdminCreateOrganisationPage, AdminVerificationLogsPage,
} from './admin.pages';

const adminRoles = { roles: ['system_admin'] };

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'organisations', component: AdminOrganisationsPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'organisations/create', component: AdminCreateOrganisationPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'users', component: AdminUsersPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'users/create', component: AdminCreateUserPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'permit-types', component: AdminListPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'permits', component: AdminListPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'alerts', component: AdminListPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'verification-logs', component: AdminVerificationLogsPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'iot-devices', component: AdminListPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: 'analytics', component: AdminAnalyticsPage, canActivate: [AuthGuard, RoleGuard], data: adminRoles },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [AdminDashboardPage, AdminListPage, AdminAnalyticsPage, AdminUsersPage, AdminCreateUserPage, AdminOrganisationsPage, AdminCreateOrganisationPage, AdminVerificationLogsPage],
  imports: [SharedModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class AdminPagesModule {}
