import { Component } from '@angular/core';
import { PageLayout } from '../components/page-layout/page-layout';
import { DetailProduct } from './detail-product';
import { DetailInfo } from './detail-info';

@Component({
  selector: 'app-detail',
  imports: [PageLayout, DetailProduct, DetailInfo],
  templateUrl: './detail.html',
})
export class Detail {

}
