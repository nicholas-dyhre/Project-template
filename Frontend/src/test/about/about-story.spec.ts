import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutStory } from '../../app/about/about-story';

describe('AboutStory', () => {
  let component: AboutStory;
  let fixture: ComponentFixture<AboutStory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutStory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutStory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});