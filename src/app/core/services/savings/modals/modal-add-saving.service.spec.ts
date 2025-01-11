import { TestBed } from '@angular/core/testing';

import { ModalAddSavingService } from './modal-add-saving.service';

describe('ModalAddSavingService', () => {
  let service: ModalAddSavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalAddSavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
