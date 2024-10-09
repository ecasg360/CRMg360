import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksmanageComponent } from './worksmanage.component';

describe('WorksmanageComponent', () => {
  let component: WorksmanageComponent;
  let fixture: ComponentFixture<WorksmanageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksmanageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
