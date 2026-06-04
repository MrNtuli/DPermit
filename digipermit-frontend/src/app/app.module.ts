import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ShellComponent } from './layouts/shell/shell.component';
import { SharedModule } from './shared/shared.module';
import { LandingPage } from './pages/auth/landing.page';
import { LoginPage } from './pages/auth/login.page';
import { ForgotPasswordPage } from './pages/auth/forgot-password.page';
import { ResetPasswordPage } from './pages/auth/reset-password.page';
import { AccessDeniedPage } from './pages/auth/profile.page';

@NgModule({
  declarations: [
    AppComponent,
    ShellComponent,
    LandingPage,
    LoginPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    AccessDeniedPage,
  ],
  imports: [BrowserModule, HttpClientModule, ReactiveFormsModule, IonicModule.forRoot(), SharedModule, AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
