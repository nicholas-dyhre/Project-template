// detail-product.component.ts
import { Component, signal, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../api/generated-api-client';
import { CommonModule } from '@angular/common';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { AsyncButtonComponent } from './async-button.component';

export type FlyState = 'idle' | 'waiting' | 'success' | 'fail';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.html',
  imports: [RouterLink, CommonModule, AsyncButtonComponent],
})
export class DetailProduct {
  product$ = input<Observable<Product>>();
  addToBasket = input<(productId: number) => Promise<void>>();
  handleClick = input<(() => void) | undefined>();

  flyState = signal<FlyState>('idle');
  flyImageUrl = signal<string>('');

  isBusy() {
    return this.flyState() === 'waiting';
  }

  addToCartAction(product: Product) {
    return async () => {
      const fn = this.addToBasket(); // read signal ONCE

      if (!fn) {
        throw new Error('addToBasket input not provided');
      }

      await fn(product.id!);
    };
  }
}