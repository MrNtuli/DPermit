import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

export interface MenuItem {
  title: string;
  url: string;
  icon: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private allItems: MenuItem[] = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: 'grid-outline', roles: ['system_admin'] },
    { title: 'Organisations', url: '/admin/organisations', icon: 'business-outline', roles: ['system_admin'] },
    { title: 'Users', url: '/admin/users', icon: 'people-outline', roles: ['system_admin'] },
    { title: 'Permit Types', url: '/admin/permit-types', icon: 'list-outline', roles: ['system_admin'] },
    { title: 'All Permits', url: '/admin/permits', icon: 'document-text-outline', roles: ['system_admin'] },
    { title: 'Alerts', url: '/admin/alerts', icon: 'warning-outline', roles: ['system_admin', 'employer_hr', 'university_officer', 'clinic_admin', 'immigration_officer'] },
    { title: 'Verification Logs', url: '/admin/verification-logs', icon: 'scan-outline', roles: ['system_admin'] },
    { title: 'IoT Devices', url: '/admin/iot-devices', icon: 'hardware-chip-outline', roles: ['system_admin'] },
    { title: 'Analytics', url: '/admin/analytics', icon: 'bar-chart-outline', roles: ['system_admin'] },

    { title: 'My Dashboard', url: '/foreign-national/dashboard', icon: 'home-outline', roles: ['foreign_national'] },
    { title: 'My Permits', url: '/foreign-national/permits', icon: 'document-outline', roles: ['foreign_national'] },
    { title: 'Notifications', url: '/foreign-national/notifications', icon: 'notifications-outline', roles: ['foreign_national'] },
    { title: 'Update Requests', url: '/foreign-national/requests', icon: 'create-outline', roles: ['foreign_national'] },

    { title: 'Dashboard', url: '/employer/dashboard', icon: 'grid-outline', roles: ['employer_hr'] },
    { title: 'Foreign Employees', url: '/employer/employees', icon: 'people-outline', roles: ['employer_hr'] },
    { title: 'Permit Records', url: '/employer/permits', icon: 'document-text-outline', roles: ['employer_hr'] },
    { title: 'Verify Permit', url: '/verification/manual', icon: 'search-outline', roles: ['employer_hr'] },
    { title: 'Renewal Requests', url: '/employer/requests', icon: 'create-outline', roles: ['employer_hr'] },

    { title: 'Dashboard', url: '/university/dashboard', icon: 'grid-outline', roles: ['university_officer'] },
    { title: 'Students', url: '/university/students', icon: 'school-outline', roles: ['university_officer'] },
    { title: 'Study Visas', url: '/university/permits', icon: 'document-text-outline', roles: ['university_officer'] },

    { title: 'Dashboard', url: '/clinic/dashboard', icon: 'grid-outline', roles: ['clinic_admin'] },
    { title: 'Foreign Nationals', url: '/clinic/patients', icon: 'medkit-outline', roles: ['clinic_admin'] },
    { title: 'Permit Records', url: '/clinic/permits', icon: 'document-text-outline', roles: ['clinic_admin'] },

    { title: 'Verification', url: '/verification/dashboard', icon: 'shield-checkmark-outline', roles: ['verification_officer'] },
    { title: 'Manual Lookup', url: '/verification/manual', icon: 'search-outline', roles: ['verification_officer'] },
    { title: 'QR Scan', url: '/verification/qr', icon: 'qr-code-outline', roles: ['verification_officer'] },
    { title: 'RFID Simulation', url: '/verification/rfid', icon: 'radio-outline', roles: ['verification_officer'] },
    { title: 'Recent Logs', url: '/verification/logs', icon: 'list-outline', roles: ['verification_officer'] },

    { title: 'Review Dashboard', url: '/immigration/dashboard', icon: 'grid-outline', roles: ['immigration_officer'] },
    { title: 'Pending Permits', url: '/immigration/pending', icon: 'time-outline', roles: ['immigration_officer'] },
    { title: 'Suspicious Records', url: '/immigration/suspicious', icon: 'alert-circle-outline', roles: ['immigration_officer'] },

    { title: 'Analytics', url: '/manager/dashboard', icon: 'analytics-outline', roles: ['manager', 'auditor'] },
    { title: 'Reports', url: '/manager/reports', icon: 'document-outline', roles: ['manager', 'auditor'] },

    { title: 'Profile', url: '/profile', icon: 'person-outline', roles: ['system_admin', 'foreign_national', 'employer_hr', 'university_officer', 'clinic_admin', 'verification_officer', 'immigration_officer', 'manager', 'auditor'] },
  ];

  constructor(private auth: AuthService) {}

  getMenuItems(): MenuItem[] {
    const role = this.auth.profile?.role;
    if (!role) return [];
    return this.allItems.filter(item => item.roles.includes(role));
  }
}
