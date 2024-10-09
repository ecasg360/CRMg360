import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotersViewComponent } from './promoters-view.component';

describe('PromotersViewComponent', () => {
  let component: PromotersViewComponent;
  let fixture: ComponentFixture<PromotersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
