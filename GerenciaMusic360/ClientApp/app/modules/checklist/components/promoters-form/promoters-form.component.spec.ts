import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotersFormComponent } from './promoters-form.component';

describe('PromotersFormComponent', () => {
  let component: PromotersFormComponent;
  let fixture: ComponentFixture<PromotersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotersFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
