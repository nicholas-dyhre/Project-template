import { Component } from '@angular/core';
import { InfoCard } from '../../components/info-card/info-card.component';
import { IconEmail } from '../../components/Icons/icon-email.component';
import { IconPhone } from '../../components/Icons/icon-phone.component';
import { IconLocation } from '../../components/Icons/icon-location.component';

@Component({
  selector: 'app-contact-info',
  imports: [InfoCard, IconEmail, IconPhone, IconLocation],
  templateUrl: './contact-info.component.html',
})
export class ContactInfo {}
