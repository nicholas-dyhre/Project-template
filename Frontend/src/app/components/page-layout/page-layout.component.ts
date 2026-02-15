import { Component } from '@angular/core';
import { Header } from '../header/header.component';
import { Footer } from '../footer/footer.component';

@Component({
  selector: 'app-page-layout',
  imports: [Header, Footer],
  templateUrl: './page-layout.component.html',
})
export class PageLayout {}
