import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageLayout } from '../../components/page-layout/page-layout.component';
import { DetailProduct } from './detail-product.component';
import { DetailInfo } from './detail-info.component';
import { ApiClient, Product } from '../../api/generated-api-client';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { BasketStateService } from '../../../services/basketStateService';

@Component({
  selector: 'app-detail-page',
  imports: [PageLayout, DetailProduct, DetailInfo],
  templateUrl: './detail-page.component.html',
})
export class DetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private apiClient = inject(ApiClient);
  product$!: Observable<Product>;

  private basketStateService = inject(BasketStateService);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.product$ = this.apiClient.products_GetProduct(id);
  }

  async addToCart(productId: number): Promise<void> {
    await firstValueFrom(
      this.basketStateService.basketId$.pipe(
        switchMap((id) => this.apiClient.basket_AddProductToBasket(id, productId)),
      ),
    );
    return void 0;
  }
}
