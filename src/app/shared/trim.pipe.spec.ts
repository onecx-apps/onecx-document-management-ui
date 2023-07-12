import { TrimPipe } from './trim.pipe';

describe('TrimPipe', () => {
  const pipe = new TrimPipe();
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should check value after transform is ...', () => {
    const value = 'Test';
    const args = 0;
    const result = pipe.transform(value, args);
    expect(result).toBe('...');
  });

  it('should check value after transform is T', () => {
    const value = 'T';
    const args = 2;
    const result = pipe.transform(value, args);
    expect(result).toBe('T');
  });
});
