import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
  let httpParams: HttpParams;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DocumentSpecificationControllerV1APIService);
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
    const result = service['addToHttpParams'](httpParams, 'Value', 'Key');
    expect(result.get('Key')).toBe('Value');
  });

  it('should return the same HttpParams if value is null', () => {
    const result = service['addToHttpParamsRecursive'](httpParams, null);
    expect(result).toBe(httpParams);
  });

  it('should add a single key-value pair to HttpParams', () => {
    const result = service['addToHttpParamsRecursive'](
      httpParams,
      'value1',
      'param1'
    );
    expect(result.get('param1')).toBe('value1');
  });

  it('should add date values to HttpParams', () => {
    const result = service['addToHttpParamsRecursive'](
      httpParams,
      new Date(),
      'dateParam'
    );
    expect(result.get('dateParam')).toBe(null);
  });

  it('should throw an error if key is null and value is not an object or array', () => {
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, 'someValue')
    ).toThrowError('key may not be null if value is not object or array');
  });

  it('should throw an error if key is null and value is a date', () => {
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, new Date('2022-01-01'))
    ).toThrowError('key may not be null if value is Date');
  });
});
