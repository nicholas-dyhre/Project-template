import { Injectable } from "@angular/core";
import { ApiClient } from "../app/api/generated-api-client";
import { ReplaySubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BasketStateService {
  private basketIdSubject = new ReplaySubject<number>(1);
  basketId$ = this.basketIdSubject.asObservable();

  constructor(private apiClient: ApiClient) {
    this.initBasket();
  }

  private initBasket() {
    const storedId = localStorage.getItem('basketId');

    if (storedId) {
      this.basketIdSubject.next(+storedId);
    } else {
      this.apiClient.basket_CreateBasket().subscribe(id => {
        localStorage.setItem('basketId', id.toString());
        this.basketIdSubject.next(id);
      });
    }
  }

  clearBasket() {
    localStorage.removeItem('basketId');
    this.initBasket();
  }
}