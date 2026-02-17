import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home-page.component';
import { DetailPage } from './pages/detail/detail-page.component';
import { AboutPage } from './pages/about/about-page.component';
import { ContactPage } from './pages/contact/contact-page.component';
import { BasketPage } from './pages/basket/basket-page.component';
import { authGuard, guestGuard } from '../services/auth/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'detail/:id', component: DetailPage },
  { path: 'about', component: AboutPage },
  { path: 'contact', component: ContactPage },
  { path: 'basket', component: BasketPage },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/account/account.component').then((m) => m.AccountComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent),
  },
  {
    path: 'checkout',
    // canActivate: [guestGuard, authGuard],
    loadComponent: () => import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent)
  }
];
