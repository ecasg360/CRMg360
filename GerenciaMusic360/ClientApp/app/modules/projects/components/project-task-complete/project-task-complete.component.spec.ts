import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTaskCompleteComponent } from './project-task-complete.component';

describe('ProjectTaskCompleteComponent', () => {
  let component: ProjectTaskCompleteComponent;
  let fixture: ComponentFixture<ProjectTaskCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectTaskCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTaskCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
