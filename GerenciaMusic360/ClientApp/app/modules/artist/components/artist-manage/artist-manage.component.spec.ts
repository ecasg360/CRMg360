import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistManageComponent } from './artist-manage.component';

describe('ArtistManageComponent', () => {
  let component: ArtistManageComponent;
  let fixture: ComponentFixture<ArtistManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
