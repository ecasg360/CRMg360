import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsMarkersTemplatesComponent } from './contracts-markers-templates.component';

describe('ContractsMarkersTemplatesComponent', () => {
  let component: ContractsMarkersTemplatesComponent;
  let fixture: ComponentFixture<ContractsMarkersTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsMarkersTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsMarkersTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
