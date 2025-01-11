import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddSavingComponent } from './modal-add-saving.component';

describe('ModalAddSavingComponent', () => {
  let component: ModalAddSavingComponent;
  let fixture: ComponentFixture<ModalAddSavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddSavingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
