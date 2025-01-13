import { TestBed } from '@angular/core/testing';

import { GroupsMembersService } from './groups-members.service';

describe('GroupsMembersService', () => {
  let service: GroupsMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
