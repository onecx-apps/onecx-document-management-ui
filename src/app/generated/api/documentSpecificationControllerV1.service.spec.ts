import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  CreateDocumentSpecificationRequestParams,
  DeleteDocumentSpecificationByIdRequestParams,
  DocumentSpecificationControllerV1APIService,
  GetDocumentSpecificationByIdRequestParams,
  UpdateDocumentSpecificationByIdRequestParams,
} from './documentSpecificationControllerV1.service';
import { HttpParams } from '@angular/common/http';

describe('DocumentSpecificationControllerV1APIService', () => {
  let service: DocumentSpecificationControllerV1APIService;
  let httpTestingController: HttpTestingController;
  let httpParams: HttpParams;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DocumentSpecificationControllerV1APIService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpParams = new HttpParams();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check response of getAllDocumentSpecifications is defined', () => {
    const observe = 'body';
    const reportProgress = false;
    const serviceSpy = service.getAllDocumentSpecifications(
      observe,
      reportProgress
    );
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of createDocumentSpecification is defined', () => {
    const value: CreateDocumentSpecificationRequestParams = {
      documentSpecificationCreateUpdateDTO: {},
    };
    const serviceSpy = service.createDocumentSpecification(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of deleteDocumentSpecificationById is defined', () => {
    const value: DeleteDocumentSpecificationByIdRequestParams = { id: '1' };
    const serviceSpy = service.deleteDocumentSpecificationById(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of getDocumentSpecificationById is defined', () => {
    const value: GetDocumentSpecificationByIdRequestParams = { id: '1' };
    const serviceSpy = service.getDocumentSpecificationById(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of updateDocumentSpecificationById is defined', () => {
    const value: UpdateDocumentSpecificationByIdRequestParams = {
      id: '1',
      documentSpecificationCreateUpdateDTO: {},
    };
    const serviceSpy = service.updateDocumentSpecificationById(value);
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

  it('should add array values to HttpParams', () => {
    const key = 'param';
    const values = ['value1', 'value2', 'value3'];
    const result = service['addToHttpParamsRecursive'](httpParams, values, key);
    expect(result.getAll(key)).toEqual(values);
  });

  it('should add date values to HttpParams', () => {
    const key = 'dateParam';
    const date = new Date('2022-01-01');
    const result = service['addToHttpParamsRecursive'](httpParams, date, key);
    expect(result.get(key)).toBe('2022-01-01');
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
