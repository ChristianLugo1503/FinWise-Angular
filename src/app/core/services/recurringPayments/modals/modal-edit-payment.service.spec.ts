import { TestBed } from '@angular/core/testing';

import { ModalEditPaymentService } from './modal-edit-payment.service';

describe('ModalEditPaymentService', () => {
  let service: ModalEditPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
