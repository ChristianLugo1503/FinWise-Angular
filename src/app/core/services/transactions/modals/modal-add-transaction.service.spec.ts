import { TestBed } from '@angular/core/testing';

import { ModalAddTransactionService } from './modal-add-transaction.service';

describe('ModalAddTransactionService', () => {
  let service: ModalAddTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalAddTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
