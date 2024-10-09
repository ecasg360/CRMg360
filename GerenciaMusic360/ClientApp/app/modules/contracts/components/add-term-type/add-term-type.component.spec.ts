import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTermTypeComponent } from './add-term-type.component';

describe('AddTermTypeComponent', () => {
  let component: AddTermTypeComponent;
  let fixture: ComponentFixture<AddTermTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTermTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTermTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
