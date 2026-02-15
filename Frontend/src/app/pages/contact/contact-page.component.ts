import { Component } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout.component';
import { ContactHero } from './contact-hero.component';
import { ContactForm } from './contact-form.component';
import { ContactInfo } from './contact-info.component';
import { BusinessHours } from './business-hours.component';
import { SocialMedia } from './social-media.component';

@Component({
  selector: 'app-contact-page',
  imports: [PageLayout, ContactHero, ContactForm, ContactInfo, BusinessHours, SocialMedia],
  templateUrl: './contact-page.component.html',
})
export class ContactPage {}
