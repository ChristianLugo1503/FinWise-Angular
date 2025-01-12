import { TestBed } from '@angular/core/testing';

import { ModalAbonoSavingService } from './modal-abono-saving.service';

describe('ModalAbonoSavingService', () => {
  let service: ModalAbonoSavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalAbonoSavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
