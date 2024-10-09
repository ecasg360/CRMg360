import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasReplyComponent } from './metas-reply.component';

describe('MetasReplyComponent', () => {
  let component: MetasReplyComponent;
  let fixture: ComponentFixture<MetasReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetasReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetasReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
