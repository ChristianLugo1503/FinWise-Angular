import { TestBed } from '@angular/core/testing';

import { ModalNewContributionGroupService } from './modal-new-contribution-group.service';

describe('ModalNewContributionGroupService', () => {
  let service: ModalNewContributionGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalNewContributionGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
