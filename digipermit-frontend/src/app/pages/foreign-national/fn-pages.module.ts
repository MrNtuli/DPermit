import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import { FnDashboardPage, FnPermitsPage, FnQrPage, FnNotificationsPage, FnRequestsPage } from './fn.pages';

const fnRoles = { roles: ['foreign_national'] };

const routes: Routes = [
  { path: 'dashboard', component: FnDashboardPage, canActivate: [AuthGuard, RoleGuard], data: fnRoles },
  { path: 'permits', component: FnPermitsPage, canActivate: [AuthGuard, RoleGuard], data: fnRoles },
  { path: 'qr/:id', component: FnQrPage, canActivate: [AuthGuard, RoleGuard], data: fnRoles },
  { path: 'notifications', component: FnNotificationsPage, canActivate: [AuthGuard, RoleGuard], data: fnRoles },
  { path: 'requests', component: FnRequestsPage, canActivate: [AuthGuard, RoleGuard], data: fnRoles },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [FnDashboardPage, FnPermitsPage, FnQrPage, FnNotificationsPage, FnRequestsPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ForeignNationalPagesModule {}
