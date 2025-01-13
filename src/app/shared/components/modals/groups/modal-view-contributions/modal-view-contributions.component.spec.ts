import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalViewContributionsComponent } from './modal-view-contributions.component';

describe('ModalViewContributionsComponent', () => {
  let component: ModalViewContributionsComponent;
  let fixture: ComponentFixture<ModalViewContributionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalViewContributionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalViewContributionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
