import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutProcess } from '../../app/about/about-process';

describe('AboutProcess', () => {
  let component: AboutProcess;
  let fixture: ComponentFixture<AboutProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutProcess],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutProcess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
