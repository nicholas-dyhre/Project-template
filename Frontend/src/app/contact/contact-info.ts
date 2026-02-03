import { Component } from '@angular/core';
import { InfoCard } from '../components/info-card/info-card';
import { IconEmail } from "../components/Icons/icon-email";
import { IconPhone } from '../components/Icons/icon-phone';
import { IconLocation } from '../components/Icons/icon-location';

@Component({
  selector: 'app-contact-info',
  imports: [InfoCard, IconEmail, IconPhone, IconLocation],
  templateUrl: './contact-info.html',
})
export class ContactInfo {

}