import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AuthGuard, RoleGuard } from '../../guards/auth.guard';
import { UniversityDashboardPage, UniversityListPage } from './university.pages';

const routes: Routes = [
  { path: 'dashboard', component: UniversityDashboardPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['university_officer'] } },
  { path: 'students', component: UniversityListPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['university_officer'] } },
  { path: 'permits', component: UniversityListPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['university_officer'] } },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [UniversityDashboardPage, UniversityListPage],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class UniversityPagesModule {}
