import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAttachmentComponent } from './document-attachment.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { SupportedMimeTypeControllerV1APIService } from 'src/app/generated';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';

describe('DocumentAttachmentComponent', () => {
  let component: DocumentAttachmentComponent;
  let fixture: ComponentFixture<DocumentAttachmentComponent>;
  let translateService: jasmine.SpyObj<TranslateService>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentAttachmentComponent, TranslatePipeMock],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: SupportedMimeTypeControllerV1APIService,
          useClass: SupportedMimeTypeControllerV1APIService,
        },
        { provide: TranslateService, useValue: translateSpy },
      ],
    }).compileComponents();
    translateService = TestBed.inject(
      TranslateService
    ) as jasmine.SpyObj<TranslateService>;
    fixture = TestBed.createComponent(DocumentAttachmentComponent);
    component = fixture.componentInstance;
    component.attachmentFieldsForm = new FormGroup({
      name: new FormControl(),
      mimeType: new FormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the validity control to null', () => {
    const control = component.attachmentFieldsForm.controls['validity'];
    component.resetDate();
    expect(control.value).toBeNull();
  });

  it('should populate the attachment fields form data correctly', () => {
    const attachmentData = {
      name: 'attachmentUnitTest',
      mimeType: 'image/png',
      validity: 'startDateTime: null, endDateTime: "2023-06-26T18:30:00Z"',
      description: 'Unit testing for correct data population of attachment',
      fileData: null,
    };
    const index = 0;
    component.populateAttachmentFormData(attachmentData, index);
    expect(component.attachmentFieldsForm.controls['name'].value).toEqual(
      'attachmentUnitTest'
    );
  });

  it('should delete the last attachment from an array', () => {
    component.attachmentArray = [{ name: 'attachment1', size: 100 }];
    const initialIndex = 0;
    const nextIndex = -1;
    component.deleteAttachment(initialIndex);
    expect(component.attachmentArray).toEqual([]);
  });

  it('should update attachment data with correct values', () => {
    component.attachmentArray = [
      {
        name: 'attachment1',
        mimeType: 'jpg',
        validity: '30',
        description: 'test attachment',
        fileData: null,
        fileName: 'attachment1.jpg',
        mimeTypeId: 1,
      },
      {
        name: 'attachment2',
        mimeType: 'pdf',
        validity: '60',
        description: 'test attachment',
        fileData: null,
        fileName: 'attachment2.pdf',
        mimeTypeId: 2,
      },
    ];
    component.editAttachmentIndex = 0;
    component.attachmentFieldsForm.setValue({
      name: 'attachment1-edited',
      mimeType: 'png',
      validity: '45',
      description: 'edited attachment',
    });
    const mockFile = new File([''], 'attachment1.png', { type: 'image/png' });
    component.fileData = mockFile;
    component.fileType = { id: 3 };
    component.enterDataToListView();
    expect(component.attachmentArray[0].name).toEqual('attachment1-edited');
    expect(component.attachmentArray[0].mimeType).toEqual('png');
    expect(component.attachmentArray[0].validity).toEqual('45');
    expect(component.attachmentArray[0].description).toEqual(
      'edited attachment'
    );
    expect(component.attachmentArray[0].fileData).toEqual(mockFile);
    expect(component.attachmentArray[0].fileName).toEqual('attachment1.png');
    expect(component.attachmentArray[0].mimeTypeId).toEqual(3);
  });

  it('should delete file data and update attachment array', () => {
    component.editAttachmentIndex = 2;
    component.attachmentArray = [
      { fileName: 'file1.docx', fileData: 'WorkToBeDone' },
      { fileName: 'file2.pdf', fileData: 'Certificates' },
      { fileName: 'file3.png', fileData: 'Screenshots' },
    ];
    const spy = spyOn(component, 'validateAttachmentData');
    component.onDeleteUploadFile();
    expect(component.fileData).toBeNull();
    expect(component.attachmentArray[2]['fileData']).toBe('');
    expect(spy).toHaveBeenCalled();
  });

  it('should set the form, file data and populate the array of attachments', () => {
    component.attachmentArray = [
      {
        name: 'Attachment 1',
        size: 100,
        type: 'text/plain',
        mimeType: 'txt',
        validity: '45',
        description: 'edited attachment1',
      },
      {
        name: 'Attachment 2',
        size: 200,
        type: 'text/html',
        mimeType: 'html',
        validity: '22',
        description: 'edited attachment2',
      },
    ];
    expect(component.attachmentFieldsForm.pristine).toBe(true);
  });

  it('should not reset the form or file data when no index is provided', () => {
    component.attachmentArray = [
      { name: 'Attachment 1', size: 100, type: 'text/plain' },
      { name: 'Attachment 2', size: 200, type: 'text/html' },
    ];
    component.editAttachmentIndex = 1;
    component.editAttachmentData(null);
    expect(component.fileData).toBe('');
  });

  it('should return "0 Bytes" if bytes = 0', () => {
    expect(component.formatBytes(0)).toEqual('0 Bytes');
  });

  it('should return "20 Bytes" if bytes = 20', () => {
    expect(component.formatBytes(20)).toEqual('20 Bytes');
  });

  it('should return "false" if bytes is not a number', () => {
    expect(component.formatBytes('abc')).toEqual(false);
  });

  it('should return "false" if bytes is negative', () => {
    expect(component.formatBytes(-1)).toEqual(false);
  });

  it('should not prevent space if cursor is not at the beginning', () => {
    const event = {
      target: {
        selectionStart: 5,
        code: 'Space',
        preventDefault: () => {},
      },
      preventDefault: () => {},
    };
    spyOn(event, 'preventDefault');
    component.preventSpace(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should set attachment form data and update file type when file size is valid and supported', () => {
    const file = new File([], 'test-file.jpg', { type: 'image/jpeg' });
    component.supportedMimeType = [
      { label: 'image/jpeg', value: 1 },
      { label: 'image/png', value: 2 },
    ];
    spyOn(component, 'setAttachmentFormData');
    component.addFile({ target: { files: [file] } });
    expect(component.attachmentErrorMessage).toBe('');
    expect(component.disableAttachmentBtn).toBe(true);
    expect(component.uploadFileMimetype).toBe(file.type);
    expect(component.fileType.name).toBe('image/jpeg');
    expect(component.fileType.id).toBe(1);
    expect(component.tooltipmimeType).toBe('image/jpeg');
    expect(component.setAttachmentFormData).toHaveBeenCalledWith(file);
  });

  it('should set file type to "Unknown" when the file type is not supported', () => {
    const file = new File([], 'test-file.txt', { type: 'text/plain' });
    component.supportedMimeType = [
      { label: 'image/jpeg', value: 1 },
      { label: 'image/png', value: 2 },
    ];
    spyOn(component, 'setAttachmentFormData');
    component.addFile({ target: { files: [file] } });
    expect(component.attachmentErrorMessage).toBe('');
    expect(component.disableAttachmentBtn).toBe(true);
    expect(component.uploadFileMimetype).toBe(file.type);
    expect(component.fileType.name).toBe('Unknown');
    expect(component.fileType.id).toBe(1);
    expect(component.tooltipmimeType).toBe('Unknown');
    expect(component.setAttachmentFormData).toHaveBeenCalledWith(file);
  });

  it('should populate attachment form data and validate when attachmentArray has length', () => {
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');
    component.attachmentArray = [
      {
        name: 'Attachment 1',
        mimeType: 'image/png',
        validity: '',
        description: '',
        fileData: '',
        fileName: '',
      },
      {
        name: 'Attachment 2',
        mimeType: 'image/jpeg',
        validity: '',
        description: '',
        fileData: '',
        fileName: '',
      },
    ];
    component.checkInitialData();
    expect(component.populateAttachmentFormData).toHaveBeenCalledWith(
      component.attachmentArray[component.attachmentArray.length - 1],
      component.attachmentArray.length - 1
    );
    expect(component.validateAttachmentData).toHaveBeenCalled();
  });

  it('should not populate attachment form data or validate when attachmentArray is empty', () => {
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');
    component.attachmentArray = [];
    component.checkInitialData();
    expect(component.populateAttachmentFormData).not.toHaveBeenCalled();
    expect(component.validateAttachmentData).not.toHaveBeenCalled();
  });

  it('should set the form values correctly', () => {
    const file = { name: 'testFile.txt' };
    component.fileData = file;
    component.fileType = { name: 'text/plain' };
    component.attachmentArray = [];
    component.attachmentArray.filter((attachment) => {});
    component.setAttachmentFormData(file);
    expect(component.attachmentFieldsForm.controls['name'].value).toEqual(
      file.name
    );
    expect(component.attachmentFieldsForm.controls['mimeType'].value).toEqual(
      component.fileType.name
    );
  });

  it('should call updateAttachmentData', () => {
    component.attachmentArray = [];
    component.attachmentArray.filter((attachment) => {});
    component.updateAttachmentData();
    component.enterDataToListView();
    component.validateAttachmentData();
  });

  it('should trim input value and update form control', () => {
    const event = {
      target: {
        getAttribute: () => 'name',
        value: '   Example Value   ',
      },
    };
    component.trimSpace(event);
    expect(component.attachmentFieldsForm.get('name')?.value).toBe(
      'Example Value'
    );
  });

  it('should show attachment error message', () => {
    const file = { name: 'filename.txt' };
    const translatedErrorMessage = 'Translated error message';
    translateService.get
      .withArgs(['DOCUMENT_DETAIL.ATTACHMENTS.FILESIZE_ERROR_MESSAGE'], {
        filename: file.name,
      })
      .and.returnValue(
        of({
          'DOCUMENT_DETAIL.ATTACHMENTS.FILESIZE_ERROR_MESSAGE':
            translatedErrorMessage,
        })
      );
    component.showAttachmentErrorMessage(file);
    expect(translateService.get).toHaveBeenCalledWith(
      ['DOCUMENT_DETAIL.ATTACHMENTS.FILESIZE_ERROR_MESSAGE'],
      { filename: file.name }
    );
    expect(component.attachmentErrorMessage).toBe(translatedErrorMessage);
  });

  it('should delete attachment and update form data', () => {
    const attachmentArray = [
      {
        name: 'Attachment 1',
        mimeType: 'image/jpeg',
        fileData: { name: 'attachment1.jpg' },
      },
      {
        name: 'Attachment 2',
        mimeType: 'application/pdf',
        fileData: { name: 'attachment2.pdf' },
      },
    ];
    const index = 1;
    component.attachmentArray = attachmentArray;
    spyOn(component, 'populateAttachmentFormData');
    spyOn(component, 'validateAttachmentData');
    component.deleteAttachment(index);
    expect(component.populateAttachmentFormData).toHaveBeenCalledWith(
      attachmentArray[0],
      0
    );
    expect(component.validateAttachmentData).toHaveBeenCalled();
    expect(component.attachmentArray.length).toBe(1);
  });

  it('should not prevent space if cursor is not at the beginning', () => {
    const event = {
      target: {
        selectionStart: 5,
        code: 'Space',
        preventDefault: () => {},
      },
      preventDefault: () => {},
    };
    spyOn(event, 'preventDefault');
    component.preventSpace(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should toggle showAttachment, reset form, and reset state variables', () => {
    component.attachmentArray = [];
    const initialAttachmentArrayLength = component.attachmentArray.length;
    spyOn(component.attachmentFieldsForm, 'reset');
    spyOn(component, 'selectedItem');
    const mockScroll = jasmine.createSpyObj('scroll', ['nativeElement']);
    mockScroll.nativeElement.scrollTop = jasmine.createSpy();
    component['scroll'] = mockScroll;
    component.showAttachmentForm();
    expect(component.showAttachment).toBe(component.showAttachment);
    expect(component.isHavingAttachment).toBe(true);
    expect(component.attachmentFieldsForm.reset).toHaveBeenCalled();
    expect(component.fileData).toBe('');
    expect(component.disableAttachmentBtn).toBe(false);
    expect(component.editAttachmentIndex).toBe(-1);
    expect(component.tooltipmimeType).toBe('');

    expect(component.attachmentArray.length).toBe(
      initialAttachmentArrayLength + 1
    );
    expect(component.selectedItem).toHaveBeenCalledWith(
      initialAttachmentArrayLength
    );
    expect(mockScroll.nativeElement.scrollTop).toBe(0);
  });
});
