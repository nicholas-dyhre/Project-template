import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../api/generated-api-client';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.html',
  imports: [RouterLink, CommonModule]
})
export class DetailProduct {
  product$ = input<Observable<Product>>();
}