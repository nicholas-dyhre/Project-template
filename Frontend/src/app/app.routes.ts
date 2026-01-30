import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Detail } from './detail/detail';
import { About } from './about/about';
import { Contact } from './contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'detail/:id', component: Detail },
  { path: 'about', component: About },
  { path: 'contact', component: Contact },
];
