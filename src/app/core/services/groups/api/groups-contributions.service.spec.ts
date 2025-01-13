import { TestBed } from '@angular/core/testing';

import { GroupsContributionsService } from './groups-contributions.service';

describe('GroupsContributionsService', () => {
  let service: GroupsContributionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupsContributionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
