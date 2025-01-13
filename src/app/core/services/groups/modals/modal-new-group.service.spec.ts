import { TestBed } from '@angular/core/testing';

import { ModalNewGroupService } from './modal-new-group.service';

describe('ModalNewGroupService', () => {
  let service: ModalNewGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalNewGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
