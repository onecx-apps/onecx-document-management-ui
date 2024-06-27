import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import {
  createTranslateLoader,
  AppStateService,
} from '@onecx/portal-integration-angular';
import {
  PortalMessageServiceMock,
  providePortalMessageServiceMock,
} from '@onecx/portal-integration-angular/mocks';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { DocumentCreateComponent } from './document-create.component';
import { Router } from '@angular/router';
import { AttachmentUploadService } from '../attachment-upload.service';
import { of } from 'rxjs';

describe('DocumentCreateComponent', () => {
  let component: DocumentCreateComponent;
  let fixture: ComponentFixture<DocumentCreateComponent>;
  let router: Router;
  let portalMessageServiceMock: PortalMessageServiceMock;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [DocumentCreateComponent, TranslatePipeMock],
      providers: [providePortalMessageServiceMock(),
        { provide: TranslateService, useClass: TranslateServiceMock}],
    }).compileComponents();
    portalMessageServiceMock = TestBed.inject(PortalMessageServiceMock);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCreateComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be called onUpdateDocumentVersion', () => {
    component.onUpdateDocumentVersion('');
    expect(component.documentVersion).toBe('');
  });

  it('should set deleteDialogVisible on onCancelNo', () => {
    component.onCancelNo();
    expect(component.cancelDialogVisible).toBe(false);
  });

  it('should call onCancelYes', () => {
    const spy = spyOn(router, 'navigate');
    component.onCancelYes();
    expect(spy.calls.first().args[0]).toContain('../../search');
  });

  it('should set the index active to the clicked menu item index', () => {
    component.menuItems[1].command(null);
    expect(component.indexActive).toBe(1);
    component.menuItems[2].command(null);
    expect(component.indexActive).toBe(2);
    component.menuItems[0].command(null);
    expect(component.indexActive).toBe(0);
  });

  it('should set indexActive to 2 when initial value is 1', () => {
    component.indexActive = 1;
    component.submitForm();
    expect(component.indexActive).toBe(2);
    expect(component.isSubmitting).toBe(false);
  });

  it('should return true when indexActive is 0 and documentDescriptionIsValid is true', () => {
    component.indexActive = 0;
    component.documentDescriptionIsValid = true;
    const result = component.canActivateNext;
    expect(result).toBe(true);
  });

  it('should return true when indexActive is 1 and documentAttachmentComponent is false', () => {
    component.indexActive = 1;
    component.documentAttachmentComponent = undefined;
    const result = component.canActivateNext;
    expect(result).toBe(true);
  });

  it('should return false when indexActive is 1, documentAttachmentComponent is truthy and showAttachment is truthy but attachmentFieldsForm is invalid', () => {
    const mockAttachmentComponent = {
      showAttachment: true,
      attachmentFieldsForm: {
        valid: false,
      },
    };
    component.indexActive = 1;
    component.documentAttachmentComponent = mockAttachmentComponent as any;
    const result = component.canActivateNext;
    expect(result).toBe(false);
  });

  it('should return true for any other value of indexActive', () => {
    component.indexActive = 2;
    const result = component.canActivateNext;
    expect(result).toBe(true);
  });

  it('should set indexActive to 1 when initial value is 0', () => {
    component.indexActive = 0;
    component.submitForm();
    expect(component.indexActive).toBe(1);
    expect(component.isSubmitting).toBe(false);
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

  it('should create a deep copy of the array', () => {
    const originalArray = [1, 2, 3];
    const copiedArray = (component as any).deepCopyArray(originalArray);
    expect(copiedArray).toEqual(originalArray);
  });

  it('should decrease indexActive by 1 if indexActive is greater than 0', () => {
    component.indexActive = 2;
    component.navigateBack();
    expect(component.indexActive).toBe(1);
  });

  it('should not change indexActive if indexActive is 0', () => {
    component.indexActive = 0;
    component.navigateBack();
    expect(component.indexActive).toBe(0);
  });

  it('should return the filtered and unique characteristics data', () => {
    const mockFormData = [
      { name: 'Name 1', value: 'Value 1' },
      { name: 'Name 2', value: 'Value 2' },
      { name: 'Name 1', value: 'Value 1' },
      { name: 'Name 3', value: 'Value 3' },
    ];
    const formArray = new FormArray([]);
    mockFormData.forEach((data) => {
      formArray.push(
        new FormGroup({
          name: new FormControl(data.name),
          value: new FormControl(data.value),
        })
      );
    });
    const documentCharacteristicsComponentMock: any = {
      genericFormArray: formArray,
      isSubmitting: false,
      charactersticsArray: [],
      emptyTemplateObject: {},
      ngOnInit: jasmine.createSpy('ngOnInit'),
    };
    component.documentCharacteristicsComponent =
      documentCharacteristicsComponentMock;
    const result = component.getCharacteristicsData();
    expect(result).toEqual([
      { name: 'Name 1', value: 'Value 1' },
      { name: 'Name 2', value: 'Value 2' },
      { name: 'Name 3', value: 'Value 3' },
    ]);
  });

  it('should return an empty array if no characteristics data present', () => {
    const formArray = new FormArray([]);
    const documentCharacteristicsComponentMock: any = {
      genericFormArray: formArray,
      isSubmitting: false,
      charactersticsArray: [],
      emptyTemplateObject: {},
      ngOnInit: jasmine.createSpy('ngOnInit'),
    };
    component.documentCharacteristicsComponent =
      documentCharacteristicsComponentMock;
    const result = component.getCharacteristicsData();
    expect(result).toEqual([]);
  });

  it('should update indexActive to 1 and set isSubmitting to false when indexActive is 0', () => {
    component.submitForm();
    expect(component.indexActive).toBe(1);
    expect(component.isSubmitting).toBe(false);
  });

  it('should update indexActive to 2 and set isSubmitting to false when indexActive is 1', () => {
    component.indexActive = 1;
    component.submitForm();
    expect(component.indexActive).toBe(2);
    expect(component.isSubmitting).toBe(false);
  });

  it('should call onSubmit when indexActive is neither 0 nor 1', () => {
    component.indexActive = 2;
    spyOn(component, 'onSubmit');
    component.submitForm();
    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.indexActive).toBe(2);
    expect(component.isSubmitting).toBe(true);
  });

  it('should set cancelDialogVisible to true when there are document changes', () => {
    component.attachmentArray = [{}];
    component.onCancel({});
    expect(component.cancelDialogVisible).toBe(true);
  });

  it('should navigate to search page when there are no document changes', () => {
    spyOn(component['router'], 'navigate');
    component.onCancel({});
    expect(component['router'].navigate).toHaveBeenCalledWith(
      ['../../search'],
      {
        relativeTo: component['activeRoute'],
      }
    );
  });

  it('should navigate to search page when there are no document changes', () => {
    spyOn(component['router'], 'navigate');
    component.onCancel({});
    expect(component['router'].navigate).toHaveBeenCalledWith(
      ['../../search'],
      {
        relativeTo: component['activeRoute'],
      }
    );
  });

  it('should log an error when an exception occurs', () => {
    const attachmentArray = [];
    spyOn(console, 'error');
    const err = new Error('Test error');
    console.error(err);
    expect(console.error).toHaveBeenCalledWith(err);
  });

  it('should upload attachments successfully', () => {
    const documentId = '123';
    const mockAttachmentResponse = {
      attachmentResponse: {
        'file1.txt': 201,
        'file2.jpg': 201,
      },
    };
    const attachmentUploadService = TestBed.inject(AttachmentUploadService);
    spyOn(attachmentUploadService, 'uploadAttachment').and.returnValue(
      of(mockAttachmentResponse)
    );
    component.callUploadAttachmentsApi(documentId);
    expect(attachmentUploadService.uploadAttachment).toHaveBeenCalledWith(
      documentId,
      jasmine.any(Array)
    );
    expect(portalMessageServiceMock.lastMessages[0]).toEqual({
      type: 'success',
      value: { summaryKey: jasmine.any(String) },
    });
  });

  it('should handle failed attachments and export them', () => {
    const documentId = '123';
    const mockAttachmentResponse = {
      attachmentResponse: {
        'file1.txt': 201,
        'file2.jpg': 400,
      },
    };
    const attachmentUploadService = TestBed.inject(AttachmentUploadService);
    spyOn(attachmentUploadService, 'uploadAttachment').and.returnValue(
      of(mockAttachmentResponse)
    );
    spyOn(attachmentUploadService, 'exportAllFailedAttachments');
    component.callUploadAttachmentsApi(documentId);
    expect(
      attachmentUploadService.exportAllFailedAttachments
    ).toHaveBeenCalledWith(documentId);
  });
});
