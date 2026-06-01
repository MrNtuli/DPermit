import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  standalone: false,
})
export class ShellComponent implements OnInit {
  menuItems: MenuItem[] = [];
  profileName = '';

  constructor(public auth: AuthService, private menu: MenuService) {}

  ngOnInit() {
    this.menuItems = this.menu.getMenuItems();
    this.profileName = this.auth.profile?.full_name || '';
  }

  logout() { this.auth.logout(); }
}
