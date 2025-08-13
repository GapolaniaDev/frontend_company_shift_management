import { TestBed } from '@angular/core/testing';

import { ShiftStateService } from './shift-state.service';

describe('ShiftStateService', () => {
  let service: ShiftStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
