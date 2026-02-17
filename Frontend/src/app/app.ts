import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { BasketStateService } from '../services/basketStateService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('Frontend');
  private authService = inject(AuthService);
  private basketStateService = inject(BasketStateService);

  ngOnInit(): void {
    this.authService.checkAuthStatus();
    this.basketStateService.getOrCreateBasketId();
  }
}
