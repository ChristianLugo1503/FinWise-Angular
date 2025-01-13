import { TestBed } from '@angular/core/testing';

import { ModalEditGroupService } from './modal-edit-group.service';

describe('ModalEditGroupService', () => {
  let service: ModalEditGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
