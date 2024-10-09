import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkAdminComponent } from './add-work-admin.component';

describe('AddWorkAdminComponent', () => {
  let component: AddWorkAdminComponent;
  let fixture: ComponentFixture<AddWorkAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
