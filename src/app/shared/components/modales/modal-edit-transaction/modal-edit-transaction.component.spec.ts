import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditTransactionComponent } from './modal-edit-transaction.component';

describe('ModalEditTransactionComponent', () => {
  let component: ModalEditTransactionComponent;
  let fixture: ComponentFixture<ModalEditTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
