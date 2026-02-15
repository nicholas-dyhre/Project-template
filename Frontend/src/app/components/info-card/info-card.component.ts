import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info-card',
  imports: [],
  templateUrl: './info-card.component.html',
})
export class InfoCard {
  @Input() title = '';
  @Input() customClass = '';
  @Input() spacing = 'mb-8';
}
