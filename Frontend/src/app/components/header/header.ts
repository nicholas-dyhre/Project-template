import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconBasket } from '../Icons/icon-basket';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '../../api/generated-api-client';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconBasket],
  templateUrl: './header.html',
})
export class Header {
  isAuthenticated = false;
  currentUser: User | null = null;
  showUserMenu = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  onLogout(): void {
    this.authService.logout().subscribe();
    this.showUserMenu = false;
  }
}
