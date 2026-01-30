import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageLayout } from '../components/page-layout/page-layout';
import { DetailProduct } from './detail-product';
import { DetailInfo } from './detail-info';
import { ApiClient, IProduct, Product } from '../api/generated-api-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detail',
  imports: [PageLayout, DetailProduct, DetailInfo],
  templateUrl: './detail.html',
})
export class Detail implements OnInit {
  product$!: Observable<Product>;

  constructor(
    private route: ActivatedRoute,
    private apiClient: ApiClient
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.product$ = this.apiClient.products_GetProduct(id);
  }
}
