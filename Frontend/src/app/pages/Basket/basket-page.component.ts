import { Component, inject, computed } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout.component';
import { BasketItem, Product } from '../../api/generated-api-client';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasketItemComponent } from './basket-item.component';
import { BasketStateService } from '../../../services/basketStateService';

@Component({
  selector: 'app-basket-page',
  imports: [PageLayout, RouterModule, CommonModule, BasketItemComponent],
  templateUrl: './basket-page.component.html',
})
export class BasketPage {
  private basketStateService = inject(BasketStateService);

  trackByBasketItem(index: number, item: BasketItem) {
    return item.id;
  }

  basket = this.basketStateService.basket;
  basketItems = this.basketStateService.basketItems;

  basketProducts = computed(() =>
    this.basketItems()
      .map((item) => item.product)
      .filter((p): p is Product => !!p),
  );

  calculateTotal(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  }

  removeItem(basketItem?: BasketItem) {
    console.log('remove item called');
    if (!basketItem?.product?.id) return;

    void this.basketStateService.removeItem(basketItem.product.id);
  }

  addItem(productId: number) {
    void this.basketStateService.addItem(productId);
  }

  updateQuantity(productId: number, quantity: number) {
    void this.basketStateService.updateQuantity(productId, quantity);
  }
}
