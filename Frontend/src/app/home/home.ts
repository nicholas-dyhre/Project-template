import { Component } from '@angular/core';
import { PageLayout } from '../components/page-layout/page-layout';
import { HomeHero } from './home-hero';
import { HomeProducts } from './home-products';
import { HomeAbout } from './home-about';

@Component({
  selector: 'app-home',
  imports: [PageLayout, HomeHero, HomeProducts, HomeAbout],
  templateUrl: './home.html',
})
export class Home {

}
