import { TestBed } from '@angular/core/testing';
import { ModalSpecsCategoriesService } from './modal-specs-categories.service';


describe('ModalSpecsCategoriesService', () => {
  let service: ModalSpecsCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalSpecsCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
