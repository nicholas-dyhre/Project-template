import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IProduct } from '../../api/generated-api-client';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home-products',
  templateUrl: './home-products.html',
  imports: [RouterModule, CommonModule]
})
export class HomeProducts {
  products$ = input<Observable<IProduct[]>>();
}