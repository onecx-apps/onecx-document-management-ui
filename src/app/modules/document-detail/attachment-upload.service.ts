// Core imports
import {
  HttpClient,
  HttpHeaders,
  HttpParameterCodec,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';

// Third party imports
import { Observable } from 'rxjs';

// Application imports
import { Configuration } from 'src/app/generated/configuration';
import { CustomHttpParameterCodec } from 'src/app/generated/encoder';
import { storageUploadAuditDTO } from 'src/app/generated/model/storageUploadAuditDTO';
import { BASE_PATH } from 'src/app/generated/variables';
import { convertToCSV } from 'src/app/utils';

@Injectable({
  providedIn: 'any',
})
export class AttachmentUploadService {
  protected basePath = 'http://localhost';
  public defaultHeaders = new HttpHeaders();
  public configuration = new Configuration();
  public encoder: HttpParameterCodec;

  constructor(
    protected http: HttpClient,
    @Optional() @Inject(BASE_PATH) basePath: string,
    @Optional() configuration: Configuration
  ) {
    if (configuration) {
      this.configuration = configuration;
    }
    if (typeof this.configuration.basePath !== 'string') {
      if (typeof basePath !== 'string') {
        basePath = this.basePath;
      }
      this.configuration.basePath = basePath;
    }
    this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
  }

  /*
    @param -> documentId
    @body -> Files List as formData object 
    @Description -> making a http post request
  */
  public uploadAttachment(documentId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    for (let file of files) {
      formData.append('file', file);
    }
    return this.http.post<any>(
      `${this.configuration.basePath}/v1/document/files/upload/${documentId}`,
      formData
    );
  }

  /*
    @param -> documentId
    @body -> Files List as formData object 
    @Description -> making a http post request
  */
  public uploadEditAttachment(
    documentId: string,
    attachmentIdArray: any[],
    attachmentFileArray: File[]
  ): Observable<any> {
    const formData = new FormData();
    formData.append('file', attachmentIdArray.toString());
    for (let file of attachmentFileArray) {
      formData.append('file', file);
    }
    console.log('formData: ', formData);
    return this.http.post<any>(
      `${this.configuration.basePath}/v1/document/files/upload/${documentId}`,
      formData
    );
  }
  /*
    @param -> documentId
    @Description -> making a http get request to get failed file list
  */
  public getFailedAttachmentRecords(
    documentId: string
  ): Observable<storageUploadAuditDTO[]> {
    return this.http.get<storageUploadAuditDTO[]>(
      `${this.configuration.basePath}/v1/document/files/upload/failed/${documentId}`
    );
  }
  /*
    @param -> documentId
    @Description -> making a http get request to get all attachments 
  */
  public downloadDocAttachmentsAsZip(documentId: string) {
    const headers = new HttpHeaders({
      'client-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    return this.http.get<Blob>(
      `${this.configuration.basePath}/v1/document/file/${documentId}/attachments`,
      { observe: 'response', responseType: 'blob' as 'json', headers: headers }
    );
  }
  /*
    @param -> attachmentId
    @Description -> making a http get request to download required file 
  */
  public downloadFile(attachmentId: string) {
    return this.http.get<Blob>(
      `${this.configuration.basePath}/v1/document/file/${attachmentId}`,
      { observe: 'response', responseType: 'blob' as 'json' }
    );
  }
  /**
   * @description export all failed document in csv format
   * @param documentId
   */
  exportAllFailedAttachments(documentId: string) {
    let csvData = [];
    let result = [];
    let header = [];
    let failedAttchments: any[] = [];
    this.getFailedAttachmentRecords(documentId).subscribe((res) => {
      failedAttchments.push(res);
      failedAttchments[0]?.map((e) => {
        let exportObject = {
          creationDate: e?.creationDate,
          creationUser: e?.creationUser,
          modificationDate: e?.modificationDate,
          modificationUser: e?.modificationUser,
          documentName: e?.documentName,
          documentDescription: e?.documentDescription,
          documentType: e?.documentTypeName,
          status: e?.lifeCycleState,
          version: e?.documentVersion,
          fileName: e?.fileName,
          name: e?.name,
          attachmentDescription: e?.attachmentDescription,
          mimeTypeName: e?.mimeTypeName,
          specification: e?.specificationName,
          involvement: e?.involvement,
          objectReferenceId: e?.objectReferenceId,
          objectReferenceType: e?.objectReferenceType,
        };
        header = Object.keys(exportObject);
        result.push(exportObject);
      });
      csvData.push(convertToCSV(result, header));
      let blob = new Blob(['\ufeff' + csvData], {
        type: 'text/csv;charset=utf-8;',
      });
      let dwldLink = document.createElement('a');
      let url = URL.createObjectURL(blob);
      dwldLink.setAttribute('href', url);
      dwldLink.setAttribute(
        'download',
        'Failed Attachment Error Logs' + '.csv'
      );
      dwldLink.click();
    });
  }

  /* function to get the requiredBasePath for accessing assets folder
   * striping /organization-management-api/ from this.configuration.basePath
   */
  removeLastDirectoryPartOf(the_url: string) {
    var the_arr = the_url.split('/');
    the_arr.pop();
    return the_arr.join('/');
  }

  /**
   * function to get the placeholderImage
   */
  getAssetsUrl() {
    const requiredBasePath = this.removeLastDirectoryPartOf(
      this.configuration.basePath
    );
    const ret = `${requiredBasePath}/assets/`;
    return ret;
  }
}
