import { Component } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout';
import { ContactHero } from './contact-hero';
import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';
import { BusinessHours } from './business-hours';
import { SocialMedia } from './social-media';

@Component({
  selector: 'app-contact-page',
  imports: [PageLayout, ContactHero, ContactForm, ContactInfo, BusinessHours, SocialMedia],
  templateUrl: './contact-page.html',
})
export class ContactPage {

}
