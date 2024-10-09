import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorksmanageComponent } from './add-worksmanage.component';

describe('AddWorksmanageComponent', () => {
  let component: AddWorksmanageComponent;
  let fixture: ComponentFixture<AddWorksmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorksmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorksmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
