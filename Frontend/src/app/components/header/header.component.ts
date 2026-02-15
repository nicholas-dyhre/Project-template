import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UserDto } from '../../api/generated-api-client';
import { Nav } from './nav.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Nav],
  templateUrl: './header.component.html',
})
export class Header implements OnInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  isAuthenticated = false;
  currentUser: UserDto | null = null;
  showUserMenu = false;

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    this.authService.currentUser$.subscribe((user) => {
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
    console.log('Logout clicked');
    this.authService.logout().subscribe(() => {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.closeUserMenu();
      this.showUserMenu = false;
      this.cdr.markForCheck();
    });
  }
}
