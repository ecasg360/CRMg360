import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLabelCopyModalComponent } from './project-label-copy-modal.component';

describe('ProjectLabelCopyModalComponent', () => {
  let component: ProjectLabelCopyModalComponent;
  let fixture: ComponentFixture<ProjectLabelCopyModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectLabelCopyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLabelCopyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
