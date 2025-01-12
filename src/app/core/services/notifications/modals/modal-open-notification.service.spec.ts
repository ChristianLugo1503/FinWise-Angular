import { TestBed } from '@angular/core/testing';

import { ModalOpenNotificationService } from './modal-open-notification.service';

describe('ModalOpenNotificationService', () => {
  let service: ModalOpenNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalOpenNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
