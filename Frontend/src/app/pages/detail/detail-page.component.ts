import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageLayout } from '../../components/page-layout/page-layout.component';
import { DetailProduct } from './detail-product.component';
import { DetailInfo } from './detail-info.component';
import { Product } from '../../api/generated-api-client';
import { BasketStateService } from '../../../services/basketStateService';
import { ProductsService } from '../../../services/products.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-detail-page',
  imports: [PageLayout, DetailProduct, DetailInfo],
  templateUrl: './detail-page.component.html',
})
export class DetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  product = signal<Product | null>(null);

  private basketStateService = inject(BasketStateService);

  async ngOnInit() {
    const id = Number(this.route.snapshot.params['id']);
    const p = await this.productsService.getProduct(id);
    this.product.set(p);
  }

  async addToCart(productId: number): Promise<void> {
    await this.basketStateService.addItem(productId);
    return void 0;
  }
}
