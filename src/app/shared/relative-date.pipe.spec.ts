// Core imports
import { TestBed } from '@angular/core/testing';
import { RelativeDatePipe } from './relative-date.pipe';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';

describe('RelativeDatePipe', () => {
  let pipe: RelativeDatePipe;
  let translateService: TranslateService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        RelativeDatePipe,
        { provide: TranslateService, useClass: TranslateServiceMock },
      ],
    });

    pipe = TestBed.inject(RelativeDatePipe);
    translateService = TestBed.inject(TranslateService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform date strings into relative time format', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const result = pipe.transform(fiveMinutesAgo.toISOString());
    expect(result).toBe('5 minutes ago');
  });

  it('should transform date objects into relative time format', () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const result = pipe.transform(fiveMinutesAgo);
    expect(result).toBe('5 minutes ago');
  });

  it('should return "just now" for very recent dates', () => {
    const now = new Date();
    const justNow = new Date(now.getTime() - 1000); // 1 second ago
    const result = pipe.transform(justNow);
    expect(result).toBe('just now');
  });
  it('should return "just now" for durations under 60 seconds', () => {
    const now = new Date();
    const justNow = new Date(now.getTime() - 1000 * 59); // 59 second ago
    const result = pipe.transform(justNow);
    expect(result).toBe('just now');
  });

  it('should handle dates in the past year correctly', () => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000); // Approx 6 months
    const result = pipe.transform(sixMonthsAgo);
    expect(result).toBe('6 months ago');
  });

  it('should handle dates in the past years correctly', () => {
    const now = new Date();
    const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000); // Approx 2 years
    const result = pipe.transform(twoYearsAgo);
    expect(result).toBe('2 years ago');
  });

  it('should return "1 hour ago" for exactly one hour ago', () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago
    const result = pipe.transform(oneHourAgo);
    expect(result).toBe('1 hour ago');
  });

  it('should handle invalid input gracefully', () => {
    const result = pipe.transform('invalid-date');
    expect(result).toBeUndefined();
  });

  it('should handle invalid input gracefully', () => {
    const result = pipe.transform(undefined);
    expect(result).toBeUndefined();
  });
});
