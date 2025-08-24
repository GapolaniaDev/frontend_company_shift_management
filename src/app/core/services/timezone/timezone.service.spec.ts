import {TestBed} from '@angular/core/testing';
import {TimezoneService} from "@core/services/timezone/timezone.service";

describe('TimezoneService', () => {
  let service: TimezoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimezoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
