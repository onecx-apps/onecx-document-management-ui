import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  CreateDocumentTypeRequestParams,
  DeleteDocumentTypeByIdRequestParams,
  DocumentTypeControllerV1APIService,
  GetDocumentTypeByIdRequestParams,
  UpdateDocumentTypeByIdRequestParams,
} from './documentTypeControllerV1.service';
import { HttpParams } from '@angular/common/http';

describe('DocumentTypeControllerV1APIService', () => {
  let service: DocumentTypeControllerV1APIService;
  let httpParams: HttpParams;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(DocumentTypeControllerV1APIService);
    httpParams = new HttpParams();
  });

  function expectDocumentTypeResponseDefined(serviceSpy: any) {
    expect(serviceSpy).toBeDefined();
  }

  function expectDocumentTypeResponse(result: any, value: any) {
    expect(result).toBe(value);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check response of getAllTypesOfDocument is defined', () => {
    expectDocumentTypeResponseDefined(
      service.getAllTypesOfDocument('body', false)
    );
  });

  it('should check response of createDocumentType is defined', () => {
    const value: CreateDocumentTypeRequestParams = {
      documentTypeCreateUpdateDTO: {},
    };
    expectDocumentTypeResponseDefined(service.createDocumentType(value));
  });

  it('should check response of deleteDocumentTypeById is defined', () => {
    const value: DeleteDocumentTypeByIdRequestParams = { id: '1' };
    expectDocumentTypeResponseDefined(service.deleteDocumentTypeById(value));
  });

  it('should check response of getDocumentTypeById is defined', () => {
    const value: GetDocumentTypeByIdRequestParams = { id: '1' };
    expectDocumentTypeResponseDefined(service.getDocumentTypeById(value));
  });

  it('should check response of updateDocumentTypeById is defined', () => {
    const value: UpdateDocumentTypeByIdRequestParams = {
      id: '1',
      documentTypeCreateUpdateDTO: {},
    };
    expectDocumentTypeResponseDefined(service.updateDocumentTypeById(value));
  });

  it('should add value to HttpParams with key', () => {
    const httpParams = new HttpParams();
    const value = 'Value';
    const key = 'Key';
    const result = service['addToHttpParams'](httpParams, value, key);
    expect(result.get(key)).toBe(value);

    expectDocumentTypeResponse(
      service['addToHttpParams'](new HttpParams(), 'Value', 'Key').get('Key'),
      'Value'
    );
  });

  it('should return the same HttpParams if value is null', () => {
    expectDocumentTypeResponse(
      service['addToHttpParamsRecursive'](httpParams, null),
      httpParams
    );
  });

  it('should add a single key-value pair to HttpParams', () => {
    expectDocumentTypeResponse(
      service['addToHttpParamsRecursive'](httpParams, 'value1', 'param1').get(
        'param1'
      ),
      'value1'
    );
  });

  it('should add date values to HttpParams', () => {
    expectDocumentTypeResponse(
      service['addToHttpParamsRecursive'](
        httpParams,
        new Date(),
        'dateParam'
      ).get('dateParam'),
      null
    );
  });

  it('should throw an error if key is null and value is not an object or array', () => {
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, 'someValue2')
    ).toThrowError('key may not be null if value is not object or array');
  });

  it('should throw an error if key is null and value is a date', () => {
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, new Date('2022-01-03'))
    ).toThrowError('key may not be null if value is Date');
  });
});
