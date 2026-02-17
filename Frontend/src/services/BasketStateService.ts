import {
  BehaviorSubject,
  firstValueFrom,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ApiClient, CheckoutRequest, Order } from '../app/api/generated-api-client';
import { LocalStorageService } from './localStorage.service';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasketStateService {
  private apiClient = inject(ApiClient);
  private localStorageService = inject(LocalStorageService);
  private basketIdSubject = new BehaviorSubject<string | null>(null);
  private refreshBasket$ = new BehaviorSubject<void>(undefined);

  basketId$ = this.basketIdSubject.pipe(
    switchMap((id) => {
      if (id) {
        return of(id);
      }

      const storedId = this.localStorageService.getBasketId();

      if (storedId) {
        this.basketIdSubject.next(storedId);
        return of(storedId);
      }

      return this.apiClient.basket_CreateBasket().pipe(
        tap((newId) => {
          this.localStorageService.setBasketId(newId);
          this.basketIdSubject.next(newId);
        }),
      );
    }),
    shareReplay(1),
  );

  constructor() {
    this.getOrCreateBasketId();
  }

  async getOrCreateBasketId(): Promise<string> {
    const current = this.basketIdSubject.value;
    if (current) return current;

    const stored = this.localStorageService.getBasketId();
    if (stored) {
      this.basketIdSubject.next(stored);
      return stored;
    }

    const newId = await firstValueFrom(this.apiClient.basket_CreateBasket());

    this.localStorageService.setBasketId(newId);
    this.basketIdSubject.next(newId);

    return newId;
  }

  checkoutBasket(checkoutRequest: CheckoutRequest): Observable<Order> {
    return this.basketId$.pipe(
      take(1),
      switchMap((basketId) => this.apiClient.checkout_Checkout(basketId, checkoutRequest)),
      tap(() => this.clearBasket()),
    );
  }

  refresh() {
    this.refreshBasket$.next();
  }

  async clearBasket() {
    this.localStorageService.RemoveBasketId();
    this.basketIdSubject.next(null);
    await this.getOrCreateBasketId();
  }

  updateQuantity(productId: number, quantity: number) {
    return this.basketId$.pipe(
      take(1),
      switchMap(id =>
        this.apiClient.basket_SetProductQuantity(id!, productId, quantity)
      ),
      tap(() => this.refresh())
    );
  }

  removeItem(productId: number) {
    return this.basketId$.pipe(
      take(1),
      switchMap(id =>
        this.apiClient.basket_RemoveProductFromBasket(id!, productId)
      ),
      tap(() => this.refresh())
    );
  }
}
