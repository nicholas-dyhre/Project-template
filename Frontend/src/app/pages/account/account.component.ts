import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UserDto } from '../../api/generated-api-client';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  currentUser: UserDto | null = null;
  isLoading = true;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onLogout(): void {
    if (confirm('Are you sure you want to log out?')) {
      this.authService.logout().subscribe(() => {
      this.currentUser = null;
      this.cdr.markForCheck();
    });
    }
  }
}
