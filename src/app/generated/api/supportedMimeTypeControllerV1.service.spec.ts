import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  CreateSupportedMimeTypeRequestParams,
  DeleteSupportedMimeTypeIdRequestParams,
  GetSupportedMimeTypeByIdRequestParams,
  SupportedMimeTypeControllerV1APIService,
  UpdateSupportedMimeTypeByIdRequestParams,
} from './supportedMimeTypeControllerV1.service';
import { HttpParams } from '@angular/common/http';

describe('SupportedMimeTypeControllerV1APIService', () => {
  let service: SupportedMimeTypeControllerV1APIService;
  let httpParams: HttpParams;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(SupportedMimeTypeControllerV1APIService);
    httpParams = new HttpParams();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check response of getAllSupportedMimeTypes is defined', () => {
    const observe = 'body';
    const reportProgress = false;
    const serviceSpy = service.getAllSupportedMimeTypes(
      observe,
      reportProgress
    );
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of createSupportedMimeType is defined', () => {
    const value: CreateSupportedMimeTypeRequestParams = {
      supportedMimeTypeCreateUpdateDTO: {},
    };
    const serviceSpy = service.createSupportedMimeType(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of deleteSupportedMimeTypeId is defined', () => {
    const value: DeleteSupportedMimeTypeIdRequestParams = {
      id: '1',
    };
    const serviceSpy = service.deleteSupportedMimeTypeId(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of getSupportedMimeTypeById is defined', () => {
    const value: GetSupportedMimeTypeByIdRequestParams = {
      id: '1',
    };
    const serviceSpy = service.getSupportedMimeTypeById(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of updateSupportedMimeTypeById is defined', () => {
    const value: UpdateSupportedMimeTypeByIdRequestParams = {
      id: '1',
      supportedMimeTypeCreateUpdateDTO: {},
    };
    const serviceSpy = service.updateSupportedMimeTypeById(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should add value to HttpParams with key', () => {
    const httpParams = new HttpParams();
    const value = 'Value';
    const key = 'Key';
    const result = service['addToHttpParams'](httpParams, value, key);
    expect(result.get(key)).toBe(value);
  });

  it('should return the same HttpParams if value is null', () => {
    const result = service['addToHttpParamsRecursive'](httpParams, null);
    expect(result).toBe(httpParams);
  });

  it('should add a single key-value pair to HttpParams', () => {
    const key = 'param1';
    const value = 'value1';
    const result = service['addToHttpParamsRecursive'](httpParams, value, key);
    expect(result.get(key)).toBe(value);
  });

  it('should add date values to HttpParams', () => {
    const key = 'dateParam';
    const date = new Date();
    const result = service['addToHttpParamsRecursive'](httpParams, date, key);
    expect(result.get(key)).toBe(null);
  });

  it('should throw an error if key is null and value is not an object or array', () => {
    const value = 'someValue';
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, value)
    ).toThrowError('key may not be null if value is not object or array');
  });

  it('should throw an error if key is null and value is a date', () => {
    const date = new Date('2022-01-01');
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, date)
    ).toThrowError('key may not be null if value is Date');
  });
});
