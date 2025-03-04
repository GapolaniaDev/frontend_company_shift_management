import { TestBed } from '@angular/core/testing';

import { ShiftConfigurationService } from './shift-configuration.service';

describe('ShiftConfigurationService', () => {
  let service: ShiftConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
