import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  BulkUpdateDocumentRequestParams,
  CreateDocumentRequestParams,
  DeleteDocumentByIdRequestParams,
  DeleteFileRequestParams,
  DocumentControllerV1APIService,
  GetDocumentByCriteriaRequestParams,
  GetDocumentByIdRequestParams,
  GetFileRequestParams,
  UpdateDocumentRequestParams,
} from './documentControllerV1.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Configuration } from '../configuration';
describe('DocumentTypeControllerV1APIService', () => {
  let service: DocumentControllerV1APIService;

  let httpParams: HttpParams;
  let httpClient: HttpClient;
  let configuration: Configuration;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DocumentControllerV1APIService,
        HttpClient,
        {
          provide: Configuration,
          useValue: {
            basePath: 'base-path',
            selectHeaderContentType: () => 'application/json',
            selectHeaderAccept: () => 'application/json',
            isJsonMime: (mime: string) => mime.includes('json'),
          },
        },
      ],
    });
    service = TestBed.inject(DocumentControllerV1APIService);
    httpParams = new HttpParams();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check response of getAllChannels is defined', () => {
    const observe = 'body';
    const reportProgress = false;
    const serviceSpy = service.getAllChannels(observe, reportProgress);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of createDocument is defined', () => {
    const value: CreateDocumentRequestParams = {
      documentCreateUpdateDTO: {
        channel: {},
        typeId: '1',
      },
    };
    const serviceSpy = service.createDocument(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of deleteDocumentById is defined', () => {
    const value: DeleteDocumentByIdRequestParams = { id: '1' };
    const serviceSpy = service.deleteDocumentById(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of deleteFile is defined', () => {
    const values: DeleteFileRequestParams = {
      deletedAttachmentsIds: ['1', '2'],
    };
    const serviceSpy = service.deleteFile(values);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of getDocumentByCriteria is defined', () => {
    const value: GetDocumentByCriteriaRequestParams = {
      id: '1',
    };
    const serviceSpy = service.getDocumentByCriteria(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of getDocumentById is defined', () => {
    const value: GetDocumentByIdRequestParams = {
      id: '1',
    };
    const serviceSpy = service.getDocumentById(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of getFile is defined', () => {
    const value: GetFileRequestParams = {
      attachmentId: '1',
    };
    const serviceSpy = service.getFile(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of updateDocument is defined', () => {
    const value: UpdateDocumentRequestParams = {
      id: '1',
    };
    const serviceSpy = service.updateDocument(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of deleteBulkDocumentByIds is defined', () => {
    const value = ['1', '2'];
    const serviceSpy = service.deleteBulkDocumentByIds(value);
    expect(serviceSpy).toBeDefined();
  });

  it('should check response of bulkUpdateDocument is defined', () => {
    const value: BulkUpdateDocumentRequestParams = {
      bulkDocumentCreateUpdateDTO: [
        {
          channel: {},
          typeId: '1',
        },
      ],
    };
    const serviceSpy = service.bulkUpdateDocument(value);
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

  it('should use the provided basePath if configuration is not provided', () => {
    const basePath = 'base-path';
    const service: DocumentControllerV1APIService =
      new DocumentControllerV1APIService(httpClient, basePath, configuration);
    expect(service.configuration.basePath).toBe(basePath);
  });
});
