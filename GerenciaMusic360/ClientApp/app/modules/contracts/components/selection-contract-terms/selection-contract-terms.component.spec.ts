import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionContractTermsComponent } from './selection-contract-terms.component';

describe('SelectionContractTermsComponent', () => {
  let component: SelectionContractTermsComponent;
  let fixture: ComponentFixture<SelectionContractTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionContractTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionContractTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
