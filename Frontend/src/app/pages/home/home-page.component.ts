import { Component, inject, OnInit } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout.component';
import { HomeHero } from './home-hero.component';
import { HomeProducts } from './home-products.component';
import { HomeAbout } from './home-about.component';
import { ApiClient, IProduct } from '../../api/generated-api-client';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  imports: [PageLayout, HomeHero, HomeProducts, HomeAbout],
  templateUrl: './home-page.component.html',
})
export class HomePage implements OnInit {
  private apiClient = inject(ApiClient);
  products$!: Observable<IProduct[]>;

  ngOnInit() {
    this.products$ = this.apiClient.products_GetProducts();
  }
}
