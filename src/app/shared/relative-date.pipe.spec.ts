import { RelativeDatePipe } from './relative-date.pipe';

describe('RelativeDatePipe', () => {
  const value = [];
  const pipe = new RelativeDatePipe(value as any);

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should transform a string date to relative date', () => {
    const result = pipe.transform('2022-07-01');
    expect(result).toBe('1 year ago');
  });
  it('should transform an object date to relative date', () => {
    const date = new Date('2022-07-01');
    const result = pipe.transform(date);
    expect(result).toBe('1 year ago');
  });
});
