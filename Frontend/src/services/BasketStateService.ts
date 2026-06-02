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
import { ApiClient, CheckoutRequest, Order, Basket, FileResponse } from '../app/api/generated-api-client';
import { LocalStorageService } from './localStorage.service';
import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasketStateService {
  private apiClient = inject(ApiClient);
  private localStorageService = inject(LocalStorageService);
  private basketIdSubject = new BehaviorSubject<string | null>(null);
  private basketSignal = signal<Basket | null>(null);

  readonly basket = this.basketSignal.asReadonly();
  readonly basketItems = computed(() => this.basketSignal()?.items ?? []);

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
    this.initializeBasketSignal();
  }

  private initializeBasketSignal() {
    this.basketId$
      .pipe(
        switchMap((id) => (id ? this.apiClient.basket_GetBasket(id) : of(null))),
        tap((basket) => this.basketSignal.set(basket)),
      )
      .subscribe();
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

  async addItem(productId: number): Promise<FileResponse> {
    const basketId = await firstValueFrom(this.basketId$.pipe(take(1)));
    const result = await firstValueFrom(this.apiClient.basket_AddProductToBasket(basketId!, productId));
    await this.refreshBasket();
    return result;
  }

  async updateQuantity(productId: number, quantity: number): Promise<FileResponse> {
    const basketId = await firstValueFrom(this.basketId$.pipe(take(1)));
    const result = await firstValueFrom(this.apiClient.basket_SetProductQuantity(basketId!, productId, quantity));
    await this.refreshBasket();
    return result;
  }

  async removeItem(productId: number): Promise<FileResponse> {
    const basketId = await firstValueFrom(this.basketId$.pipe(take(1)));
    const result = await firstValueFrom(this.apiClient.basket_RemoveProductFromBasket(basketId!, productId));
    await this.refreshBasket();
    return result;
  }

  private async refreshBasket(): Promise<void> {
    const basketId = await firstValueFrom(this.basketId$.pipe(take(1)));
    const basket = basketId ? await firstValueFrom(this.apiClient.basket_GetBasket(basketId)) : null;
    this.basketSignal.set(basket);
  }

  async clearBasket() {
    this.localStorageService.RemoveBasketId();
    this.basketIdSubject.next(null);
    this.basketSignal.set(null);
    await this.getOrCreateBasketId();
  }
}
