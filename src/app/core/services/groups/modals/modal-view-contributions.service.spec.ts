import { TestBed } from '@angular/core/testing';

import { ModalViewContributionsService } from './modal-view-contributions.service';

describe('ModalViewContributionsService', () => {
  let service: ModalViewContributionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalViewContributionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
