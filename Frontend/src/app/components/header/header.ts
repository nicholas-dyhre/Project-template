import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconBasket } from '../Icons/icon-basket';

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconBasket],
  templateUrl: './header.html',
})
export class Header {

}
