import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconBasket } from '../Icons/icon-basket.component';
import { UserDto } from '../../api/generated-api-client';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, IconBasket],
  templateUrl: './nav.component.html',
})
export class Nav {
  readonly isAuthenticated = input<boolean>();
  onLogout = input<() => void>();
  readonly currentUser = input<UserDto | null>();
  showUserMenu = false;

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }
}
