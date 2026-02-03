import { Component, inject, OnInit } from '@angular/core';
import { PageLayout } from '../components/page-layout/page-layout';
import { ApiClient, Basket, BasketItem, Product } from '../api/generated-api-client';
import { Observable, switchMap, of, tap, shareReplay, map, combineLatest, BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BasketStateService } from '../../services/BasketStateService';

@Component({
  selector: 'app-basket-page',
  imports: [PageLayout, RouterModule, CommonModule],
  templateUrl: './basket-page.html',
})
export class BasketPage {

  private basketStateService = inject(BasketStateService);
  constructor(private apiClient: ApiClient) {}

  private refreshBasket$ = new BehaviorSubject<void>(undefined);
  
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

  removeItem(productId?: number) {
    if (productId == null) return;

    this.basketId$
      .pipe(
        switchMap(id => this.apiClient.basket_RemoveProductFromBasket(id, productId))
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

  checkout() {
    this.basketId$
      .pipe(
        switchMap(id => this.apiClient.checkout_Checkout(id)),
        tap(() => localStorage.removeItem('basketId'))
      )
      .subscribe(() => alert('Checkout successful!'));
  }
}
