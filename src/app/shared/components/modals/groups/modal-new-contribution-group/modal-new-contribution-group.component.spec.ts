import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewContributionGroupComponent } from './modal-new-contribution-group.component';

describe('ModalNewContributionGroupComponent', () => {
  let component: ModalNewContributionGroupComponent;
  let fixture: ComponentFixture<ModalNewContributionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalNewContributionGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNewContributionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
