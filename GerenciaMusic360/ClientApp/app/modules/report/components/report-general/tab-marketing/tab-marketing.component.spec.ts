import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMarketingComponent } from './tab-marketing.component';

describe('TabMarketingComponent', () => {
  let component: TabMarketingComponent;
  let fixture: ComponentFixture<TabMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
