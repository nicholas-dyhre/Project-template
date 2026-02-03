import { Routes } from '@angular/router';
import { HomePage } from './home/home-page';
import { DetailPage } from './detail/detail-page';
import { AboutPage } from './about/about-page';
import { ContactPage } from './contact/contact-page';
import { BasketPage } from './Basket/basket-page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'detail/:id', component: DetailPage },
  { path: 'about', component: AboutPage },
  { path: 'contact', component: ContactPage },
  { path: 'basket', component: BasketPage },
];
