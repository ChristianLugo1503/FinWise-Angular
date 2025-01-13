import { TestBed } from '@angular/core/testing';

import { ModalOpenGroupService } from './modal-open-group.service';

describe('ModalOpenGroupService', () => {
  let service: ModalOpenGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalOpenGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
