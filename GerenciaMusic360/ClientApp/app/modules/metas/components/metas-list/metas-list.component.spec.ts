import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasListComponent } from './metas-list.component';

describe('MetasListComponent', () => {
  let component: MetasListComponent;
  let fixture: ComponentFixture<MetasListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetasListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
