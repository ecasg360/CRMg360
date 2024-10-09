import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStatusContractComponent } from './add-status-contract.component';

describe('AddStatusContractComponent', () => {
  let component: AddStatusContractComponent;
  let fixture: ComponentFixture<AddStatusContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStatusContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStatusContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
