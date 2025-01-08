import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddPaymentComponent } from './modal-add-payment.component';

describe('ModalAddPaymentComponent', () => {
  let component: ModalAddPaymentComponent;
  let fixture: ComponentFixture<ModalAddPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAddPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAddPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
