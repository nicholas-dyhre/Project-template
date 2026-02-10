import { Component } from '@angular/core';
import { PageLayout } from '../../components/page-layout/page-layout';
import { AboutHero } from './about-hero';
import { AboutStory } from './about-story';
import { AboutValues } from './about-values';
import { AboutProcess } from './about-process';

@Component({
  selector: 'app-about-page',
  imports: [PageLayout, AboutHero, AboutStory, AboutValues, AboutProcess],
  templateUrl: './about-page.html',
})
export class AboutPage {

}
