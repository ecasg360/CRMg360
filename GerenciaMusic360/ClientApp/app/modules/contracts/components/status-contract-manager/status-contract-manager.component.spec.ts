import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusContractManagerComponent } from './status-contract-manager.component';

describe('StatusContractManagerComponent', () => {
  let component: StatusContractManagerComponent;
  let fixture: ComponentFixture<StatusContractManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusContractManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusContractManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
