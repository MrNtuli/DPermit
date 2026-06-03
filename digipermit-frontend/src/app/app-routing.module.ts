import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './layouts/shell/shell.component';
import { AuthGuard, AreaGuard, GuestGuard } from './guards/auth.guard';
import { LandingPage } from './pages/auth/landing.page';
import { LoginPage } from './pages/auth/login.page';
import { AccessDeniedPage } from './pages/auth/profile.page';

const routes: Routes = [
  { path: 'welcome', component: LandingPage, canActivate: [GuestGuard] },
  { path: 'login', component: LoginPage, canActivate: [GuestGuard] },
  { path: 'access-denied', component: AccessDeniedPage },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'admin', loadChildren: () => import('./pages/admin/admin-pages.module').then(m => m.AdminPagesModule), canActivate: [AreaGuard], data: { roles: ['system_admin'] } },
      { path: 'foreign-national', loadChildren: () => import('./pages/foreign-national/fn-pages.module').then(m => m.ForeignNationalPagesModule), canActivate: [AreaGuard], data: { roles: ['foreign_national'] } },
      { path: 'employer', loadChildren: () => import('./pages/employer/employer-pages.module').then(m => m.EmployerPagesModule), canActivate: [AreaGuard], data: { roles: ['employer_hr'] } },
      { path: 'university', loadChildren: () => import('./pages/university/university-pages.module').then(m => m.UniversityPagesModule), canActivate: [AreaGuard], data: { roles: ['university_officer'] } },
      { path: 'clinic', loadChildren: () => import('./pages/clinic/clinic-pages.module').then(m => m.ClinicPagesModule), canActivate: [AreaGuard], data: { roles: ['clinic_admin'] } },
      { path: 'verification', loadChildren: () => import('./pages/verification/verification-pages.module').then(m => m.VerificationPagesModule), canActivate: [AreaGuard], data: { roles: ['verification_officer', 'employer_hr', 'university_officer', 'clinic_admin', 'system_admin'] } },
      { path: 'immigration', loadChildren: () => import('./pages/immigration/immigration-pages.module').then(m => m.ImmigrationPagesModule), canActivate: [AreaGuard], data: { roles: ['immigration_officer'] } },
      { path: 'manager', loadChildren: () => import('./pages/manager/manager-pages.module').then(m => m.ManagerPagesModule), canActivate: [AreaGuard], data: { roles: ['manager', 'auditor'] } },
      { path: 'profile', loadChildren: () => import('./pages/auth/auth-pages.module').then(m => m.AuthPagesModule) },
      { path: 'permit-document', loadChildren: () => import('./pages/shared/shared-pages.module').then(m => m.SharedPagesModule) },
    ],
  },
  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
