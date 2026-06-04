import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, ROLE_DASHBOARD, UserProfile } from '../interfaces/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  profile$ = this.profileSubject.asObservable();

  constructor(private api: ApiService, private router: Router) {
    const stored = localStorage.getItem('digipermit_profile');
    if (stored) this.profileSubject.next(JSON.parse(stored));
  }

  get profile(): UserProfile | null {
    return this.profileSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('digipermit_token');
  }

  login(email: string, password: string): Observable<unknown> {
    return this.api.post<{ session: { access_token: string }; profile: UserProfile }>('/auth/login', { email, password }).pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('digipermit_token', res.data.session.access_token);
          localStorage.setItem('digipermit_profile', JSON.stringify(res.data.profile));
          this.profileSubject.next(res.data.profile);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('digipermit_token');
    localStorage.removeItem('digipermit_profile');
    this.profileSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshProfile(): Observable<unknown> {
    return this.api.get<UserProfile>('/auth/profile').pipe(
      tap(res => {
        if (res.success && res.data) {
          localStorage.setItem('digipermit_profile', JSON.stringify(res.data));
          this.profileSubject.next(res.data);
        }
      })
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<{ message: string }>> {
    return this.api.post<{ message: string }>('/auth/forgot-password', { email });
  }

  resetPassword(access_token: string, new_password: string): Observable<unknown> {
    return this.api.post('/auth/reset-password', { access_token, new_password });
  }

  changePassword(current_password: string, new_password: string): Observable<unknown> {
    return this.api.post('/auth/change-password', { current_password, new_password });
  }

  hasRole(...roles: string[]): boolean {
    return this.profile ? roles.includes(this.profile.role) : false;
  }

  getDashboardRoute(): string {
    const role = this.profile?.role || '';
    return ROLE_DASHBOARD[role] || '/login';
  }
}
