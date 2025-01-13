import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewUserContributionsComponent } from './modal-view-user-contributions.component';

describe('ModalViewUserContributionsComponent', () => {
  let component: ModalViewUserContributionsComponent;
  let fixture: ComponentFixture<ModalViewUserContributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalViewUserContributionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalViewUserContributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
