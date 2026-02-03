import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageLayout } from '../components/page-layout/page-layout';
import { DetailProduct } from './detail-product';
import { DetailInfo } from './detail-info';
import { ApiClient, IProduct, Product } from '../api/generated-api-client';
import { Observable, switchMap } from 'rxjs';
import { BasketStateService } from '../../services/BasketStateService';

@Component({
  selector: 'app-detail-page',
  imports: [PageLayout, DetailProduct, DetailInfo],
  templateUrl: './detail-page.html',
})
export class DetailPage implements OnInit {
  product$!: Observable<Product>;

  private basketStateService = inject(BasketStateService);

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.product$ = this.apiClient.products_GetProduct(id);
  }

  addToCart(productId: number) {
    console.log("add To basket");
    this.basketStateService.basketId$.pipe(
      switchMap(id => this.apiClient.basket_AddProductToBasket(id, productId))
    ).subscribe();
  }
}
