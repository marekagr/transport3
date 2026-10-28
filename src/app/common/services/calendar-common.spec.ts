import { TestBed } from '@angular/core/testing';
import { CalendarCommon } from './calendar-common';

describe('CalendarCommon', () => {
  let service: CalendarCommon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarCommon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
