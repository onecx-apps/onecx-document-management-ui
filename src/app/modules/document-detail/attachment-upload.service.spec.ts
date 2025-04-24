import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AttachmentUploadService } from './attachment-upload.service';
import { of } from 'rxjs';

describe('AttachmentUploadService', () => {
  let service: AttachmentUploadService;
  let httpTestingController: HttpTestingController;
  const documentId = '1';
  let getFailedAttachmentRecordsSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(AttachmentUploadService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check request method is post for uploadAttachment', () => {
    const formData = new FormData();
    const files = [];
    service
      .uploadAttachment(documentId, files)
      .subscribe(
        (data) => expect(data).toEqual(formData, 'should return file data'),
        fail
      );
    const url = `${service.configuration.basePath}/document/files/upload/${documentId}`;
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
  });

  it('should check request method is post for uploadEditAttachment', () => {
    const attachmentIdArray = ['test', 'test2'];
    const files = [];
    service
      .uploadEditAttachment(documentId, attachmentIdArray, files)
      .subscribe((data) => expect(data).withContext('should return file data'));
    const url = `${service.configuration.basePath}/document/files/upload/${documentId}`;
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
  });

  it('should check request method is post for uploadEditAttachment', () => {
    const attachmentIdArray = ['test', 'test2'];
    const files = [];
    service
      .uploadEditAttachment(documentId, attachmentIdArray, files)
      .subscribe((data) => expect(data).withContext('should return file data'));
    const url = `${service.configuration.basePath}/document/files/upload/${documentId}`;
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
  });

  it('should check request method is get for downloadDocAttachmentsAsZip', () => {
    service.downloadDocAttachmentsAsZip(documentId).subscribe();
    const url = `${service.configuration.basePath}/document/file/${documentId}/attachments`;
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });

  it('should check request method is get for downloadFile', () => {
    const attachmentId = '1';
    service.downloadFile(attachmentId).subscribe();
    const url = `${service.configuration.basePath}/document/file/${attachmentId}`;
    const req = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('GET');
  });

  it('should return requiredBasePath', () => {
    const url = 'localhost/test/documents';
    const value = service.removeLastDirectoryPartOf(url);
    expect(value).toEqual('localhost/test');
  });

  it('should call removeLastDirectoryPartOf from getAssetsUrl', () => {
    spyOn(service, 'removeLastDirectoryPartOf');
    service.getAssetsUrl();
    expect(service.removeLastDirectoryPartOf).toHaveBeenCalled();
  });

  beforeEach(() => {
    getFailedAttachmentRecordsSpy = spyOn(
      service,
      'getFailedAttachmentRecords'
    ).and.returnValue(
      of([
        {
          creationDate: '2022-05-01',
          creationUser: 'John',
          modificationDate: '2022-05-02',
          modificationUser: 'Jane',
          documentName: 'Document 1',
          documentDescription: 'Description 1',
          documentType: 'Type 1',
          status: 'Failed',
          version: 1,
          fileName: 'file.txt',
          name: 'Attachment 1',
          attachmentDescription: 'Attachment Description 1',
          mimeTypeName: 'text/plain',
          specification: 'Specification 1',
          involvement: 'Involvement 1',
          objectReferenceId: '1',
          objectReferenceType: 'Type',
        },
      ])
    );
  });

  it('should export all failed attachments as CSV', fakeAsync(() => {
    service.exportAllFailedAttachments('1');
    tick();

    expect(getFailedAttachmentRecordsSpy).toHaveBeenCalledWith('1');

    const downloadLink = document.createElement('a');
    downloadLink.setAttribute(
      'href',
      'http://localhost/document/files/upload/failed/1'
    );
    downloadLink.setAttribute('download', 'Failed Attachment Error Logs.csv');
    expect(downloadLink).toBeTruthy();
  }));
});
