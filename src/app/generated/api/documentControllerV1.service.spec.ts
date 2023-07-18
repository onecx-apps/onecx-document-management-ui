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

  function expectDocumentControllerResponseDefined(serviceSpy: any) {
    expect(serviceSpy).toBeDefined();
  }

  function expectDocumentControllerResponse(result: any, value: any) {
    expect(result).toBe(value);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check response of getAllChannels is defined', () => {
    expectDocumentControllerResponseDefined(
      service.getAllChannels('body', false)
    );
  });

  it('should check response of createDocument is defined', () => {
    const value: CreateDocumentRequestParams = {
      documentCreateUpdateDTO: {
        channel: {},
        typeId: '1',
      },
    };
    expectDocumentControllerResponseDefined(service.createDocument(value));
  });

  it('should check response of deleteDocumentById is defined', () => {
    const value: DeleteDocumentByIdRequestParams = { id: '1' };
    expectDocumentControllerResponseDefined(service.deleteDocumentById(value));
  });

  it('should check response of deleteFile is defined', () => {
    const values: DeleteFileRequestParams = {
      deletedAttachmentsIds: ['1', '2'],
    };
    expectDocumentControllerResponseDefined(service.deleteFile(values));
  });

  it('should check response of getDocumentByCriteria is defined', () => {
    const value: GetDocumentByCriteriaRequestParams = {
      id: '1',
    };
    expectDocumentControllerResponseDefined(
      service.getDocumentByCriteria(value)
    );
  });

  it('should check response of getDocumentById is defined', () => {
    const value: GetDocumentByIdRequestParams = {
      id: '1',
    };
    expectDocumentControllerResponseDefined(service.getDocumentById(value));
  });

  it('should check response of getFile is defined', () => {
    const value: GetFileRequestParams = {
      attachmentId: '1',
    };
    expectDocumentControllerResponseDefined(service.getFile(value));
  });

  it('should check response of updateDocument is defined', () => {
    const value: UpdateDocumentRequestParams = {
      id: '1',
    };
    expectDocumentControllerResponseDefined(service.updateDocument(value));
  });

  it('should check response of deleteBulkDocumentByIds is defined', () => {
    const value = ['1', '2'];
    expectDocumentControllerResponseDefined(
      service.deleteBulkDocumentByIds(value)
    );
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
    expectDocumentControllerResponseDefined(service.bulkUpdateDocument(value));
  });

  it('should add value to HttpParams with key', () => {
    expectDocumentControllerResponse(
      service['addToHttpParams'](new HttpParams(), 'Value', 'Key').get('Key'),
      'Value'
    );
  });

  it('should return the same HttpParams if value is null', () => {
    expectDocumentControllerResponse(
      service['addToHttpParamsRecursive'](httpParams, null),
      httpParams
    );
  });

  it('should add a single key-value pair to HttpParams', () => {
    expectDocumentControllerResponse(
      service['addToHttpParamsRecursive'](httpParams, 'value1', 'param1').get(
        'param1'
      ),
      'value1'
    );
  });

  it('should add date values to HttpParams', () => {
    expectDocumentControllerResponse(
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
      service['addToHttpParamsRecursive'](httpParams, 'someValue')
    ).toThrowError('key may not be null if value is not object or array');
  });

  it('should throw an error if key is null and value is a date', () => {
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, new Date('2022-01-01'))
    ).toThrowError('key may not be null if value is Date');
  });

  it('should use the provided basePath if configuration is not provided', () => {
    expectDocumentControllerResponse(
      new DocumentControllerV1APIService(httpClient, 'base-path', configuration)
        .configuration.basePath,
      'base-path'
    );
  });
});
