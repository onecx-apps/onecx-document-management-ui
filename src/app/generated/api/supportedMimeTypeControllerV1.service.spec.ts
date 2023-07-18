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

  function expectSupportedMimeTypeResponseDefined(serviceSpy: any) {
    expect(serviceSpy).toBeDefined();
  }

  function expectSupportedMimeTypeResponse(result: any, value: any) {
    expect(result).toBe(value);
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check response of getAllSupportedMimeTypes is defined', () => {
    expectSupportedMimeTypeResponseDefined(
      service.getAllSupportedMimeTypes('body', false)
    );
  });

  it('should check response of createSupportedMimeType is defined', () => {
    const value: CreateSupportedMimeTypeRequestParams = {
      supportedMimeTypeCreateUpdateDTO: {},
    };
    expectSupportedMimeTypeResponseDefined(
      service.createSupportedMimeType(value)
    );
  });

  it('should check response of deleteSupportedMimeTypeId is defined', () => {
    const value: DeleteSupportedMimeTypeIdRequestParams = {
      id: '1',
    };
    expectSupportedMimeTypeResponseDefined(
      service.deleteSupportedMimeTypeId(value)
    );
  });

  it('should check response of getSupportedMimeTypeById is defined', () => {
    const value: GetSupportedMimeTypeByIdRequestParams = {
      id: '1',
    };
    expectSupportedMimeTypeResponseDefined(
      service.getSupportedMimeTypeById(value)
    );
  });

  it('should check response of updateSupportedMimeTypeById is defined', () => {
    const value: UpdateSupportedMimeTypeByIdRequestParams = {
      id: '1',
      supportedMimeTypeCreateUpdateDTO: {},
    };
    expectSupportedMimeTypeResponseDefined(
      service.updateSupportedMimeTypeById(value)
    );
  });

  it('should add value to HttpParams with key', () => {
    expectSupportedMimeTypeResponse(
      service['addToHttpParams'](new HttpParams(), 'Value', 'Key').get('Key'),
      'Value'
    );
  });

  it('should return the same HttpParams if value is null', () => {
    expectSupportedMimeTypeResponse(
      service['addToHttpParamsRecursive'](httpParams, null),
      httpParams
    );
  });

  it('should add a single key-value pair to HttpParams', () => {
    expectSupportedMimeTypeResponse(
      service['addToHttpParamsRecursive'](httpParams, 'value1', 'param1').get(
        'param1'
      ),
      'value1'
    );
  });

  it('should add date values to HttpParams', () => {
    expectSupportedMimeTypeResponse(
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
      service['addToHttpParamsRecursive'](httpParams, 'someValue1')
    ).toThrowError('key may not be null if value is not object or array');
  });

  it('should throw an error if key is null and value is a date', () => {
    expect(() =>
      service['addToHttpParamsRecursive'](httpParams, new Date('2022-01-02'))
    ).toThrowError('key may not be null if value is Date');
  });
});
