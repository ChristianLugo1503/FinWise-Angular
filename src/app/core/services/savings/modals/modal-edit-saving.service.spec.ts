import { TestBed } from '@angular/core/testing';

import { ModalEditSavingService } from './modal-edit-saving.service';

describe('ModalEditSavingService', () => {
  let service: ModalEditSavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditSavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
