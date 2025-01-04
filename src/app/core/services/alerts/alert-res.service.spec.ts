import { TestBed } from '@angular/core/testing';

import { AlertRESService } from './alert-res.service';

describe('AlertRESService', () => {
  let service: AlertRESService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertRESService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
