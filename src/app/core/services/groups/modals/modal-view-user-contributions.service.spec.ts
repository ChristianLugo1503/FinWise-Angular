import { TestBed } from '@angular/core/testing';

import { ModalViewUserContributionsService } from './modal-view-user-contributions.service';

describe('ModalViewUserContributionsService', () => {
  let service: ModalViewUserContributionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalViewUserContributionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
