import { TestBed } from '@angular/core/testing';

import { ModalEditTransactionService } from './modal-edit-transaction.service';

describe('ModalEditTransactionService', () => {
  let service: ModalEditTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
