import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // Access token management

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // Basket ID management

  getBasketId(): string | null {
    return localStorage.getItem('basketId');
  }

  setBasketId(basketId: string): void {
    localStorage.setItem('basketId', basketId);
  }

  RemoveBasketId() {
    localStorage.removeItem('basketId');
  }
}
