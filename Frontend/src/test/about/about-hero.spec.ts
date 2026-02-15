import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHero } from '../../app/about/about-hero';

describe('AboutHero', () => {
  let component: AboutHero;
  let fixture: ComponentFixture<AboutHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutHero],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutHero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
