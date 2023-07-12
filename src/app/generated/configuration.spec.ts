import { TestBed } from '@angular/core/testing';
import { Configuration } from '../generated/configuration';

describe('Configuration', () => {
  let instance: Configuration;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Configuration],
    });
    TestBed.configureTestingModule({});
    instance = TestBed.inject(Configuration);
  });

  it('should return undefined when contentTypes array is empty', () => {
    const contentTypes: string[] = [];
    const result = instance.selectHeaderContentType(contentTypes);
    expect(result).toBeUndefined();
  });

  it('should return the first content type when no JSON content type is found', () => {
    const contentTypes: string[] = ['text/plain', 'application/xml'];
    const result = instance.selectHeaderContentType(contentTypes);
    expect(result).toBe('text/plain');
  });

  it('should return the JSON content type when found', () => {
    const contentTypes: string[] = ['text/plain', 'application/json'];
    const result = instance.selectHeaderContentType(contentTypes);
    expect(result).toBe('application/json');
  });

  it('should return undefined when accepts array is empty', () => {
    const accepts: string[] = [];
    const result = instance.selectHeaderAccept(accepts);
    expect(result).toBeUndefined();
  });

  it('should return the first accept type when no JSON accept type is found', () => {
    const accepts: string[] = ['text/plain', 'application/xml'];
    const result = instance.selectHeaderAccept(accepts);
    expect(result).toBe('text/plain');
  });

  it('should return the JSON accept type when found', () => {
    const accepts: string[] = ['text/plain', 'application/json'];
    const result = instance.selectHeaderAccept(accepts);
    expect(result).toBe('application/json');
  });
});
