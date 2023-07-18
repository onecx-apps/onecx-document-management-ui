import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpParams } from '@angular/common/http';
import {
  CreateDocumentTypeRequestParams,
  DeleteDocumentTypeByIdRequestParams,
  DocumentTypeControllerV1APIService,
  GetDocumentTypeByIdRequestParams,
  UpdateDocumentTypeByIdRequestParams,
} from './documentTypeControllerV1.service';

describe('DocumentTypeControllerV1APIService', () => {
  let service: DocumentTypeControllerV1APIService;
  let httpParams: HttpParams;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DocumentTypeControllerV1APIService);
    httpParams = new HttpParams();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  function expectResponseDefined(serviceSpy: any) {
    expect(serviceSpy).toBeDefined();
  }

  it('should check response of getAllTypesOfDocument is defined', () => {
    expectResponseDefined(service.getAllTypesOfDocument('body', false));
  });

  it('should check response of createDocumentType is defined', () => {
    const value: CreateDocumentTypeRequestParams = {
      documentTypeCreateUpdateDTO: {},
    };
    expectResponseDefined(service.createDocumentType(value));
  });

  it('should check response of deleteDocumentTypeById is defined', () => {
    const value: DeleteDocumentTypeByIdRequestParams = {
      id: '1',
    };
    expectResponseDefined(service.deleteDocumentTypeById(value));
  });

  it('should check response of getDocumentTypeById is defined', () => {
    const value: GetDocumentTypeByIdRequestParams = {
      id: '1',
    };
    expectResponseDefined(service.getDocumentTypeById(value));
  });

  it('should check response of updateDocumentTypeById is defined', () => {
    const value: UpdateDocumentTypeByIdRequestParams = {
      id: '1',
      documentTypeCreateUpdateDTO: {},
    };
    expectResponseDefined(service.updateDocumentTypeById(value));
  });

  it('should add value to HttpParams with key', () => {
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
