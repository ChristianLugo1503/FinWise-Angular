import { TestBed } from '@angular/core/testing';

import { ModalUserSettingsService } from './modal-user-settings.service';

describe('ModalUserSettingsService', () => {
  let service: ModalUserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalUserSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
