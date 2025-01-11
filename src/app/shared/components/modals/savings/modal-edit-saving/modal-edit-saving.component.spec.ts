import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditSavingComponent } from './modal-edit-saving.component';

describe('ModalEditSavingComponent', () => {
  let component: ModalEditSavingComponent;
  let fixture: ComponentFixture<ModalEditSavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditSavingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
