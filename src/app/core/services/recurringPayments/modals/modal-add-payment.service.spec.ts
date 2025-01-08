import { TestBed } from '@angular/core/testing';

import { ModalAddPaymentService } from './modal-add-payment.service';

describe('ModalAddPaymentService', () => {
  let service: ModalAddPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalAddPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
