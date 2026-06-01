import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import {
  VerifyDashboardPage, VerifyManualPage, VerifyQrPage, VerifyRfidPage,
  VerifyLogsPage, VerifyResultComponent,
} from './verification.pages';

const verifyRoles = { roles: ['verification_officer', 'employer_hr', 'university_officer', 'clinic_admin', 'system_admin'] };

const routes: Routes = [
  { path: 'dashboard', component: VerifyDashboardPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['verification_officer'] } },
  { path: 'manual', component: VerifyManualPage, canActivate: [AuthGuard, RoleGuard], data: verifyRoles },
  { path: 'qr', component: VerifyQrPage, canActivate: [AuthGuard, RoleGuard], data: verifyRoles },
  { path: 'rfid', component: VerifyRfidPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['verification_officer', 'system_admin'] } },
  { path: 'logs', component: VerifyLogsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['verification_officer'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [VerifyDashboardPage, VerifyManualPage, VerifyQrPage, VerifyRfidPage, VerifyLogsPage, VerifyResultComponent],
  imports: [SharedModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class VerificationPagesModule {}
