import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasAddComponent } from './metas-add.component';

describe('MetasAddComponent', () => {
  let component: MetasAddComponent;
  let fixture: ComponentFixture<MetasAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetasAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetasAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
