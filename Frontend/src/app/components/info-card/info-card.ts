import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.html',
})
export class InfoCard {
  @Input() title: string = '';
  @Input() customClass: string = '';
  @Input() spacing: string = 'mb-8';
}
