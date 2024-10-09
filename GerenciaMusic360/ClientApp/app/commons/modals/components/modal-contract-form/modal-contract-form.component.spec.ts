import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContractFormComponent } from './modal-contract-form.component';

describe('ModalContractFormComponent', () => {
  let component: ModalContractFormComponent;
  let fixture: ComponentFixture<ModalContractFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContractFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContractFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
