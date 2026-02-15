import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout';
import { ApiClient, BasketItem, Product } from '../../api/generated-api-client';
import { Observable, switchMap, of, shareReplay, map, combineLatest, BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasketItemComponent } from "./basket-item.component";
import { BasketStateService } from '../../../services/BasketStateService';

@Component({
  selector: 'app-basket-page',
  imports: [PageLayout, RouterModule, CommonModule, BasketItemComponent],
  templateUrl: './basket-page.html',
})
export class BasketPage {
  private cdr = inject(ChangeDetectorRef);
  private basketStateService = inject(BasketStateService);
  constructor(private apiClient: ApiClient) {}

  private refreshBasket$ = new BehaviorSubject<void>(undefined);

  trackByBasketItem(index: number, item: BasketItem) {
    return item.id;
  }
  
  basketId$ = this.basketStateService.basketId$;

  basket$ = combineLatest([this.basketId$, this.refreshBasket$]).pipe(
    switchMap(([id]) => this.apiClient.basket_GetBasket(id)),
    shareReplay(1)
  );

  basketItems$: Observable<BasketItem[]> = this.basket$.pipe(
    switchMap(basket => of(basket.items ?? []))
  );

  basketProducts$: Observable<Product[]> = this.basketItems$.pipe(
    map(items =>
      items
        .map(item => item.product)
        .filter((p): p is Product => !!p)
    )
  );

  basketTotal$!: Observable<number>;

  calculateTotal(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  }

  removeItem(basketItem?: BasketItem) {
    console.log("remove item called");
    if (!basketItem?.product?.id) return;

    this.basketId$
      .pipe(
        switchMap(id => this.apiClient.basket_RemoveProductFromBasket(id, basketItem.product!.id!))
      )
      .subscribe(() => {
        this.refreshBasket$.next();
      });
  }

  addItem(productId: number) {
    this.basketId$
      .pipe(
        switchMap(id =>
          this.apiClient.basket_AddProductToBasket(id, productId)
        )
      )
      .subscribe(() => {
        this.refreshBasket$.next();
      });
  }

  updateQuantity(productId: number, quantity: number) {
    this.basketId$
      .pipe(
        switchMap(id =>
          this.apiClient.basket_SetProductQuantity(id, productId, quantity)
        )
      )
      .subscribe(() => {
        this.refreshBasket$.next();
      });
  }

  async checkout() {
    this.basketStateService.checkoutBasket().subscribe({
      next: () => alert('Checkout successful!'),
      error: err => alert('Checkout failed: ' + err)
    });
  }
}
