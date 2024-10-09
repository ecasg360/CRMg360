import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingPlanCompleteComponent } from './marketing-plan-complete.component';

describe('MarketingPlanCompleteComponent', () => {
  let component: MarketingPlanCompleteComponent;
  let fixture: ComponentFixture<MarketingPlanCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingPlanCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingPlanCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

