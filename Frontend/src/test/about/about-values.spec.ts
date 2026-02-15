import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutValues } from '../../app/about/about-values';

describe('AboutValues', () => {
  let component: AboutValues;
  let fixture: ComponentFixture<AboutValues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutValues],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutValues);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
