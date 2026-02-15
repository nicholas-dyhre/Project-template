import { Component } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout.component';
import { AboutHero } from './about-hero.component';
import { AboutStory } from './about-story.component';
import { AboutValues } from './about-values.component';
import { AboutProcess } from './about-process.component';

@Component({
  selector: 'app-about-page',
  imports: [PageLayout, AboutHero, AboutStory, AboutValues, AboutProcess],
  templateUrl: './about-page.component.html',
})
export class AboutPage {}
