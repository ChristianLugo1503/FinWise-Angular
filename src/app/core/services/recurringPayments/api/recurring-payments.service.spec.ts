import { TestBed } from '@angular/core/testing';

import { RecurringPaymentsService } from './recurring-payments.service';

describe('RecurringPaymentsService', () => {
  let service: RecurringPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecurringPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
