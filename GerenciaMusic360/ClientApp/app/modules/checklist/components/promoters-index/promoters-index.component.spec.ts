import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotersIndexComponent } from './promoters-index.component';

describe('PromotersIndexComponent', () => {
  let component: PromotersIndexComponent;
  let fixture: ComponentFixture<PromotersIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotersIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotersIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
