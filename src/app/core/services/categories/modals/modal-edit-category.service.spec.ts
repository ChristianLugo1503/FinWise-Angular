import { TestBed } from '@angular/core/testing';

import { ModalEditCategoryService } from './modal-edit-category.service';

describe('ModalEditCategoryService', () => {
  let service: ModalEditCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalEditCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
