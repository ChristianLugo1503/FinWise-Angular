import { TestBed } from '@angular/core/testing';

import { ModalOpenSavingService } from './modal-open-saving.service';

describe('ModalOpenSavingService', () => {
  let service: ModalOpenSavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalOpenSavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
