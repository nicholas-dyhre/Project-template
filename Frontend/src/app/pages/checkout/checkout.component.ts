import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BasketStateService } from '../../../services/basketStateService';
import { ApiClient, BasketItem, AddressDto, CheckoutRequest } from '../../api/generated-api-client';
import { PageLayout } from '../../components/page-layout/page-layout.component';
import { BasketItemComponent } from '../basket/basket-item.component';
import { Observable, combineLatest, BehaviorSubject, switchMap, shareReplay, map, take } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PageLayout, BasketItemComponent],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private apiClient = inject(ApiClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private basketStateService = inject(BasketStateService);
  private fb = inject(FormBuilder);

  basketId$ = this.basketStateService.basketId$;
  private refreshBasket$ = new BehaviorSubject<void>(undefined);

  basket$ = combineLatest([this.basketId$, this.refreshBasket$]).pipe(
    switchMap(([id]) => this.apiClient.basket_GetBasket(id)),
    shareReplay(1),
  );

  basketItems$: Observable<BasketItem[]> = this.basket$.pipe(
    map((basket) => basket.items ?? []),
  );

  checkoutForm = this.fb.group({
    shippingAddress: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
    }),
    useShippingAsBilling: [true],
    billingAddress: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      country: ['', Validators.required],
    }),
  });

  trackByBasketItem(index: number, item: BasketItem) {
    return item.id;
  }

  calculateTotal(items: BasketItem[]) {
    return items.reduce((sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1), 0);
  }

  submitCheckout() {
    console.log(this.checkoutForm.get("shippingAddress")?.value)
    console.log(this.checkoutForm.get("billingAddress")?.value)
    if (this.checkoutForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const shippingForm = this.checkoutForm.get('shippingAddress')!.getRawValue();

    const shipping = new AddressDto({
      street: shippingForm.street ?? '',
      city: shippingForm.city ?? '',
      state: shippingForm.state ?? '',
      zipCode: shippingForm.zipCode ?? '',
      country: shippingForm.country ?? '',
    });

    let billing: AddressDto;

    const useSameBilling = this.checkoutForm.get('useShippingAsBilling')!.value;

    if (useSameBilling) {
      billing = shipping;
    } else {
      const billingForm = this.checkoutForm.get('billingAddress')!.getRawValue();

      billing = new AddressDto({
        street: billingForm.street ?? '',
        city: billingForm.city ?? '',
        state: billingForm.state ?? '',
        zipCode: billingForm.zipCode ?? '',
        country: billingForm.country ?? '',
      });
    }

    this.authService.currentUser$.pipe(
      take(1),
      switchMap(userDto => {

        const checkoutRequest = new CheckoutRequest({
          shippingAddress: shipping,
          billingAddress: billing,
          identityUserId: userDto ? userDto.identityUserId : undefined   // string from identity
        });

        return this.basketStateService.checkoutBasket(checkoutRequest);
      })
    )
    .subscribe({
      next: () => { alert('Checkout successful!'); }, // TODO: this.router.navigate("/confirmation")
      error: (err) => alert('Checkout failed: ' + err),
    });
  }

  updateQuantity(productId: number, quantity: number) {
    this.basketStateService.updateQuantity(productId, quantity);
  }

  removeItem(basketItem?: BasketItem) {
    const productId: number | undefined = basketItem?.product.id;
    if(productId == null){
      alert("Product not found");
      return;
    }
    this.basketStateService.removeItem(productId);
  }
}
