import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import { PermitDocumentPage } from './permit-document.page';

const roles = {
  roles: [
    'system_admin', 'foreign_national', 'employer_hr', 'university_officer',
    'clinic_admin', 'immigration_officer', 'manager', 'auditor',
  ],
};

const routes: Routes = [
  { path: ':id', component: PermitDocumentPage, canActivate: [AuthGuard, RoleGuard], data: roles },
];

@NgModule({
  declarations: [PermitDocumentPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class SharedPagesModule {}
