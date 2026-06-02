import { computed, inject, Injectable, signal } from '@angular/core';
import { ApiClient, IProduct, Product } from '../app/api/generated-api-client';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiClient = inject(ApiClient);

  private productsSignal = signal<IProduct[] | null>(null);

  readonly products = this.productsSignal.asReadonly();
  readonly productsCount = computed(() => this.productsSignal()?.length ?? 0);

  async loadAll(): Promise<IProduct[]> {
    const prods = await firstValueFrom(this.apiClient.products_GetProducts());
    this.productsSignal.set(prods ?? []);
    return prods ?? [];
  }

  async getProduct(id: number): Promise<Product> {
    const current = this.productsSignal();
    if (current) {
      const found = current.find((p) => p.id === id);
      if (found) return found as Product;
    }

    const prod = await firstValueFrom(this.apiClient.products_GetProduct(id));

    // merge into products signal for caching
    const arr = this.productsSignal() ?? [];
    this.productsSignal.set([...arr, prod]);

    return prod;
  }

  async refresh(): Promise<IProduct[]> {
    return this.loadAll();
  }
}
