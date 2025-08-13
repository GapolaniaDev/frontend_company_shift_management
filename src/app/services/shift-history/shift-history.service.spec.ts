import { TestBed } from '@angular/core/testing';
import { ShiftHistoryService } from './shift-history.service';

describe('ShiftHistoryService', () => {
  let service: ShiftHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
