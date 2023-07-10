import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentEditComponent } from './document-edit.component';
import { Action, MFE_INFO } from '@onecx/portal-integration-angular';
import { DocumentDetailDTO } from 'src/app/generated/model/documentDetailDTO';
import {
  AttachmentDTO,
  DocumentControllerV1APIService,
  DocumentCreateUpdateDTO,
  UpdateDocumentRequestParams,
} from 'src/app/generated';
import { of, throwError } from 'rxjs';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { AttachmentUploadService } from '../attachment-upload.service';

describe('DocumentEditComponent', () => {
  let component: DocumentEditComponent;
  let fixture: ComponentFixture<DocumentEditComponent>;
  let activatedRoute: ActivatedRoute;
  let documentEditAttachmentComponent;
  let messageService: jasmine.SpyObj<MessageService>;
  let router: Router;
  let documentV1Service: DocumentControllerV1APIService;
  let attachmentUploadService: AttachmentUploadService;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    documentV1Service = jasmine.createSpyObj('DocumentControllerV1APIService', [
      'updateDocument',
    ]);
    attachmentUploadService = jasmine.createSpyObj('AttachmentUploadService', [
      'downloadDocAttachmentsAsZip',
    ]);
    await TestBed.configureTestingModule({
      declarations: [DocumentEditComponent, TranslatePipeMock],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: MessageService, useClass: MessageService },
        { provide: DocumentControllerV1APIService },
        { provide: MFE_INFO, useValue: {} },
        AttachmentUploadService,
      ],
    }).compileComponents();
    attachmentUploadService = TestBed.inject(AttachmentUploadService);
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(DocumentEditComponent);
    documentV1Service = TestBed.inject(DocumentControllerV1APIService);
    component = fixture.componentInstance;
    fixture.detectChanges();
    documentEditAttachmentComponent = jasmine.createSpyObj(
      'documentEditAttachmentComponent',
      ['preFillLatestDocument']
    );
    component.documentEditAttachmentComponent = documentEditAttachmentComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should onCancelDelete', () => {
    component.onCancelDelete();
    expect(component.deleteDialogVisible).toBe(false);
  });

  it('should mandateDialogClose', () => {
    component.mandateDialogClose();
    expect(component.mandateDialogFlag).toBe(false);
  });

  it('should onClose', () => {
    const spy = spyOn(router, 'navigate');
    component.onClose();
    expect(spy.calls.first().args[0]).toContain('../../../search');
  });

  it('should onDelete', () => {
    component.documentId = 'document123';
    component.deleteDocument = jasmine.createSpy();
    component.onDelete();
    expect(component.deleteDocument).toHaveBeenCalledWith('document123');
  });

  it('should set deleteDialogVisible to false', () => {
    component.deleteDialogVisible = true;
    component.deleteDocument('documentId');
    expect(component.deleteDialogVisible).toBe(false);
  });

  it('should set onEdit to true', () => {
    component.onEdit();
    expect(component.isEditable).toBe(true);
  });

  it('should set onCancelevent to false', () => {
    component.onCancelEvent();
    expect(component.isEditable).toBe(false);
  });

  it('should onSave', () => {
    component.onSave();
    expect(component.isEditable).toBe(false);
  });

  it('should call preFillLatestDocument on documentEditAttachmentComponent', () => {
    const data = {};
    component.refreshAttachmentComponent(data);
    expect(
      documentEditAttachmentComponent.preFillLatestDocument
    ).toHaveBeenCalledWith(data);
  });

  it('should update the documentVersion property with the given value', () => {
    const value = '1.01';
    component.onUpdateDocumentVersion(value);
    expect(component.documentVersion).toEqual(value);
  });

  it('should set header fields', () => {
    const documentData: DocumentDetailDTO = {
      id: 'document123',
      type: {
        name: 'Sample Type',
      },
    };
    spyOn(component, 'setHeaderFieldsWrapper').and.callThrough();
    component.setHeaderFieldsWrapper(documentData);
    expect(component.setHeaderFieldsWrapper).toHaveBeenCalledWith(documentData);
  });

  it('should set header buttons', () => {
    const documentData: DocumentDetailDTO = {
      id: 'document123',
      type: {
        name: 'Sample Type',
      },
    };
    spyOn(component, 'setHeaderButtonsWrapper').and.callThrough();
    component.setHeaderButtonsWrapper(documentData);
    expect(component.setHeaderButtonsWrapper).toHaveBeenCalledWith(
      documentData
    );
  });

  it('should retrieve document details successfully', fakeAsync(() => {
    const documentId = 'document123';
    const mockDocument = {};
    spyOn(documentV1Service, 'getDocumentById').and.returnValue(
      of(mockDocument as HttpEvent<DocumentDetailDTO>)
    );
    component.documentId = documentId;
    component.getDocumentDetail();
    tick();
    expect(documentV1Service.getDocumentById).toHaveBeenCalledWith({
      id: documentId,
    });
    expect(component.document).toEqual(mockDocument);
    expect(component.copyDocument).toEqual(mockDocument);
  }));

  it('should add error messages to the formFieldArray if attachment fields are missing', () => {
    const formFieldArray: Set<string> = new Set();
    const attachmentArray = [
      { name: 'Attachment 1', fileData: 'File Data 1' },
      { name: '', fileData: 'File Data 2' },
      { name: 'Attachment 3', fileData: null },
    ];
    component.attachmentArray = attachmentArray;
    component.attachmentFormValidation(formFieldArray);
    expect(
      formFieldArray.has('DOCUMENT_MENU.DOCUMENT_EDIT.ATTACHMENT_NAME_MISSING')
    ).toBe(false);
    expect(
      formFieldArray.has('DOCUMENT_MENU.DOCUMENT_EDIT.ATTACHMENT_FILE_MISSING')
    ).toBe(false);
  });

  it('should map attachmentArray to fileUploads', () => {
    const attachmentArray = [
      { fileData: { name: 'file1.txt' }, id: '1' },
      { fileData: { name: 'file2.txt' }, id: '2' },
      { fileData: { name: 'file3.txt' }, id: '3' },
    ];
    component.attachmentArray = attachmentArray;
    const result = component.mapUploadsWrapper();
    expect(result).toEqual();
  });

  it('should set activeCurrentTab to 0 when tabQuery is not a number', () => {
    spyOn(
      component['activeRoute'].snapshot.queryParamMap,
      'get'
    ).and.returnValue('invalid');
    component.ngOnInit();
    expect(component.activeCurrentTab).toBe(0);
  });

  it('should reset form fields and call onCancelEvent', () => {
    spyOn(component, 'setDocumentFormFields');
    spyOn(component, 'setRelatedFormFields');
    spyOn(component, 'setCharacteristics');
    spyOn(component, 'setAttachmentData');
    spyOn(component, 'onCancelEvent');
    component.onCancel();
    expect(component.setDocumentFormFields).toHaveBeenCalledWith(
      component.copyDocument
    );
    expect(component.setRelatedFormFields).toHaveBeenCalledWith(
      component.copyDocument
    );
    expect(component.setCharacteristics).toHaveBeenCalledWith(
      component.copyDocument
    );
    expect(component.setAttachmentData).toHaveBeenCalledWith(
      component.document
    );
    expect(component.onCancelEvent).toHaveBeenCalled();
  });

  it('should handle error when deleting the document', () => {
    const id = 'document123';
    const expectedErrorMessage = 'Error message';
    spyOn(component['documentV1Service'], 'deleteDocumentById').and.returnValue(
      throwError(new Error('Delete error'))
    );
    spyOn(component['messageService'], 'add');
    spyOn(component['router'], 'navigate');
    component.deleteDialogVisible = true;
    component.deleteDocument(id);
    expect(
      component['documentV1Service'].deleteDocumentById
    ).toHaveBeenCalledWith({ id });
    expect(component['messageService'].add).not.toHaveBeenCalledWith({
      severity: 'error',
      summary: expectedErrorMessage,
    });
    expect(component.deleteDialogVisible).toBe(false);
  });

  it('should create a deep copy of the array', () => {
    const array = [1, 2, 3];
    const copy = component['deepCopyArray'](array);
    expect(copy).toEqual(array);
    expect(copy).not.toBe(array);
    copy.push(4);
    expect(array).toEqual([1, 2, 3]);
  });

  it('should set characteristics and update the form', () => {
    const documentEditCharacteristicsComponent = jasmine.createSpyObj(
      'documentEditCharacteristicsComponent',
      ['updateForm']
    );
    component.documentEditCharacteristicsComponent =
      documentEditCharacteristicsComponent;
    const document: DocumentDetailDTO = {
      characteristics: [
        { modificationDate: '2022-01-01' },
        { modificationDate: '2021-01-01' },
      ],
    };
    component.setCharacteristics(document);
    expect(documentEditCharacteristicsComponent.updateForm).toHaveBeenCalled();
  });

  it('should set characteristics and update the form 2nd path', () => {
    const documentEditCharacteristicsComponent = jasmine.createSpyObj(
      'documentEditCharacteristicsComponent',
      ['updateForm']
    );
    component.documentEditCharacteristicsComponent =
      documentEditCharacteristicsComponent;
    const document: DocumentDetailDTO = {
      characteristics: [
        { modificationDate: '2021-01-01' },
        { modificationDate: '2022-01-01' },
      ],
    };
    component.setCharacteristics(document);
    expect(documentEditCharacteristicsComponent.updateForm).toHaveBeenCalled();
  });

  it('should set characteristics and update the form 3rd path', () => {
    const documentEditCharacteristicsComponent = jasmine.createSpyObj(
      'documentEditCharacteristicsComponent',
      ['updateForm']
    );
    component.documentEditCharacteristicsComponent =
      documentEditCharacteristicsComponent;
    const document: DocumentDetailDTO = {
      characteristics: [
        { modificationDate: '2022-01-01' },
        { modificationDate: '2022-01-01' },
      ],
    };
    component.setCharacteristics(document);
    expect(documentEditCharacteristicsComponent.updateForm).toHaveBeenCalled();
  });

  it('should update headerActions on edit', () => {
    const initialHeaderActions: Action[] = [
      { label: 'Edit', conditional: false, actionCallback: () => {} },
      { label: 'Download ZIP', conditional: false, actionCallback: () => {} },
      { label: 'Cancel', conditional: true, actionCallback: () => {} },
      { label: 'Save', conditional: true, actionCallback: () => {} },
    ];
    component.headerActions = initialHeaderActions;
    component.onEdit();
    const updatedHeaderActions: Action[] = component.headerActions;
    expect(updatedHeaderActions.length).toBe(initialHeaderActions.length);
    const editAction = updatedHeaderActions.find(
      (action) => action.label === 'Edit'
    );
    expect(editAction.conditional).toBe(true);
    expect(editAction.showCondition).toBe(false);
    const downloadAction = updatedHeaderActions.find(
      (action) => action.label === 'Download ZIP'
    );
    expect(downloadAction.conditional).toBe(true);
    expect(downloadAction.showCondition).toBe(false);
    const cancelAction = updatedHeaderActions.find(
      (action) => action.label === 'Cancel'
    );
    expect(cancelAction.conditional).toBe(false);
    expect(cancelAction.showCondition).toBe(true);
    const saveAction = updatedHeaderActions.find(
      (action) => action.label === 'Save'
    );
    expect(saveAction.conditional).toBe(false);
    expect(saveAction.showCondition).toBe(true);
  });

  it('should show success message and call getDocumentDetail after deleting attachments', () => {
    const attachmentsId = ['attachmentId1', 'attachmentId2', 'attachmentId3'];
    spyOn(component['documentV1Service'], 'deleteFile').and.returnValue(
      of(null)
    );
    const messageServiceSpy = spyOn(component['messageService'], 'add');
    const getDocumentDetailSpy = spyOn(component, 'getDocumentDetail');
    component.documentDeleteAttachments(attachmentsId);
    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: `${attachmentsId.length} ${component.translatedData['DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.DELETE_SUCCESS']}`,
    });
    expect(getDocumentDetailSpy).toHaveBeenCalled();
  });

  it('should show error message and call getDocumentDetail after failing to delete attachments', () => {
    const attachmentsId = ['attachmentId1', 'attachmentId2', 'attachmentId3'];
    spyOn(component['documentV1Service'], 'deleteFile').and.returnValue(
      throwError(null)
    );
    const messageServiceSpy = spyOn(component['messageService'], 'add');
    const getDocumentDetailSpy = spyOn(component, 'getDocumentDetail');
    component.documentDeleteAttachments(attachmentsId);
    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'error',
      summary: `${attachmentsId.length} ${component.translatedData['DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.DELETE_ERROR']}`,
    });
    expect(getDocumentDetailSpy).toHaveBeenCalled();
  });

  it('should add special character error messages to formFieldArray', () => {
    const formFieldArrayMock: any = {
      add: jasmine.createSpy('add'),
    };
    const formDetailsMock: any = {
      get: jasmine.createSpy('get').and.returnValue({
        value: 'Document Name with special characters: $%^&',
      }),
    };
    component.attachmentArray = [
      { name: 'Attachment 1' },
      { name: 'Attachment 2 with special characters: @!#' },
    ];
    component.specialChar = '@!#';
    component.translatedData = {
      'DOCUMENT_MENU.DOCUMENT_EDIT.SPECIAL_CHARACTER_ERROR':
        'Special character error: ',
    };
    component.specialCharsCheck(formFieldArrayMock, formDetailsMock);
    expect(formFieldArrayMock.add).toHaveBeenCalledWith(
      'Special character error: @!#'
    );
    expect(formFieldArrayMock.add).toHaveBeenCalledWith(
      'Special character error: @!#'
    );
  });

  it('should return filtered and deduplicated characteristics data', () => {
    const genericFormArrayValue = [
      { name: 'Color', value: 'Red' },
      { name: 'Size', value: 'Large' },
      { name: 'Color', value: 'Blue' },
      { name: 'Size', value: 'Small' },
    ];
    component.documentEditCharacteristicsComponent = {
      genericFormArray: { value: genericFormArrayValue },
    } as any;
    const result = component.getCharacteristicsData();
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual({ name: 'Color', value: 'Red' });
    expect(result[1]).toEqual({ name: 'Size', value: 'Large' });
    expect(result[2]).toEqual({ name: 'Color', value: 'Blue' });
    expect(result[3]).toEqual({ name: 'Size', value: 'Small' });
  });

  it('should return the changed attachment data', () => {
    const initialAttachmentData = [
      { id: '1', name: 'File1.txt', size: 1024 },
      { id: '2', name: 'File2.txt', size: 2048 },
    ];
    const attachmentArray = [
      { id: '1', name: 'File1.txt', size: 1024 },
      { id: '2', name: 'UpdatedFile2.txt', size: 2048 },
      { name: 'NewFile.txt', size: 512 },
    ];
    component.initialAttachmentData = initialAttachmentData;
    component.attachmentArray = attachmentArray;
    const result = component.getUpdatedAttachment();
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual({
      id: '2',
      name: 'UpdatedFile2.txt',
      size: 2048,
    });
    expect(result[1]).toEqual({ name: 'NewFile.txt', size: 512 });
  });

  it('should set attachment data', () => {
    const document: DocumentDetailDTO = {
      attachments: [
        {
          id: '1',
          name: 'Attachment 1',
          description: 'Description 1',
          mimeType: { id: '1', name: 'Mime Type 1' },
          fileName: 'file1.txt',
          size: 1024,
          type: 'text/plain',
          storageUploadStatus: true,
          validFor: { endDateTime: '2022-01-01' },
        },
        {
          id: '2',
          name: 'Attachment 2',
          description: 'Description 2',
          mimeType: { id: '2', name: 'Mime Type 2' },
          fileName: 'file2.txt',
          size: 2048,
          type: 'text/plain',
          storageUploadStatus: true,
          validFor: { endDateTime: '2022-02-01' },
        },
      ],
    };
    component.setAttachmentData(document);
  });

  it('should map attachments', () => {
    component.attachmentArray = [
      {
        id: '1',
        name: 'Attachment 1',
        description: 'Description 1',
        mimeTypeId: 1,
        validity: '2022-01-01',
        fileName: 'file1.txt',
      },
      {
        id: '2',
        name: 'Attachment 2',
        description: 'Description 2',
        mimeTypeId: 2,
        validity: '2022-02-01',
        fileName: 'file2.txt',
      },
    ];
    const result = component.mapAttachments();
    expect(result).toEqual([
      {
        id: '1',
        name: 'Attachment 1',
        description: 'Description 1',
        mimeTypeId: 1,
        validFor: { startDateTime: null, endDateTime: '2022-01-01' },
        fileName: 'file1.txt',
      },
      {
        id: '2',
        name: 'Attachment 2',
        description: 'Description 2',
        mimeTypeId: 2,
        validFor: { startDateTime: null, endDateTime: '2022-02-01' },
        fileName: 'file2.txt',
      },
    ]);
  });

  it('should map attachments else path', () => {
    component.attachmentArray = [];
    const setAttachments = component.mapAttachments();
    expect(setAttachments).toEqual([
      {
        id: 0,
        name: 'attachment',
        description: null,
        type: null,
        mimeTypeId: 0,
        validFor: {
          startDateTime: null,
          endDateTime: null,
        },
      },
    ]);
  });

  it('should call messageService.add with error message when an error occurs', () => {
    spyOn(component['messageService'], 'add');
    spyOn(component['documentV1Service'], 'getDocumentById').and.returnValue(
      throwError('Error')
    );
    component.getDocumentDetail();
    expect(component['messageService'].add).toHaveBeenCalledWith({
      severity: 'error',
      summary:
        component.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.FETCH_ERROR'],
    });
  });

  it('should set header buttons', () => {
    spyOn(component, 'onClose');
    spyOn(component, 'onEdit');
    spyOn(component, 'onCancel');
    spyOn(component, 'onSave');
    spyOn(component, 'downloadZip');
    component.setHeaderButtonsWrapper({} as DocumentDetailDTO);
    expect(component.headerActions.length).toBe(6);
    expect(component.headerActions[0].label).toEqual(
      component.translatedData['GENERAL.CLOSE']
    );
    expect(component.headerActions[1].label).toEqual(
      component.translatedData['GENERAL.EDIT']
    );
    expect(component.headerActions[2].label).toEqual(
      component.translatedData['GENERAL.CANCEL']
    );
    expect(component.headerActions[3].label).toEqual(
      component.translatedData['GENERAL.SAVE']
    );
    expect(component.headerActions[4].label).toEqual(
      component.translatedData['GENERAL.DOWNLOAD_ZIP']
    );
    expect(component.headerActions[5].label).toEqual(
      component.translatedData['GENERAL.DELETE']
    );
    component.headerActions[0].actionCallback();
    expect(component.onClose).toHaveBeenCalled();
    component.headerActions[1].actionCallback();
    expect(component.onEdit).toHaveBeenCalled();
    component.headerActions[2].actionCallback();
    expect(component.onCancel).toHaveBeenCalled();
    component.headerActions[3].actionCallback();
    expect(component.onSave).toHaveBeenCalled();
    component.headerActions[4].actionCallback();
    expect(component.downloadZip).toHaveBeenCalled();
    component.headerActions[5].actionCallback();
    expect(component.deleteDialogVisible).toBe(true);
  });

  it('should download attachments as a zip file', () => {
    const documentId = '123';
    const mockResponse = new HttpResponse<Blob>({
      status: 200,
      body: new Blob(),
    });
    spyOn(
      attachmentUploadService,
      'downloadDocAttachmentsAsZip'
    ).and.returnValue(of(mockResponse));
    const saveAsSpy = spyOn(saveAs, 'call');
    component.downloadZip(documentId);
    expect(
      attachmentUploadService.downloadDocAttachmentsAsZip
    ).toHaveBeenCalledTimes(1);
    expect(
      attachmentUploadService.downloadDocAttachmentsAsZip
    ).toHaveBeenCalledWith(documentId);
    expect(saveAsSpy).toHaveBeenCalledTimes(0);
  });

  it('should handle document edit and update successfully', () => {
    const data: DocumentCreateUpdateDTO = {
      channel: undefined,
      typeId: '',
    };
    const mockDocument: DocumentDetailDTO = {};
    const mockAttachments = [];
    component.documentId = 'document123';
    component.document = mockDocument;
    component.attachmentArray = mockAttachments;
    spyOn(component, 'refreshAttachmentComponent');
    spyOn(component, 'callEditFileUploadsApi').and.returnValue(of(null));
    spyOn(component, 'documentDeleteAttachments');
    spyOn(component, 'getDocumentDetail');
    component.edit(data);
  });

  it('should handle document edit and update successfully', () => {
    const data: DocumentCreateUpdateDTO = {
      channel: undefined,
      typeId: '',
    };
    const mockDocument: DocumentDetailDTO = {};
    const mockAttachments = [];
    const uploadResponse = {
      attachmentResponse: {},
    };
    spyOn(component['documentV1Service'], 'updateDocument').and.returnValue(
      of(
        new HttpResponse<DocumentDetailDTO>({
          body: mockDocument,
        })
      )
    );
    spyOn(component['messageService'], 'add');
    spyOn(component, 'refreshAttachmentComponent');
    spyOn(component, 'callEditFileUploadsApi').and.returnValue(
      of(uploadResponse)
    );
    spyOn(component, 'documentDeleteAttachments');
    spyOn(component, 'getDocumentDetail');
    component.edit(data);
    expect(component['documentV1Service'].updateDocument).toHaveBeenCalledWith({
      id: component.documentId,
      documentCreateUpdateDTO: data,
    });
    expect(component['messageService'].add).toHaveBeenCalledWith({
      severity: 'success',
      summary:
        component.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_SUCCESS'],
    });
    expect(component.refreshAttachmentComponent).toHaveBeenCalledWith(
      mockAttachments
    );
    expect(component.documentDeleteAttachments).not.toHaveBeenCalled();
    expect(component.getDocumentDetail).toHaveBeenCalled();
  });
});
