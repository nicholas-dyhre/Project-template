import { Component, signal, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../api/generated-api-client';
import { CommonModule } from '@angular/common';
import { AsyncButtonComponent } from './async-button.component';
import { Observable } from 'rxjs';

export type FlyState = 'idle' | 'waiting' | 'success' | 'fail';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  imports: [RouterLink, CommonModule, AsyncButtonComponent],
})
export class DetailProduct {
  // Signals for inputs
  product$ = input<Observable<Product>>();
  addToBasket = input<(productId: number) => Promise<void>>();
  handleClick = input<(() => void) | undefined>();

  // Signals for UI state
  flyState = signal<FlyState>('idle');
  flyImageUrl = signal<string>('');

  // Signal for button action
  // addToBasketAction = signal<(() => Promise<void>) | undefined>(undefined);

  // // Update the button action whenever the product emits
  // setAddToBasketAction(product: Product) {
  //   this.addToBasketAction.set(() => {
  //     return this.addToBasket()?.(product.id) ?? Promise.resolve();
  //   });
  // }

  isBusy() {
    return this.flyState() === 'waiting';
  }
}
