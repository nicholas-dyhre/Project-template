import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-page-layout',
  imports: [Header, Footer],
  templateUrl: './page-layout.html',
})
export class PageLayout {
}