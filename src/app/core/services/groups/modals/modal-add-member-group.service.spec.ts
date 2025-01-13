import { TestBed } from '@angular/core/testing';

import { ModalAddMemberGroupService } from './modal-add-member-group.service';

describe('ModalAddMemberGroupService', () => {
  let service: ModalAddMemberGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalAddMemberGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
