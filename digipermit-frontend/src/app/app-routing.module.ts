import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ShellComponent } from './layouts/shell/shell.component';
import { AuthGuard, GuestGuard } from './guards/auth.guard';
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
      { path: 'admin', loadChildren: () => import('./pages/admin/admin-pages.module').then(m => m.AdminPagesModule) },
      { path: 'foreign-national', loadChildren: () => import('./pages/foreign-national/fn-pages.module').then(m => m.ForeignNationalPagesModule) },
      { path: 'employer', loadChildren: () => import('./pages/employer/employer-pages.module').then(m => m.EmployerPagesModule) },
      { path: 'university', loadChildren: () => import('./pages/university/university-pages.module').then(m => m.UniversityPagesModule) },
      { path: 'clinic', loadChildren: () => import('./pages/clinic/clinic-pages.module').then(m => m.ClinicPagesModule) },
      { path: 'verification', loadChildren: () => import('./pages/verification/verification-pages.module').then(m => m.VerificationPagesModule) },
      { path: 'immigration', loadChildren: () => import('./pages/immigration/immigration-pages.module').then(m => m.ImmigrationPagesModule) },
      { path: 'manager', loadChildren: () => import('./pages/manager/manager-pages.module').then(m => m.ManagerPagesModule) },
      { path: 'profile', loadChildren: () => import('./pages/auth/auth-pages.module').then(m => m.AuthPagesModule) },
    ],
  },
  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
