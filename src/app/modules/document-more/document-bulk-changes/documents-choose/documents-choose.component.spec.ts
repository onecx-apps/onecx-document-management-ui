import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateService
} from '@ngx-translate/core';
import {
  BreadcrumbService,
} from '@onecx/portal-integration-angular';
import {
  PortalMessageServiceMock,
  providePortalMessageServiceMock,
} from '@onecx/portal-integration-angular/mocks';
import { AttachmentUploadService } from 'src/app/modules/document-detail/attachment-upload.service';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';

import { DocumentsChooseComponent } from './documents-choose.component';
import { HttpClient } from '@angular/common/http';

describe('DocumentsChooseComponent', () => {
  let component: DocumentsChooseComponent;
  let fixture: ComponentFixture<DocumentsChooseComponent>;
  let service: BreadcrumbService;
  let attachmentUploadService: AttachmentUploadService;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsChooseComponent, TranslatePipeMock],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        providePortalMessageServiceMock(),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DocumentsChooseComponent);
    component = fixture.componentInstance;
    attachmentUploadService = TestBed.inject(AttachmentUploadService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return xls icon for extension "xls"', () => {
    const extension = 'xls';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('xls.png');
  });

  it('should return xls icon for extension "xlsx"', () => {
    const extension = 'xlsx';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('xls.png');
  });

  it('should return doc icon for extension "doc"', () => {
    const extension = 'doc';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('doc.png');
  });

  it('should return doc icon for extension "docx"', () => {
    const extension = 'docx';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('doc.png');
  });

  it('should return ppt icon for extension "ppt"', () => {
    const extension = 'ppt';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('ppt.png');
  });

  it('should return ppt icon for extension "pptx"', () => {
    const extension = 'pptx';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('ppt.png');
  });

  it('should return pdf icon for extension "pdf"', () => {
    const extension = 'pdf';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('pdf.png');
  });

  it('should return zip icon for extension "zip"', () => {
    const extension = 'zip';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('zip.png');
  });

  it('should return txt icon for extension "txt"', () => {
    const extension = 'txt';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('txt.png');
  });

  it('should return file icon for any other extension', () => {
    const extension = 'csv';
    const icon = component.getFileExtensionIcon(extension);
    expect(icon).toBe('file.png');
  });

  it('should set fallback attribute and update src when fallback attribute is not set', () => {
    const event = {
      target: {
        getAttribute: () => null,
        setAttribute: jasmine.createSpy('setAttribute'),
        src: '',
      },
    };
    const attachmentUploadService = TestBed.inject(AttachmentUploadService);
    spyOn(attachmentUploadService, 'getAssetsUrl').and.returnValue('/assets/');
    const expectedSrc = '/assets/images/file-format-icons/file.png';

    component.imgError(event);

    expect(event.target.setAttribute).toHaveBeenCalledWith('fallback', true);
    expect(event.target.src).toBe(expectedSrc);
    expect(attachmentUploadService.getAssetsUrl).toHaveBeenCalled();
  });

  it('should not set fallback attribute or update src when fallback attribute is already set', () => {
    const event = {
      target: {
        getAttribute: () => true,
        setAttribute: jasmine.createSpy('setAttribute'),
        src: '',
      },
    };

    component.imgError(event);

    expect(event.target.setAttribute).not.toHaveBeenCalled();
    expect(event.target.src).toBe('');
  });
  it('should return audio icon for type "audio"', () => {
    const type = 'audio';
    const icon = component.getMediaIcon(type);
    expect(icon).toBe('audio.png');
  });

  it('should return video icon for type "video"', () => {
    const type = 'video';
    const icon = component.getMediaIcon(type);
    expect(icon).toBe('video.png');
  });

  it('should return image icon for type "image"', () => {
    const type = 'image';
    const icon = component.getMediaIcon(type);
    expect(icon).toBe('img.png');
  });

  it('should return file icon for any other type', () => {
    const type = 'document';
    const icon = component.getMediaIcon(type);
    expect(icon).toBe('file.png');
  });
  it('should return valid attachments array with storageUploadStatus set to true', () => {
    const result = {
      attachments: [
        { storageUploadStatus: true },
        { storageUploadStatus: false },
        { storageUploadStatus: true },
        { storageUploadStatus: true },
      ],
    };

    const validAttachments = component.getValidAttachmentArray(result);

    expect(validAttachments.length).toBe(3);
    expect(validAttachments[0].storageUploadStatus).toBe(true);
    expect(validAttachments[1].storageUploadStatus).toBe(true);
    expect(validAttachments[2].storageUploadStatus).toBe(true);
  });

  it('should return an empty array when attachments is undefined', () => {
    const result = {};

    const validAttachments = component.getValidAttachmentArray(result);

    expect(validAttachments.length).toBe(0);
  });

  it('should return an empty array when no attachment has storageUploadStatus set to true', () => {
    const result = {
      attachments: [
        { storageUploadStatus: false },
        { storageUploadStatus: false },
      ],
    };

    const validAttachments = component.getValidAttachmentArray(result);

    expect(validAttachments.length).toBe(0);
  });
  it('should return the appropriate media icon when attachment has a valid media type', () => {
    const attachment = {
      fileName: 'sample.mp3',
      mimeType: { name: 'audio/mpeg' },
    };
    spyOn(component, 'getMediaIcon').and.returnValue('audioIcon');

    const result = component.getAttachmentIconName(attachment);

    expect(component.getMediaIcon).toHaveBeenCalledWith('audio');
    expect(result).toEqual('audioIcon');
  });

  it('should return the appropriate file extension icon when attachment has a non-media type and fileExtension has length greater than 1', () => {
    const attachment = {
      fileName: 'sample.docx',
      mimeType: {
        name: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    };
    spyOn(component, 'getFileExtensionIcon').and.returnValue('docxIcon');

    const result = component.getAttachmentIconName(attachment);

    expect(component.getFileExtensionIcon).toHaveBeenCalledWith('docx');
    expect(result).toEqual('docxIcon');
  });

  it('should return the default file icon when attachment has a non-media type and fileExtension has length less than or equal to 1', () => {
    const attachment = {
      fileName: 'sample.txt',
      mimeType: { name: 'text/plain' },
    };
    spyOn(component, 'getFileExtensionIcon');
    const expectedIcon = 'file.png';
    const result = component.getAttachmentIconName(attachment);
    expect(component.getFileExtensionIcon).toHaveBeenCalled();
    expect(result).toEqual(expectedIcon);
  });

  it('should return the default file icon when attachment has no file extension', () => {
    const attachment = {
      fileName: 'sample',
      mimeType: { name: 'application/pdf' },
    };
    spyOn(component, 'getFileExtensionIcon');
    const expectedIcon = 'file.png';
    const result = component.getAttachmentIconName(attachment);
    expect(component.getFileExtensionIcon).not.toHaveBeenCalled();
    expect(result).toEqual(expectedIcon);
  });

  it('should set showCount to true and return the folder icon URL if fileCount is greater than 1', () => {
    component.fileCount = 2;
    const result = component.getFolderIconUrl();
    expect(component.showCount).toBe(false);
    expect(result).toContain('/images/file-format-icons/folder.png');
  });

  it('should not set showCount to true and not return the folder icon URL if fileCount is not greater than 1', () => {
    component.fileCount = 1;
    const result = component.getFolderIconUrl();
    expect(component.showCount).toBe(false);
    expect(result).toContain('/images/file-format-icons/folder.png');
  });

  it('should return the empty icon URL when there are no valid attachments', () => {
    const result = [];
    spyOn(component, 'getValidAttachmentArray').and.returnValue(result);
    spyOn(component, 'getEmptyIconUrl').and.returnValue('empty-icon-url');
    const iconUrl = component.getAttachmentIcon(result);
    expect(component.showCount).toBe(false);
    expect(component.getValidAttachmentArray).toHaveBeenCalledWith(result);
    expect(component.getEmptyIconUrl).toHaveBeenCalled();
    expect(iconUrl).toBe('empty-icon-url');
  });

  it('should set showCount to false and return the URL of the first attachment icon', () => {
    const validAttachmentArray = ['attachment1', 'attachment2'];
    spyOn(component, 'getAttachmentIconName').and.returnValue('attachment1');
    spyOn(component, 'getAttachmentIconUrl').and.returnValue(
      'attachment-icon-url'
    );
    const result = component.getAttachmentIcon(validAttachmentArray);
    expect(component.showCount).toBe(false);
    expect(result).toContain('/images/file-format-icons/empty.png');
  });

  it('should set showCount to true and return folder icon URL if fileCount is greater than 1', () => {
    spyOn(component, 'getValidAttachmentArray').and.returnValue([
      'attachment1',
      'attachment2',
    ]);
    spyOn(component, 'getFolderIconUrl').and.returnValue('folderIconUrl');

    const result = component.getAttachmentIcon('result');

    expect(component.fileCount).toBe(2);
    expect(component.showCount).toBe(true);
    expect(component.getValidAttachmentArray).toHaveBeenCalledWith('result');
    expect(component.getFolderIconUrl).toHaveBeenCalled();
    expect(result).toEqual('folderIconUrl');
  });

  it('should set showCount to false and return attachment icon URL if fileCount is 1', () => {
    spyOn(component, 'getValidAttachmentArray').and.returnValue(['attachment']);
    spyOn(component, 'getAttachmentIconName').and.returnValue('attachmentIcon');
    spyOn(component, 'getAttachmentIconUrl').and.returnValue(
      'attachmentIconUrl'
    );

    const result = component.getAttachmentIcon('result');

    expect(component.fileCount).toBe(1);
    expect(component.showCount).toBe(false);
    expect(component.getValidAttachmentArray).toHaveBeenCalledWith('result');
    expect(component.getAttachmentIconName).toHaveBeenCalledWith('attachment');
    expect(component.getAttachmentIconUrl).toHaveBeenCalledWith(
      'attachmentIcon'
    );
    expect(result).toEqual('attachmentIconUrl');
  });

  it('should set showCount to false and return empty icon URL if fileCount is 0', () => {
    spyOn(component, 'getValidAttachmentArray').and.returnValue([]);
    spyOn(component, 'getEmptyIconUrl').and.returnValue('emptyIconUrl');

    const result = component.getAttachmentIcon('result');

    expect(component.fileCount).toBe(0);
    expect(component.showCount).toBe(false);
    expect(component.getValidAttachmentArray).toHaveBeenCalledWith('result');
    expect(component.getEmptyIconUrl).toHaveBeenCalled();
    expect(result).toEqual('emptyIconUrl');
  });

  it('should return the correct folder icon URL', () => {
    spyOn(attachmentUploadService, 'getAssetsUrl').and.returnValue('assets/');
    const expectedUrl = 'assets/images/file-format-icons/folder.png';

    const result = component.getFolderIconUrl();

    expect(attachmentUploadService.getAssetsUrl).toHaveBeenCalled();
    expect(result).toEqual(expectedUrl);
  });
});
