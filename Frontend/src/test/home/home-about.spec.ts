import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAbout } from '../../app/home/home-about';

describe('HomeAbout', () => {
  let component: HomeAbout;
  let fixture: ComponentFixture<HomeAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAbout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeAbout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});