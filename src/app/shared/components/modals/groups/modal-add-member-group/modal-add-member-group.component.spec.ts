import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddMemberGroupComponent } from './modal-add-member-group.component';

describe('ModalAddMemberGroupComponent', () => {
  let component: ModalAddMemberGroupComponent;
  let fixture: ComponentFixture<ModalAddMemberGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddMemberGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddMemberGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
