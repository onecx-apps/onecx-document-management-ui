import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { providePortalMessageServiceMock } from '@onecx/portal-integration-angular/mocks';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { AttachmentUploadService } from '../attachment-upload.service';
import { DocumentQuickUploadComponent } from './document-quick-upload.component';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';

describe('DocumentQuickUploadComponent', () => {
  let component: DocumentQuickUploadComponent;
  let fixture: ComponentFixture<DocumentQuickUploadComponent>;
  let router: Router;
  let mockContext;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentQuickUploadComponent, TranslatePipeMock],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: AttachmentUploadService },
        providePortalMessageServiceMock(),
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DocumentQuickUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mockContext = {
      documentQuickUploadForm: {
        value: {
          field1: '',
          field2: '',
          lifeCycleState: '',
        },
        dirty: false,
      },
      attachmentArray: [],
      cancelDialogVisible: false,
      router: {
        navigate: jasmine.createSpy('navigate'),
      },
      activeRoute: {},
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSortFieldChange', () => {
    spyOn(component, 'updateSorting');
    component.onSortFieldChange('true');
    expect(component.sortField).toEqual('true');
    expect(component.updateSorting).toHaveBeenCalled();
  });

  it('should call updateAttachmentsLayout', () => {
    component.updateAttachmentsLayout('');
    expect(component.layout).toBe('');
  });

  it('should call updateSorting', () => {
    spyOn(component, 'updateSorting');
    component.onSortOrderChange(true);
    expect(component.updateSorting).toHaveBeenCalled();
  });

  it('should call updateSorting', () => {
    spyOn(component, 'updateSorting');
    component.onSortOrderChange(false);
    expect(component.updateSorting).toHaveBeenCalled();
  });

  it('should update the enableCreateButton property', () => {
    const mockEnableValue = true;
    component.createButtonEnable(mockEnableValue);
    expect(component.enableCreateButton).toEqual(mockEnableValue);
  });

  it('should update the enableCreateButton property to false', () => {
    const mockEnableValue = false;
    component.createButtonEnable(mockEnableValue);
    expect(component.enableCreateButton).toEqual(mockEnableValue);
  });

  it('should call setFormValid', () => {
    component.setFormValid('');
    expect(component.formValid).toBeUndefined();
    expect(component.documentQuickUploadForm).toBeTrue;
  });

  it('should call setAttachmentArray', () => {
    component.setAttachmentArray('');
    expect(component.attachmentArray).toBe('');
  });

  it('should update selectedFileList after a delay of 50ms', fakeAsync(() => {
    const dummyFileList = true;
    let selectedFileList;
    component.refreshAttachmentList(dummyFileList);
    tick(50);
    flush();
    selectedFileList = component.selectedFileList;
    expect(selectedFileList).toBe(dummyFileList);
  }));

  it('should update sortOrder in ASCENDING order', () => {
    component.sortField = 'fileData.name';
    component.updateSorting();
    expect(component.sortOrder).toEqual(1);
  });

  it('should call onCancelNo', () => {
    component.onCancelNo();
    expect(component.cancelDialogVisible).toBe(false);
  });

  it('should call onCancelYes', () => {
    const spy = spyOn(router, 'navigate');
    component.onCancelYes();
    expect(spy.calls.first().args[0]).toContain('../../search');
  });

  it('should return the correct media icon based on the type', () => {
    const audioType = 'audio';
    const videoType = 'video';
    const imageType = 'image';
    const unknownType = 'unknown';

    const audioIcon = component.getMediaIcon(audioType);
    const videoIcon = component.getMediaIcon(videoType);
    const imageIcon = component.getMediaIcon(imageType);
    const unknownIcon = component.getMediaIcon(unknownType);

    expect(audioIcon).toEqual('audio.png');
    expect(videoIcon).toEqual('video.png');
    expect(imageIcon).toEqual('img.png');
    expect(unknownIcon).toEqual('file.png');
  });

  it('should return the correct file extension icon based on the extension', () => {
    const xlsExtension = 'xls';
    const xlsxExtension = 'xlsx';
    const docExtension = 'doc';
    const docxExtension = 'docx';
    const pptExtension = 'ppt';
    const pptxExtension = 'pptx';
    const pdfExtension = 'pdf';
    const zipExtension = 'zip';
    const txtExtension = 'txt';
    const unknownExtension = 'unknown';

    const xlsIcon = component.getFileExtensionIcon(xlsExtension);
    const xlsxIcon = component.getFileExtensionIcon(xlsxExtension);
    const docIcon = component.getFileExtensionIcon(docExtension);
    const docxIcon = component.getFileExtensionIcon(docxExtension);
    const pptIcon = component.getFileExtensionIcon(pptExtension);
    const pptxIcon = component.getFileExtensionIcon(pptxExtension);
    const pdfIcon = component.getFileExtensionIcon(pdfExtension);
    const zipIcon = component.getFileExtensionIcon(zipExtension);
    const txtIcon = component.getFileExtensionIcon(txtExtension);
    const unknownIcon = component.getFileExtensionIcon(unknownExtension);

    expect(xlsIcon).toBe('xls.png');
    expect(xlsxIcon).toBe('xls.png');
    expect(docIcon).toBe('doc.png');
    expect(docxIcon).toBe('doc.png');
    expect(pptIcon).toBe('ppt.png');
    expect(pptxIcon).toBe('ppt.png');
    expect(pdfIcon).toBe('pdf.png');
    expect(zipIcon).toBe('zip.png');
    expect(txtIcon).toBe('txt.png');
    expect(unknownIcon).toBe('file.png');
  });

  it('should return false when attachmentArray is empty', () => {
    component.attachmentArray = [];
    const result = component.isPaginatorVisible;
    expect(result).toBe(false);
  });

  it('should return true when attachmentArray is not empty', () => {
    component.attachmentArray = [
      {
        name: 'Attachment 1',
        description: 'Attachment description',
        mimeTypeId: 1,
        validity: '2023-06-14',
        fileName: 'attachment1.pdf',
      },
    ];
    const result = component.isPaginatorVisible;
    expect(result).toBe(true);
  });
  it('should disable the create button if any invalid attachment exists', () => {
    const invalidAttachment = { isValid: false };
    component.attachmentArray = [invalidAttachment];
    component.validateAttachmentArray();
    expect(component.enableCreateButton).toBe(false);
  });

  it('should enable the create button if all attachments are valid', () => {
    const validAttachment = { isValid: true };
    component.attachmentArray = [validAttachment];
    component.validateAttachmentArray();
    expect(component.enableCreateButton).toBe(true);
  });

  it('should disable the create button if the attachment array is empty', () => {
    component.attachmentArray = [];
    component.validateAttachmentArray();
    expect(component.enableCreateButton).toBe(false);
  });

  it('should return true if file size is less than or equal to 2097152 bytes', () => {
    const file = { size: 1000 };
    const result = component.isValidFile(file);
    expect(result).toBe(true);
  });

  it('should return false if file size is greater than 2097152 bytes', () => {
    const file = { size: 3000000 };
    const result = component.isValidFile(file);
    expect(result).toBe(false);
  });

  it('should return false if file size is not provided', () => {
    const file = {};
    const result = component.isValidFile(file);
    expect(result).toBe(false);
  });

  it('should format bytes correctly with default decimal places', () => {
    const bytes = 1024;
    const result = component.formatBytes(bytes);
    expect(result).toBe('1 KB');
  });

  it('should format bytes correctly with custom decimal places', () => {
    const bytes = 2048;
    const decimals = 1;
    const result = component.formatBytes(bytes, decimals);
    expect(result).toBe('2 KB');
  });

  it('should return "0 Bytes" for 0 bytes', () => {
    const bytes = 0;
    const result = component.formatBytes(bytes);
    expect(result).toBe('0 Bytes');
  });

  it('should return false for NaN bytes', () => {
    const bytes = 'abc';
    const result = component.formatBytes(bytes);
    expect(result).toBe(false);
  });

  it('should return false for negative bytes', () => {
    const bytes = -100;
    const result = component.formatBytes(bytes);
    expect(result).toBe(false);
  });

  it('should return the media icon for audio files', () => {
    const attachment = {
      fileName: 'audio.mp3',
      fileData: { type: 'audio/mp3' },
    };
    const result = component.getAttachmentIcon(attachment);
    expect(result).toContain('/images/file-format-icons/audio.png');
  });

  it('should return the media icon for video files', () => {
    const attachment = {
      fileName: 'video.mp4',
      fileData: { type: 'video/mp4' },
    };
    const result = component.getAttachmentIcon(attachment);
    expect(result).toContain('/images/file-format-icons/video.png');
  });

  it('should return the media icon for image files', () => {
    const attachment = {
      fileName: 'image.png',
      fileData: { type: 'image/png' },
    };

    const result = component.getAttachmentIcon(attachment);
    expect(result).toContain('/images/file-format-icons/img.png');
  });

  it('should return the icon based on the file extension if file type is not audio, video, or image', () => {
    const attachment = {
      fileName: 'document.pdf',
      fileData: { type: 'application/pdf' },
    };

    const result = component.getAttachmentIcon(attachment);
    expect(result).toContain('/images/file-format-icons/pdf.png');
  });

  it('should return the default file icon if attachmentIcon is not set', () => {
    const attachment = {
      fileName: 'unknown.ext',
      fileData: { type: 'unknown/type' },
    };
    const result = component.getAttachmentIcon(attachment);
    expect(result).toContain('/images/file-format-icons/file.png');
  });

  it('should remove the specified attachment and validate the array', () => {
    const attachment = { mimeTypeid: 1, name: 'file.txt' };
    component.attachmentArray = [
      { mimeTypeid: 1, name: 'file.txt' },
      { mimeTypeid: 2, name: 'image.jpg' },
    ];
    component.onDeleteUploadFile(attachment);
    expect(component.attachmentArray.length).toBe(2);
    expect(component.attachmentArray[0]).toEqual({
      mimeTypeid: 1,
      name: 'file.txt',
    });
  });

  it('should set cancelDialogVisible to true if any field (except lifeCycleState) has a truthy value', () => {
    mockContext.documentQuickUploadForm.value.field1 = 'value1';
    mockContext.documentQuickUploadForm.value.field2 = 'value2';
    component.onCancel.call(mockContext);
    expect(mockContext.cancelDialogVisible).toBe(true);
  });

  it('should set cancelDialogVisible to true if documentQuickUploadForm is dirty', () => {
    mockContext.documentQuickUploadForm.dirty = true;
    component.onCancel.call(mockContext);
    expect(mockContext.cancelDialogVisible).toBe(false);
  });

  it('should set cancelDialogVisible to true if attachmentArray has items', () => {
    mockContext.attachmentArray = ['attachment1', 'attachment2'];
    component.onCancel.call(mockContext);
    expect(mockContext.cancelDialogVisible).toBe(true);
  });

  it('should navigate to "../../search" if no field has a truthy value, documentQuickUploadForm is not dirty, and attachmentArray is empty', () => {
    component.onCancel.call(mockContext);
    expect(mockContext.router.navigate).toHaveBeenCalledWith(['../../search'], {
      relativeTo: mockContext.activeRoute,
    });
  });

  it('should correctly map the attachments to file uploads', () => {
    component.attachmentArray = [
      { fileData: { name: 'file1.txt' } },
      { fileData: { name: 'file2.txt' } },
    ];
    const result = (component as any).mapUploads();
    expect(result.length).toBe(2);
    expect(result[0].file.name).toBe('file1.txt');
    expect(result[1].file.name).toBe('file2.txt');
  });

  it('should correctly map attachments when invoking the private method', () => {
    component.attachmentArray = [
      {
        name: 'Attachment 1',
        description: 'Attachment description',
        mimeTypeId: 1,
        validity: '2023-06-14',
        fileName: 'attachment1.pdf',
      },
      {
        name: 'Attachment 2',
        description: 'Another attachment',
        mimeTypeId: 2,
        validity: '2023-06-15',
        fileName: 'attachment2.docx',
      },
    ];
    const mapAttachments = (component as any).mapAttachments;
    const result = mapAttachments.call(component);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Attachment 1');
    expect(result[0].description).toBe('Attachment description');
    expect(result[1].name).toBe('Attachment 2');
    expect(result[1].fileName).toBe('attachment2.docx');
  });
  it('should return the correct media icon for different types', () => {
    expect(component.getMediaIcon('audio')).toBe('audio.png');
    expect(component.getMediaIcon('video')).toBe('video.png');
    expect(component.getMediaIcon('image')).toBe('img.png');
    expect(component.getMediaIcon('unknown')).toBe('file.png');
  });

  it('should set fallback source on image error', () => {
    const fakeEvent = {
      target: {
        getAttribute: () => null,
        setAttribute: jasmine.createSpy('setAttribute'),
        src: 'fake-url.jpg',
      },
    };

    component.imgError(fakeEvent);
    expect(fakeEvent.target.setAttribute).toHaveBeenCalledWith(
      'fallback',
      true
    );
    expect(fakeEvent.target.src).toContain(
      '/images/file-format-icons/file.png'
    );
  });

  it('should not set fallback source if already set', () => {
    const fakeEvent = {
      target: {
        getAttribute: () => true,
        setAttribute: jasmine.createSpy('setAttribute'),
        src: 'fake-url.jpg',
      },
    };
    component.imgError(fakeEvent);
    expect(fakeEvent.target.setAttribute).not.toHaveBeenCalled();
    expect(fakeEvent.target.src).not.toContain(
      '/images/file-format-icons/file.png'
    );
  });
});
