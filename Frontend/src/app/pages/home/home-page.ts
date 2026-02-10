import { Component, OnInit } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout';
import { HomeHero } from './home-hero';
import { HomeProducts } from './home-products';
import { HomeAbout } from './home-about';
import { ApiClient, IProduct } from '../../api/generated-api-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [PageLayout, HomeHero, HomeProducts, HomeAbout],
  templateUrl: './home-page.html',
})
export class HomePage implements OnInit {
  products$!: Observable<IProduct[]>;

  constructor(private apiClient: ApiClient) {}

  ngOnInit() {
    this.products$ = this.apiClient.products_GetProducts();
  }
}
