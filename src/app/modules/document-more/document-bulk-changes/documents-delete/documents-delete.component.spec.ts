import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { DocumentsDeleteComponent } from './documents-delete.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DocumentsDeleteComponent', () => {
  let component: DocumentsDeleteComponent;
  let fixture: ComponentFixture<DocumentsDeleteComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentsDeleteComponent, TranslatePipeMock],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should return the icon based on file extension for other file types', () => {
    const attachment = {
      fileName: 'document.pdf',
      mimeType: { name: 'application/pdf' },
    };
    const expectedIcon = 'pdf.png';
    const actualIcon = component.getAttachmentIconName(attachment);
    expect(actualIcon).toEqual(expectedIcon);
  });

  it('should return valid attachment array', () => {
    const result = {
      attachments: [
        { storageUploadStatus: true },
        { storageUploadStatus: false },
        { storageUploadStatus: true },
      ],
    };
    const validAttachmentArray = component.getValidAttachmentArray(result);
    expect(validAttachmentArray).toEqual([
      { storageUploadStatus: true },
      { storageUploadStatus: true },
    ]);
  });

  it('should return empty array if no attachments', () => {
    const result = {};
    const validAttachmentArray = component.getValidAttachmentArray(result);
    expect(validAttachmentArray).toEqual([]);
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
    expect(fakeEvent.target.src).toBe(
      'http://assets/images/file-format-icons/file.png'
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
    expect(fakeEvent.target.src).not.toBe(
      'http://assets/images/file-format-icons/file.png'
    );
  });
  it('should return the correct attachment icon URL based on the attachment icon', () => {
    const attachmentIcon = 'file.png';
    spyOn(component, 'getAttachmentIconUrl').and.returnValue(
      'attachment-icon-url'
    );

    const result = component.getAttachmentIconUrl(attachmentIcon);

    expect(result).toEqual('attachment-icon-url');
  });

  it('should return the correct attachment icon URL based on the attachment icon', () => {
    const attachmentIcon = 'image.png';
    spyOn(component, 'getAttachmentIconUrl').and.returnValue('image-icon-url');

    const result = component.getAttachmentIconUrl(attachmentIcon);

    expect(result).toEqual('image-icon-url');
  });

  it('should return the correct attachment icon URL based on the attachment icon', () => {
    const attachmentIcon = 'audio.png';
    spyOn(component, 'getAttachmentIconUrl').and.returnValue('audio-icon-url');

    const result = component.getAttachmentIconUrl(attachmentIcon);

    expect(result).toEqual('audio-icon-url');
  });

  it('should return the correct empty icon URL', () => {
    const expectedUrl =
      component['attachmentUploadService'].getAssetsUrl() +
      'images/file-format-icons/empty.png';

    const result = component.getEmptyIconUrl();

    expect(result).toEqual(expectedUrl);
  });
  it('should return the correct attachment header icon URL', () => {
    const expectedUrl =
      component['attachmentUploadService'].getAssetsUrl() +
      'images/file-format-icons/attachment.png';

    const result = component.getAttachmentHeaderIcon();

    expect(result).toEqual(expectedUrl);
  });
  it('should return the correct folder icon URL', () => {
    const expectedUrl =
      component['attachmentUploadService'].getAssetsUrl() +
      'images/file-format-icons/folder.png';

    const result = component.getFolderIconUrl();

    expect(result).toEqual(expectedUrl);
  });
  it('should return the folder icon URL when there are multiple attachments', () => {
    const validAttachmentArray = [
      { fileName: 'attachment1.txt' },
      { fileName: 'attachment2.txt' },
    ];

    spyOn(component, 'getValidAttachmentArray').and.returnValue(
      validAttachmentArray
    );
    spyOn(component, 'getFolderIconUrl').and.returnValue('folder-icon-url');

    component.fileCount = validAttachmentArray.length;
    const result = component.getAttachmentIcon(null);

    expect(component.showCount).toBeTrue();
    expect(component.getValidAttachmentArray).toHaveBeenCalled();
    expect(component.getFolderIconUrl).toHaveBeenCalled();
    expect(result).toEqual('folder-icon-url');
  });

  it('should return the attachment icon URL when there is only one attachment', () => {
    const validAttachmentArray = [{ fileName: 'attachment1.txt' }];
    const attachmentIcon = 'attachment-icon-url';

    spyOn(component, 'getValidAttachmentArray').and.returnValue(
      validAttachmentArray
    );
    spyOn(component, 'getAttachmentIconName').and.returnValue(
      'attachment-icon'
    );
    spyOn(component, 'getAttachmentIconUrl').and.returnValue(attachmentIcon);

    component.fileCount = validAttachmentArray.length;
    const result = component.getAttachmentIcon(null);

    expect(component.showCount).toBeFalse();
    expect(component.getValidAttachmentArray).toHaveBeenCalled();
    expect(component.getAttachmentIconName).toHaveBeenCalledWith(
      validAttachmentArray[0]
    );
    expect(component.getAttachmentIconUrl).toHaveBeenCalledWith(
      'attachment-icon'
    );
    expect(result).toEqual(attachmentIcon);
  });

  it('should return the empty icon URL when there are no attachments', () => {
    const validAttachmentArray = [];

    spyOn(component, 'getValidAttachmentArray').and.returnValue(
      validAttachmentArray
    );
    spyOn(component, 'getEmptyIconUrl').and.returnValue('empty-icon-url');
    component.fileCount = validAttachmentArray.length;
    const result = component.getAttachmentIcon(null);
    expect(component.showCount).toBeFalse();
    expect(component.getValidAttachmentArray).toHaveBeenCalled();
    expect(component.getEmptyIconUrl).toHaveBeenCalled();
    expect(result).toEqual('empty-icon-url');
  });
  it('should return the correct attachment icon URL', () => {
    const attachmentIcon = 'attachment-icon.png';
    const expectedUrl =
      'http://assets/images/file-format-icons/attachment-icon.png';

    const result = component.getAttachmentIconUrl(attachmentIcon);

    expect(result).toEqual(expectedUrl);
  });
});
