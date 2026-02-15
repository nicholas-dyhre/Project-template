import { BehaviorSubject, firstValueFrom, Observable, of, shareReplay, switchMap, take, tap } from "rxjs";
import { ApiClient } from "../app/api/generated-api-client";
import { LocalStorageService } from "./localStorage.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class BasketStateService {

  private basketIdSubject = new BehaviorSubject<string | null>(null);

  basketId$ = this.basketIdSubject.pipe(
    switchMap(id => {
      if (id) {
        return of(id);
      }

      const storedId = this.localStorageService.getBasketId();

      if (storedId) {
        this.basketIdSubject.next(storedId);
        return of(storedId);
      }

      return this.apiClient.basket_CreateBasket().pipe(
        tap(newId => {
          this.localStorageService.setBasketId(newId);
          this.basketIdSubject.next(newId);
        })
      );
    }),
    shareReplay(1)
  );

  constructor(
    private apiClient: ApiClient,
    private localStorageService: LocalStorageService
  ) {
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

    const newId = await firstValueFrom(
      this.apiClient.basket_CreateBasket()
    );

    this.localStorageService.setBasketId(newId);
    this.basketIdSubject.next(newId);

    return newId;
  }

  checkoutBasket(): Observable<boolean> {
    return this.basketId$.pipe(
      take(1),
      switchMap(basketId =>
        this.apiClient.checkout_Checkout(basketId)
      ),
      tap(() => this.clearBasket())
    );
  }

  async clearBasket() {
    this.localStorageService.RemoveBasketId();
    this.basketIdSubject.next(null);
    await this.getOrCreateBasketId();
  }
}
