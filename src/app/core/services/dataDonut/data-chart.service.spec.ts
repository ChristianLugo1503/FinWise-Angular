import { TestBed } from '@angular/core/testing';
import { DataDonutService } from './data-donut.service';


describe('DataChartService', () => {
  let service: DataDonutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataDonutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
