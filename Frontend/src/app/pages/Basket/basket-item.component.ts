import { Component, inject, input } from '@angular/core';
import { BasketItem } from '../../api/generated-api-client';
import { BehaviorSubject } from 'rxjs';
import { BasketStateService } from '../../../services/BasketStateService';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  imports: [CommonModule, RouterLink],
})
export class BasketItemComponent {
  readonly basketItem = input<BasketItem>();
  readonly removeItem = input<(basketItem: BasketItem) => void>();
  readonly updateQuantity = input<(productId: number, quantity: number) => void>();
  readonly setQuantity = input<(quantity: number) => void>();

  private basketStateService = inject(BasketStateService);

  basketId$ = this.basketStateService.basketId$;
  refreshBasket$ = new BehaviorSubject<void>(undefined);
}
