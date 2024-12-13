import { TestBed } from '@angular/core/testing';

import { ModalNewCategoryService } from './modal-new-category.service';

describe('ModalNewCategoryService', () => {
  let service: ModalNewCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalNewCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
