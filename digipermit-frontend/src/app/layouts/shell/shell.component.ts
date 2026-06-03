import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuService, MenuItem } from '../../services/menu.service';
import { ROLE_LABELS } from '../../interfaces/models';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  standalone: false,
})
export class ShellComponent implements OnInit {
  menuItems: MenuItem[] = [];
  profileName = '';
  roleLabel = '';
  initials = '?';

  constructor(public auth: AuthService, private menu: MenuService) {}

  ngOnInit() {
    this.menuItems = this.menu.getMenuItems();
    this.profileName = this.auth.profile?.full_name || '';
    const role = this.auth.profile?.role || '';
    this.roleLabel = ROLE_LABELS[role] || role.replace(/_/g, ' ');
    this.initials = this.profileName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0]?.toUpperCase() || '')
      .join('') || '?';
  }

  logout() { this.auth.logout(); }
}
