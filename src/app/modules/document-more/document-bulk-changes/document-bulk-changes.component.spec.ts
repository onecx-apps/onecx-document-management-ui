import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import {
  DocumentControllerV1APIService,
  DocumentTypeControllerV1APIService,
  LifeCycleState,
} from 'src/app/generated';
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { DocumentBulkChangesComponent } from './document-bulk-changes.component';
import { UserDetailsService } from 'src/app/generated/api/user-details.service';

describe('DocumentBulkChangesComponent', () => {
  let component: DocumentBulkChangesComponent;
  let fixture: ComponentFixture<DocumentBulkChangesComponent>;
  let router: Router;
  let formBuilder: FormBuilder;
  let httpMock: HttpTestingController;
  let documentService: DocumentControllerV1APIService;
  let dataSharingService: DataSharingService;
  let messageService: MessageService;
  let userDetailsService: UserDetailsService;
  let documentTypeV1Service: DocumentTypeControllerV1APIService;

  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentBulkChangesComponent, TranslatePipeMock],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
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
        MessageService,
        DataSharingService,
        DocumentControllerV1APIService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DocumentBulkChangesComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    documentService = TestBed.inject(DocumentControllerV1APIService);
    dataSharingService = TestBed.inject(DataSharingService);
    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);
    formBuilder = TestBed.inject(FormBuilder);
    userDetailsService = TestBed.inject(UserDetailsService);
    documentTypeV1Service = TestBed.inject(DocumentTypeControllerV1APIService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return true when selectedOperation is "A" and documentBulkUpdateFormValid is false', () => {
    component.selectedOperation = 'A';
    component.documentBulkUpdateFormValid = false;
    const canActive = component.canActive;
    expect(canActive).toBe(true);
  });

  it('should return false when selectedOperation is "A" and "B" and documentBulkUpdateFormValid is true', () => {
    component.selectedOperation = 'A';
    component.selectedOperation = 'B';
    component.documentBulkUpdateFormValid = true;
    const canActive = component.canActive;
    expect(canActive).toBe(false);
  });

  it('should return undefined for other values of selectedOperation', () => {
    component.selectedOperation = 'C';
    const canActive = component.canActive;
    expect(canActive).toBeUndefined();
  });

  it('should return true when indexActive is 0 and isChecked is true', () => {
    component.indexActive = 0;
    component.isChecked = true;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBe(true);
  });

  it('should return false when indexActive is 0 and isChecked is false', () => {
    component.indexActive = 0;
    component.isChecked = false;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBe(false);
  });

  it('should return true when indexActive is 1 and radioCheck is true', () => {
    component.indexActive = 1;
    component.radioCheck = true;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBe(true);
  });

  it('should return false when indexActive is 1 and radioCheck is false', () => {
    component.indexActive = 1;
    component.radioCheck = false;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBe(false);
  });

  it('should return undefined for other values of indexActive', () => {
    component.indexActive = 2;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBeUndefined();
  });

  it('should call getTranslatedData, getSearchResult, documentBulkFormInitialize, and documentBulkFormValueChange', () => {
    spyOn(component, 'getTranslatedData');
    spyOn(component, 'getLoggedInUserData');
    spyOn(component, 'getSearchResult');
    spyOn(component, 'documentBulkFormInitialize');
    spyOn(component, 'documentBulkFormValueChange');
    spyOn(component, 'setHeaderButtons');
    component.ngOnInit();
    expect(component.getTranslatedData).toHaveBeenCalled();
    expect(component.getLoggedInUserData).toHaveBeenCalled();
    expect(component.getSearchResult).toHaveBeenCalled();
    expect(component.documentBulkFormInitialize).toHaveBeenCalled();
    expect(component.documentBulkFormValueChange).toHaveBeenCalled();
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should call onConfirm() when selectedOperation is "A"', () => {
    spyOn(component, 'onConfirm');
    component.selectedOperation = 'A';
    component.onCheckBulkOperation();
    expect(component.onConfirm).toHaveBeenCalled();
  });

  it('should call onBulkDelete() when selectedOperation is "B"', () => {
    spyOn(component, 'onBulkDelete');
    component.selectedOperation = 'B';
    component.onCheckBulkOperation();
    expect(component.onBulkDelete).toHaveBeenCalled();
  });

  it('should do nothing when selectedOperation is neither "A" nor "B"', () => {
    spyOn(component, 'onConfirm');
    spyOn(component, 'onBulkDelete');
    component.selectedOperation = 'C';
    component.onCheckBulkOperation();
    expect(component.onConfirm).not.toHaveBeenCalled();
    expect(component.onBulkDelete).not.toHaveBeenCalled();
  });

  it('should set indexActive to 0 if it is undefined', () => {
    component.indexActive = undefined;
    component.initSteps();
    expect(component.indexActive).toBe(0);
  });

  it('should not change indexActive if it is already defined', () => {
    component.indexActive = 1;
    component.initSteps();
    expect(component.indexActive).toBe(1);
  });

  it('should set menuItems with the correct commands', () => {
    component.initSteps();
    expect(component.menuItems.length).toBe(3);
    expect(component.menuItems[0].command).toBeDefined();
    expect(component.menuItems[1].command).toBeDefined();
    expect(component.menuItems[2].command).toBeDefined();
  });

  it('should set indexActive correctly when a menu item command is called', () => {
    component.initSteps();
    component.menuItems[0].command(null);
    expect(component.indexActive).toBe(0);
    component.menuItems[1].command(null);
    expect(component.indexActive).toBe(1);
    component.menuItems[2].command(null);
    expect(component.indexActive).toBe(2);
  });

  it('should navigate to search page', () => {
    const spy = spyOn(router, 'navigate');
    component.onCancel();
    expect(spy.calls.first().args[0]).toContain('../../search');
  });

  it('should return false in all other cases', () => {
    component.indexActive = 0;
    component.isChecked = false;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBe(false);
  });

  it('should set subHeader correctly when indexActive is 0', () => {
    component.indexActive = 0;
    component.translatedData = {
      'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_DOCUMENT':
        'Choose Document',
    };
    const subHeader = component.renderSubheader();
    expect(subHeader).toBe('Choose Document');
  });

  it('should set subHeader correctly when indexActive is 1', () => {
    component.indexActive = 1;
    component.translatedData = {
      'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_MODIFICATION':
        'Choose Modification',
    };
    const subHeader = component.renderSubheader();
    expect(subHeader).toBe('Choose Modification');
  });

  it('should set subHeader correctly when indexActive is 2', () => {
    component.indexActive = 2;
    component.translatedData = {
      'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_MODIFICATION_DETAILS':
        'Update Modification Details',
    };
    const subHeader = component.renderSubheader();
    expect(subHeader).toBe('Update Modification Details');
  });

  it('should update isChecked property and call setHeaderButtons()', () => {
    const event = true;
    spyOn(component, 'setHeaderButtons');
    component.isCheck(event);
    expect(component.isChecked).toBe(event);
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should return true when indexActive is 1 and radioCheck is true', () => {
    component.indexActive = 1;
    component.radioCheck = true;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBe(true);
  });

  it('should return false when indexActive is 1 and radioCheck is false', () => {
    component.indexActive = 1;
    component.radioCheck = false;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBe(false);
  });

  it('should return undefined when indexActive is neither 0 nor 1', () => {
    component.indexActive = 2;
    const canActivateNext = component.canActivateNext;
    expect(canActivateNext).toBeUndefined();
  });

  it('should return true when selectedOperation is "A" and documentBulkUpdateFormValid is false', () => {
    component.selectedOperation = 'A';
    component.documentBulkUpdateFormValid = false;
    const canActive = component.canActive;
    expect(canActive).toBe(true);
  });

  it('should return false when selectedOperation is "A" and documentBulkUpdateFormValid is true', () => {
    component.selectedOperation = 'A';
    component.documentBulkUpdateFormValid = true;
    const canActive = component.canActive;
    expect(canActive).toBe(false);
  });

  it('should return false when selectedOperation is "B"', () => {
    component.selectedOperation = 'B';
    const canActive = component.canActive;
    expect(canActive).toBe(false);
  });

  it('should return undefined when selectedOperation is neither "A" nor "B"', () => {
    component.selectedOperation = 'C';
    const canActive = component.canActive;
    expect(canActive).toBeUndefined();
  });

  it('should update indexActive to 1, reset isSubmitting, and call setHeaderButtons() when indexActive is 0', () => {
    component.indexActive = 0;
    spyOn(component, 'setHeaderButtons');
    component.submitForm();
    expect(component.indexActive).toBe(1);
    expect(component.isSubmitting).toBe(false);
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should update indexActive to 2, reset isSubmitting, and call setHeaderButtons() when indexActive is 1', () => {
    component.indexActive = 1;
    spyOn(component, 'setHeaderButtons');
    component.submitForm();
    expect(component.indexActive).toBe(2);
    expect(component.isSubmitting).toBe(false);
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should call onCheckBulkOperation() when indexActive is 2', () => {
    component.indexActive = 2;
    spyOn(component, 'onCheckBulkOperation');
    component.submitForm();
    expect(component.onCheckBulkOperation).toHaveBeenCalled();
  });

  it('should do nothing when indexActive is neither 0, 1, nor 2', () => {
    component.indexActive = 3;
    spyOn(component, 'setHeaderButtons');
    spyOn(component, 'onCheckBulkOperation');
    component.submitForm();
    expect(component.setHeaderButtons).not.toHaveBeenCalled();
    expect(component.onCheckBulkOperation).not.toHaveBeenCalled();
  });

  it('should set radioCheck and call setHeaderButtons()', () => {
    const event = true;
    spyOn(component, 'setHeaderButtons');
    component.isRadioCheck(event);
    expect(component.radioCheck).toBe(true);
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should return fieldValue if it is a string and validCheckedValue exists', () => {
    component.validCheckedValues = [{ name: 'fieldName' }];
    const fieldName = 'fieldName';
    const updateForm = { value: { fieldName: 'updatedValue' } };
    const defaultValue = 'defaultValue';
    const result = component.getUpdatedValue(
      fieldName,
      updateForm,
      defaultValue
    );
    expect(result).toBe('updatedValue');
  });

  it('should return trimmed fieldValue if it is a string, validCheckedValue exists, and trimming is required', () => {
    component.validCheckedValues = [{ name: 'fieldName' }];
    const fieldName = 'fieldName';
    const updateForm = { value: { fieldName: '  updatedValue  ' } };
    const defaultValue = 'defaultValue';
    const result = component.getUpdatedValue(
      fieldName,
      updateForm,
      defaultValue
    );
    expect(result).toBe('updatedValue');
  });

  it('should return defaultValue if fieldValue is a string but validCheckedValue does not exist', () => {
    component.validCheckedValues = [];
    const fieldName = 'fieldName';
    const updateForm = { value: { fieldName: 'updatedValue' } };
    const defaultValue = 'defaultValue';
    const result = component.getUpdatedValue(
      fieldName,
      updateForm,
      defaultValue
    );
    expect(result).toBe('defaultValue');
  });

  it('should return fieldValue if it is not a string and validCheckedValue exists', () => {
    component.validCheckedValues = [{ name: 'fieldName' }];
    const fieldName = 'fieldName';
    const updateForm = { value: { fieldName: 123 } };
    const defaultValue = 'defaultValue';
    const result = component.getUpdatedValue(
      fieldName,
      updateForm,
      defaultValue
    );
    expect(result).toBe(123);
  });

  it('should return defaultValue if fieldValue is not a string and validCheckedValue does not exist', () => {
    component.validCheckedValues = [];
    const fieldName = 'fieldName';
    const updateForm = { value: { fieldName: 123 } };
    const defaultValue = 'defaultValue';
    const result = component.getUpdatedValue(
      fieldName,
      updateForm,
      defaultValue
    );
    expect(result).toBe('defaultValue');
  });

  it('should decrement indexActive by 1 and call setHeaderButtons() when indexActive > 0', () => {
    component.indexActive = 2;
    spyOn(component, 'setHeaderButtons');
    component.OnBack();
    expect(component.indexActive).toBe(1);
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should not decrement indexActive and call setHeaderButtons() when indexActive <= 0', () => {
    component.indexActive = 0;
    spyOn(component, 'setHeaderButtons');
    component.OnBack();
    expect(component.indexActive).toBe(0);
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should set isSubmitting to false', () => {
    component.documentBulkForm = component['formBuilder'].group({
      documentBulkUpdateForm: component['formBuilder'].group({
        typeId: [''],
        documentVersion: [''],
        channelname: [''],
        specificationName: [''],
        lifeCycleState: [''],
        involvement: [null],
        reference_type: [null],
        reference_id: [null],
        validity: [null],
        documentDescription: [''],
        attachmentDescription: [''],
      }),
    });
    component.onBulkUpdate([]);
    expect(component.isSubmitting).toEqual(false);
  });

  it('should be called onBulkDelete', () => {
    component.onBulkDelete();
    expect(component.isSubmitting).toEqual(true);
  });

  it('should check documentBulkForm is defined', () => {
    component.documentBulkFormInitialize();
    expect(component.documentBulkForm).toBeDefined();
  });

  it('should call getDocumentByCriteria service and return response', () => {
    spyOn(documentService, 'getDocumentByCriteria').and.returnValue(
      of('test' as any)
    );
    component.getSearchResult();
    expect(documentService.getDocumentByCriteria).toHaveBeenCalled();
  });

  it('should call getLoggedInUsername and check loggedUserName is updated', () => {
    const userId = 'admin';
    spyOn(userDetailsService, 'getLoggedInUsername').and.returnValue(
      of({ userId })
    );
    component.getLoggedInUserData();
    expect(userDetailsService.getLoggedInUsername).toHaveBeenCalled();
    expect(component.loggedUserName).toBe('admin');
  });

  it('should call setHeaderButtons and set isSubmitting flag to false', () => {
    const mockUpdateDocumentComponent = {
      documentBulkUpdateForm: component['formBuilder'].group({
        typeId: 1,
        documentVersion: 1,
        channelname: 'Channel1',
        specificationName: 'SpecificationTest',
        lifeCycleState: LifeCycleState.ARCHIVED,
        involvement: 'InvolvementTest',
        reference_type: 'ReferenceTypeOne',
        reference_id: '1234',
        validity: '',
        documentDescription: '',
        attachmentDescription: '',
      }),
    };
    component.documentBulkForm =
      mockUpdateDocumentComponent.documentBulkUpdateForm;
    component.getTranslatedData();
    component.documentsUpdateComponent = mockUpdateDocumentComponent as any;
    spyOn(component, 'setHeaderButtons');
    component.onConfirm();
    expect(component.isSubmitting).toBe(true);
    expect(component.setHeaderButtons).toHaveBeenCalled();
  });

  it('should set header buttons with correct labels, titles, icons, conditions, and callbacks', () => {
    component.indexActive = 1;
    component.isSubmitting = false;
    component.translatedData = {
      'GENERAL.BACK': 'Back',
      'GENERAL.CANCEL': 'Cancel',
    };
    component.OnBack = jasmine.createSpy('OnBack');
    component.onCancel = jasmine.createSpy('onCancel');
    component.submitForm = jasmine.createSpy('submitForm');
    component.setHeaderButtons();
    const backButton = component.headerActions[0];
    backButton.actionCallback();
    expect(component.OnBack).toHaveBeenCalled();
    const cancelButton = component.headerActions[1];
    cancelButton.actionCallback();
    expect(component.onCancel).toHaveBeenCalled();
    const submitButton = component.headerActions[2];
    submitButton.actionCallback();
    expect(component.submitForm).toHaveBeenCalled();
  });

  it('should check return value not to be isSubmitting when indexActive is 0', () => {
    component.indexActive = 0;
    component.isSubmitting = false;
    const returnValue = component.buttonEnable();
    expect(returnValue).toBe(!component.isSubmitting);
  });

  it('should check return value when isSubmitting is false', () => {
    component.isSubmitting = false;
    const returnValue = component.setIcon();
    expect(returnValue).toBe('pi pi-chevron-right');
  });

  it('should check return value when isSubmitting is true', () => {
    component.isSubmitting = true;
    const returnValue = component.setIcon();
    expect(returnValue).toBe('pi pi-spin pi-spinner');
  });

  it('should check returnValue to be defined', () => {
    const data = {
      id: '1',
      name: 'fieldName',
      type: { id: '1' },
      attachments: [],
    };
    const updateForm = { value: { fieldName: 'updatedValue' } };
    const returnValue = component.createUpdateFormObject(data, updateForm);
    expect(returnValue).toBeDefined();
  });

  it('should call setModification', () => {
    spyOn(dataSharingService, 'setModification');
    component.ngOnDestroy();
    expect(dataSharingService.setModification).toHaveBeenCalled();
  });

  it('should check typeId value to be 1', () => {
    const mockUpdateDocumentComponent = {
      documentBulkUpdateForm: component['formBuilder'].group({
        typeId: 1,
        documentVersion: 1,
        channelname: 'Channel1',
        specificationName: 'SpecificationTest',
        lifeCycleState: LifeCycleState.ARCHIVED,
        involvement: 'InvolvementTest',
        reference_type: 'ReferenceTypeOne',
        reference_id: '1234',
        validity: '',
        documentDescription: '',
        attachmentDescription: '',
      }),
    };
    component.documentBulkForm =
      mockUpdateDocumentComponent.documentBulkUpdateForm;
    component.documentsUpdateComponent = mockUpdateDocumentComponent as any;
    component.documentBulkFormValueChange();
    expect(
      component.documentsUpdateComponent.documentBulkUpdateForm.controls[
        'typeId'
      ].value
    ).toBe(1);
  });
  it('should load all document types', fakeAsync(() => {
    const mockDocumentTypes = [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' },
    ];

    spyOn(documentTypeV1Service, 'getAllTypesOfDocument').and.returnValue(
      of(mockDocumentTypes as any)
    );

    component.loadAllDocumentTypesWrapper();
    tick();

    expect(component.documentTypes).toEqual([
      { label: 'Type 1', value: 1 },
      { label: 'Type 2', value: 2 },
    ]);
  }));

  it('should subscribe to documentBulkForm value changes and update the documentsUpdateComponent form controls', () => {
    const mockFormValue = {
      typeId: '1',
      documentVersion: '1.0',
      channelname: 'Channel 1',
      specificationName: 'Specification 1',
      lifeCycleState: 'Active',
      involvement: 'Involvement 1',
      reference_type: 'Reference Type 1',
      validity: 'Validity 1',
      documentDescription: 'Description 1',
      attachmentDescription: 'Attachment 1',
    };

    const mockDocumentsUpdateComponent = {
      documentBulkUpdateForm: formBuilder.group({
        typeId: '1',
        documentVersion: '1.0',
        channelname: 'Channel 1',
        specificationName: 'Specification 1',
        lifeCycleState: 'Active',
        involvement: 'Involvement 1',
        reference_type: 'Reference Type 1',
        validity: 'Validity 1',
        documentDescription: 'Description 1',
        attachmentDescription: 'Attachment 1',
      }),
    };
    component.documentBulkForm = formBuilder.group({
      documentBulkUpdateForm: formBuilder.group(mockFormValue),
    });
    spyOn(
      component.documentBulkForm.valueChanges,
      'subscribe'
    ).and.callThrough();
    spyOnProperty(
      mockDocumentsUpdateComponent.documentBulkUpdateForm,
      'valid',
      'get'
    ).and.returnValue(true);
    component.documentBulkFormValueChange();
    component.documentBulkForm.controls['documentBulkUpdateForm'].setValue(
      mockFormValue
    );
    expect(
      component.documentBulkForm.valueChanges.subscribe
    ).toHaveBeenCalled();
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls['typeId']
        .value
    ).toBe(mockFormValue.typeId);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'documentVersion'
      ].value
    ).toBe(mockFormValue.documentVersion);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'channelname'
      ].value
    ).toBe(mockFormValue.channelname);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'specificationName'
      ].value
    ).toBe(mockFormValue.specificationName);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'lifeCycleState'
      ].value
    ).toBe(mockFormValue.lifeCycleState);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'involvement'
      ].value
    ).toBe(mockFormValue.involvement);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'reference_type'
      ].value
    ).toBe(mockFormValue.reference_type);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls['validity']
        .value
    ).toBe(mockFormValue.validity);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'documentDescription'
      ].value
    ).toBe(mockFormValue.documentDescription);
    expect(
      mockDocumentsUpdateComponent.documentBulkUpdateForm.controls[
        'attachmentDescription'
      ].value
    ).toBe(mockFormValue.attachmentDescription);
  });
});
