import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { providePortalMessageServiceMock } from '@onecx/portal-integration-angular/mocks';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { DocumentQuickUploadFormComponent } from './document-quick-upload-form.component';

describe('DocumentQuickUploadFormComponent', () => {
  let component: DocumentQuickUploadFormComponent;
  let fixture: ComponentFixture<DocumentQuickUploadFormComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentQuickUploadFormComponent, TranslatePipeMock],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [{ provide: TranslateService, useClass: TranslateServiceMock }, providePortalMessageServiceMock()],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentQuickUploadFormComponent);
    component = fixture.componentInstance;

    component.documentQuickUploadForm = new FormGroup({
      controlName: new FormControl(),
    });

    component.attachmentArray = [];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTranslatedData and getMimetype', () => {
    spyOn(component, 'getTranslatedData');
    spyOn(component, 'getMimetype');
    component.ngOnInit();
    expect(component.getTranslatedData).toHaveBeenCalled();
    expect(component.getMimetype).toHaveBeenCalled();
  });

  it('should trim the value and set it in the form control', () => {
    const mockEvent = {
      target: {
        getAttribute: () => 'controlName',
        value: '  trimmedValue  ',
      },
    };
    component.trimSpace(mockEvent);
    expect(
      component.documentQuickUploadForm.controls['controlName'].value
    ).toBe('trimmedValue');
  });

  it('should prevent the default event', () => {
    const eventMock = jasmine.createSpyObj('Event', ['preventDefault']);
    component.allowDrop(eventMock);
    expect(eventMock.preventDefault).toHaveBeenCalled();
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

  it('should disable the create button if any invalid attachment exists', () => {
    const invalidAttachment = { isValid: false };
    component.attachmentArray = [invalidAttachment];
    spyOn(component.enableCreateButton, 'emit');
    component.validateAttachmentArray();
    expect(component.enableCreateButton.emit).toHaveBeenCalledWith(false);
  });

  it('should enable the create button if all attachments are valid', () => {
    const validAttachment = { isValid: true };
    component.attachmentArray = [validAttachment];
    spyOn(component.enableCreateButton, 'emit');
    component.validateAttachmentArray();
    expect(component.enableCreateButton.emit).toHaveBeenCalledWith(true);
  });

  it('should disable the create button if the attachment array is empty', () => {
    component.attachmentArray = [];
    spyOn(component.enableCreateButton, 'emit');
    component.validateAttachmentArray();
    expect(component.enableCreateButton.emit).toHaveBeenCalledWith(false);
  });

  it('should add file in the attachmentArray', () => {
    const file = {
      name: 'Hello World.pdf',
      size: 106569,
      type: 'application/pdf',
    };
    component.supportedMimeType = [{ label: 'application/pdf', value: 1 }];
    component.enterDataToListView(file);
    expect(component.attachmentArray.length).toBe(1);
    expect(component.attachmentArray[0]).toEqual({
      name: 'Hello World.pdf',
      mimeType: 'application/pdf',
      mimeTypeId: 1,
      validity: '',
      description: '',
      fileData: file,
      isValid: true,
      fileName: 'Hello World.pdf',
    });
  });

  it('should emit selectedFileList with false', () => {
    const emitSpy = spyOn(component.selectedFileList, 'emit');
    const event = {
      target: {
        files: [{ name: 'file1.txt' }, { name: 'file2.txt' }],
      },
    };
    component.addFile(event);
    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should call enterDataToListView for each file', () => {
    const enterDataSpy = spyOn(component, 'enterDataToListView');
    const event = {
      target: {
        files: [{ name: 'file1.txt' }, { name: 'file2.txt' }],
      },
    };
    component.addFile(event);
    expect(enterDataSpy).toHaveBeenCalledTimes(2);
    expect(enterDataSpy).toHaveBeenCalledWith({ name: 'file1.txt' });
    expect(enterDataSpy).toHaveBeenCalledWith({ name: 'file2.txt' });
  });

  it('should call validateAttachmentArray', () => {
    const validateSpy = spyOn(component, 'validateAttachmentArray');
    const event = {
      target: {
        files: [{ name: 'file1.txt' }],
      },
    };
    component.addFile(event);
    expect(validateSpy).toHaveBeenCalled();
  });

  it('should call enterDataToListView for each file in dataTransfer', () => {
    const files = [{ name: 'file1.txt' }, { name: 'file2.png' }];
    const dataTransfer = {
      files,
    };
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      dataTransfer,
    };
    spyOn(component, 'enterDataToListView');
    component.dropFile(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.enterDataToListView).toHaveBeenCalledTimes(files.length);
    expect(component.enterDataToListView).toHaveBeenCalledWith(files[0]);
    expect(component.enterDataToListView).toHaveBeenCalledWith(files[1]);
  });

  it('should call validateAttachmentArray', () => {
    const event = {
      preventDefault: jasmine.createSpy('preventDefault'),
      dataTransfer: { files: [] },
    };

    spyOn(component, 'validateAttachmentArray');

    component.dropFile(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.validateAttachmentArray).toHaveBeenCalled();
  });

  it('should sort files based on validation status', () => {
    const validAttachment = { isValid: true };
    const invalidAttachment = { isValid: false };
    component.attachmentArray = [];
    component.attachmentArray.push(validAttachment);
    component.attachmentArray.push(invalidAttachment);
    component.sortAttachmentArray();
    expect(component.attachmentArray[0]).toBe(invalidAttachment);
    expect(component.attachmentArray[1]).toBe(validAttachment);
  });
});
