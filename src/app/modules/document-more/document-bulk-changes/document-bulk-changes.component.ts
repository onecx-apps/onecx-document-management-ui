// Core imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Third party imports
import {
  Action,
  BreadcrumbService,
  PortalMessageService
} from '@onecx/portal-integration-angular';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, SelectItem } from 'primeng/api';

// Application imports
import {
  BulkUpdateDocumentRequestParams,
  DocumentControllerV1APIService,
  DocumentCreateUpdateDTO,
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
} from 'src/app/generated';
import { DocumentsChooseComponent } from './documents-choose/documents-choose.component';
import { DocumentsUpdateComponent } from './documents-update/documents-update.component';
import { DocumentsChooseModificationComponent } from './documents-choose-modification/documents-choose-modification.component';
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { UserDetailsService } from 'src/app/generated/api/user-details.service';

@Component({
  selector: 'app-document-bulk-changes',
  templateUrl: './document-bulk-changes.component.html',
  styleUrls: ['./document-bulk-changes.component.scss'],
})
export class DocumentBulkChangesComponent implements OnInit, OnDestroy {
  @ViewChild(DocumentsChooseComponent, { static: false })
  documentChooseComponent: DocumentsChooseComponent;
  @ViewChild(DocumentsChooseModificationComponent, { static: false })
  documentChooseModificationComponent: DocumentsChooseModificationComponent;
  @ViewChild(DocumentsUpdateComponent, { static: false })
  documentsUpdateComponent: DocumentsUpdateComponent;

  indexActive: number;
  isShow: boolean;
  isSubmitting = false;
  isChecked = false;
  radioCheck = false;
  documentBulkUpdateFormValid = false;
  subHeader = '';
  headerActions: Action[] = [];

  updateFormobject: DocumentCreateUpdateDTO;
  documentCreateUpdateDTO: DocumentCreateUpdateDTO;
  documentBulkForm: UntypedFormGroup;
  checkedArrayResults = [];
  validCheckedValues = [];
  menuItems: MenuItem[];
  updateFormArray: DocumentCreateUpdateDTO[] = [];
  selectedOperation = null;
  translatedData: any;
  allDocumentTypes: DocumentTypeDTO[];
  documentTypes: SelectItem[];
  loggedUserName: any;
  results: any;
  searchedResults: any;

  constructor(
    private readonly documentV1Service: DocumentControllerV1APIService,
    private readonly translateService: TranslateService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly portalMessageService: PortalMessageService,
    private readonly userDetailsService: UserDetailsService,
    private readonly dataSharingService: DataSharingService,
    private readonly documentTypeV1Service: DocumentTypeControllerV1APIService
  ) {}

  ngOnInit(): void {
    this.getTranslatedData();
    this.getLoggedInUserData();
    this.getSearchResult();
    this.documentBulkFormInitialize();
    this.documentBulkFormValueChange();
    this.loadAllDocumentTypes();
    this.setHeaderButtons();
  }

  /**
   * Get the translated data from the language files.
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER',
        'GENERAL.BACK',
        'GENERAL.CANCEL',
        'GENERAL.NEXT',
        'GENERAL.CONFIRM',
        'GENERAL.PROCESSING',
        'DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.DELETE_SUCCESS',
        'DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.BULK_ERROR',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_MODIFICATION_DETAILS',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_MODIFICATION_CAPTION',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_DOCUMENT_TYPE',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_DOCUMENT_VERSION',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_DOCUMENT_CHANNEL',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_DOCUMENT_SPECIFICATION',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_DOCUMENT_STATUS',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_DOCUMENT_INVOLVEMENT',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_OBJECT_REFERENCE_TYPE',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_OBJECT_REFERENCE_ID',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_ATTACHMENT_VALIDITY',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_DOCUMENT_DESCRIPTION',
        'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_ATTACHMENT_DESCRIPTION',
        'DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.UPDATE_SUCCESS',
        'DOCUMENT_SEARCH.MSG_NO_RESULTS',
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_DOCUMENT',
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_MODIFICATION',
      ])
      .subscribe((data) => {
        this.translatedData = data;
        this.breadcrumbService.setItems([
          {
            label: data[
              'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER'
            ] as string,
          },
        ]);
        this.initSteps();
      });
  }

  /**
   * Initialize the documentBulkUpdateForm controls
   */
  documentBulkFormInitialize() {
    this.documentBulkForm = this.formBuilder.group({
      documentBulkUpdateForm: this.formBuilder.group({
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
  }

  /**
   * Subscribe the values when the documentBulkUpdateForm values are modified
   */
  documentBulkFormValueChange(): void {
    this.documentBulkForm.valueChanges.subscribe(() => {
      const formControls =
        this.documentsUpdateComponent?.documentBulkUpdateForm?.controls;
      if (formControls?.valid) {
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'typeId'
        ].setValue(formControls['typeId']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'documentVersion'
        ].setValue(formControls['documentVersion']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'channelname'
        ].setValue(formControls['channelname']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'specificationName'
        ].setValue(formControls['specificationName']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'lifeCycleState'
        ].setValue(formControls['lifeCycleState']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'involvement'
        ].setValue(formControls['involvement']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'reference_type'
        ].setValue(formControls['reference_type']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'validity'
        ].setValue(formControls['validity']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'documentDescription'
        ].setValue(formControls['documentDescription']);
        this.documentsUpdateComponent.documentBulkUpdateForm.controls[
          'attachmentDescription'
        ].setValue(formControls['attachmentDescription']);
      }
    });
  }

  /**
   * function to set header buttons accroding to header actions
   */
  setHeaderButtons() {
    this.headerActions = [
      {
        label: this.translatedData['GENERAL.BACK'],
        title: this.translateService.instant('GENERAL.BACK'),
        show: 'always',
        icon: 'pi pi-arrow-left',
        conditional: true,
        showCondition: this.indexActive !== 0,
        disabled: this.isSubmitting,
        actionCallback: () => {
          this.OnBack();
        },
      },
      {
        label: this.translatedData['GENERAL.CANCEL'],
        title: this.translateService.instant('GENERAL.CANCEL'),
        show: 'always',
        icon: 'pi pi-times',
        disabled: this.isSubmitting,
        actionCallback: () => {
          this.onCancel();
        },
      },
      {
        label: this.setButton(),
        title: this.setButton(),
        icon: this.setIcon(),
        conditional: true,
        show: 'always',
        showCondition: true,
        disabled: this.buttonEnable(),

        actionCallback: () => {
          this.submitForm();
        },
      },
    ];
  }

  /**
   * function to enable button based on index value
   */
  buttonEnable(): boolean {
    return this.indexActive !== 2
      ? !this.canActivateNext || this.isSubmitting
      : this.canActive || this.isSubmitting;
  }

  /**
   * function to toggle text of button b/w next, confirm and processing icon
   */
  setButton(): string {
    if (this.indexActive !== 2) {
      return this.translatedData['GENERAL.NEXT'];
    } else if (this.isSubmitting) {
      return this.translatedData['GENERAL.PROCESSING'];
    } else {
      return this.translatedData['GENERAL.CONFIRM'];
    }
  }

  /**
   * Function sets icon dynamically
   */
  setIcon(): string {
    return this.isSubmitting ? 'pi pi-spin pi-spinner' : 'pi pi-chevron-right';
  }
  /**
   * Holds the event If any check box is selected from the documentChooseComponent
   * @param event takes true or false value
   */
  isCheck(event: boolean) {
    this.isChecked = event;
    this.setHeaderButtons();
  }

  /**
   * Holds the event If any radio button is selected from the documentChooseModificationComponent
   * @param event takes true or false value
   */
  isRadioCheck(event: boolean) {
    this.radioCheck = event;
    this.setHeaderButtons();
  }

  /**
   * Returns true or false based on stpes
   */
  get canActivateNext(): boolean {
    switch (this.indexActive) {
      case 0: {
        if (this.isChecked) {
          return true;
        }
        return false;
      }
      case 1: {
        if (this.radioCheck) {
          return true;
        }
        return false;
      }
      default:
        return false;
    }
  }

  /**
   * Returns true or false based on selected opration
   */
  get canActive(): boolean {
    switch (this.selectedOperation) {
      case 'A':
        if (!this.documentBulkUpdateFormValid) {
          return true;
        } else return false;
      case 'B':
        return false;
      default:
        return false;
    }
  }

  /**
   * Get all documents based on search criteria
   */
  getSearchResult(): void {
    let criteria = localStorage.getItem('searchCriteria');
    let isFiltered = localStorage.getItem('isFiltered');
    let searchResults = JSON.parse(localStorage.getItem('searchResults'));
    this.isShow = false;
    this.documentV1Service
      .getDocumentByCriteria(JSON.parse(criteria))
      .subscribe({
        next: (data: any) => {
          this.isShow = true;
          switch (isFiltered) {
            case 'A':
              this.dataSharingService.setSearchResults(searchResults);
              this.results = this.dataSharingService.getCreatedByMe(
                this.loggedUserName
              );
              this.dataSharingService.setSearchResults(this.results);
              break;
            case 'B':
              this.dataSharingService.setSearchResults(searchResults);
              this.results = this.dataSharingService.getRecentlyUpdated();
              this.dataSharingService.setSearchResults(this.results);
              break;
            default:
              this.dataSharingService.setSearchResults(searchResults);
              return;
          }

          if (data.stream.length === 0) {
            this.portalMessageService.success({
              summaryKey: 'DOCUMENT_SEARCH.MSG_NO_RESULTS',
            });
          }
        },
        error: (error) => {
          this.portalMessageService.success({
            summaryKey: 'DOCUMENT_SEARCH.MSG_NO_RESULTS',
          });
        },
      });
  }

  /**
   * Next button functionality on active steps
   */
  submitForm(): void {
    switch (this.indexActive) {
      case 0:
        this.indexActive = 1;
        this.checkedArrayResults =
          this.documentChooseComponent?.results?.filter(
            (item) => item['isChecked']
          );
        this.isSubmitting = false;
        this.setHeaderButtons();
        break;
      case 1:
        this.indexActive = 2;
        this.selectedOperation =
          this.documentChooseModificationComponent?.selectedValue?.key;
        this.isSubmitting = false;
        this.setHeaderButtons();
        break;
      case 2:
        this.onCheckBulkOperation();
        break;
      default:
        return;
    }
  }

  /**
   * Performs the suitable action based on the selected operation where 'A' denotes bulk document update operation and 'B' denotes bulk document delete operation
   */
  onCheckBulkOperation(): void {
    switch (this.selectedOperation) {
      case 'A':
        this.onConfirm();
        break;
      case 'B':
        this.onBulkDelete();
        break;
      default:
        return;
    }
  }

  /**
   * Initialize the steps activity
   */
  initSteps(): void {
    this.indexActive = this.indexActive || 0;
    this.menuItems = [
      {
        command: (event: any) => {
          this.indexActive = 0;
        },
      },
      {
        command: (event: any) => {
          this.indexActive = 1;
        },
      },
      {
        command: (event: any) => {
          this.indexActive = 2;
        },
      },
    ];
  }

  /**
   * Activate or deactivate the confirm button based on valid documentBulkUpdateForm values
   */
  onChangeFormValue(): void {
    this.validCheckedValues = [];
    let val = this.documentBulkForm.controls.documentBulkUpdateForm.value;
    const values = Object.entries(val);

    if (
      this.documentsUpdateComponent.checkedArray.length > 0 &&
      this.documentsUpdateComponent.documentBulkUpdateForm.valid
    ) {
      for (
        let i = 0;
        i < this.documentsUpdateComponent.checkedArray.length;
        i++
      ) {
        values.forEach((el) => {
          if (this.documentsUpdateComponent.checkedArray[i].name == el[0])
            this.documentsUpdateComponent.checkedArray[i].value = el[1];
        });
        let res = this.documentsUpdateComponent.checkedArray;
        if (
          res[i].value !== null &&
          res[i].value !== '' &&
          res[i].isChecked == true
        ) {
          this.validCheckedValues.push({
            name: res[i].name,
            value: res[i].value,
            isChecked: res[i].isChecked,
          });
        }
        if (
          res.find(
            (obj) => obj.value == null || (obj.value === '' && obj.isChecked)
          )
        )
          this.documentBulkUpdateFormValid = false;
        else this.documentBulkUpdateFormValid = true;
      }
    } else this.documentBulkUpdateFormValid = false;
    this.setHeaderButtons();
  }
  /**
   * function to get the logged in username
   */

  getLoggedInUserData() {
    this.userDetailsService.getLoggedInUsername().subscribe((data) => {
      this.loggedUserName = JSON.parse(JSON.stringify(data.userId));
    });
  }

  /**
   * Generates a custom document array of objects with user selected documents and then calls bulk update API
   */
  onConfirm(): void {
    const updateForm = this.documentsUpdateComponent.documentBulkUpdateForm;
    if (updateForm.value && updateForm.valid) {
      this.isSubmitting = true;
      this.checkedArrayResults.forEach((data) => {
        this.updateFormobject = this.createUpdateFormObject(data, updateForm);
        this.updateFormArray.push(this.updateFormobject);
      });
      this.documentBulkForm.disable();
      this.setHeaderButtons();
      this.onBulkUpdate(this.updateFormArray);
      this.dataSharingService.setUpdateModification([]);
    }
  }
  /**
   * function to create update object to push in updateFormArray
   * @param data
   * @param updateForm
   * @returns
   */
  createUpdateFormObject(data: any, updateForm: any): any {
    const updateFormObject: any = {
      id: data.id,
      name: data?.name,
      documentVersion: this.getUpdatedValue(
        'documentVersion',
        updateForm,
        data.documentVersion
      ),
      typeId: this.getUpdatedValue('typeId', updateForm, data.type.id),
      lifeCycleState: this.getUpdatedValue(
        'lifeCycleState',
        updateForm,
        data.lifeCycleState
      ),
      categories: [],
      characteristics: data.characteristics,
      description: this.getUpdatedValue(
        'documentDescription',
        updateForm,
        data.description
      ),
      documentRelationships: [],
      relatedParties: [],
      tags: [],
      specification: {
        name: this.getUpdatedValue(
          'specificationName',
          updateForm,
          data.specification?.name
        ),
        specificationVersion: null,
      },
      channel: {
        id: data.channel?.id,
        name: this.getUpdatedValue(
          'channelname',
          updateForm,
          data.channel?.name
        ),
      },
      relatedObject: {
        id: data.relatedObject?.id,
        involvement: this.getUpdatedValue(
          'involvement',
          updateForm,
          data.relatedObject?.involvement
        ),
        objectReferenceId: this.getUpdatedValue(
          'reference_id',
          updateForm,
          data.relatedObject?.objectReferenceId
        ),
        objectReferenceType: this.getUpdatedValue(
          'reference_type',
          updateForm,
          data.relatedObject?.objectReferenceType
        ),
      },
      attachments: data.attachments.map((el) => ({
        id: el.id,
        name: el?.name,
        description: this.getUpdatedValue(
          'attachmentDescription',
          updateForm,
          el?.description
        ),
        mimeTypeId: el.mimeType.id,
        validFor: {
          startDateTime: null,
          endDateTime: this.getUpdatedValue(
            'validity',
            updateForm,
            el.validFor?.endDateTime
          ),
        },
        fileName: el?.fileName,
      })),
    };
    return updateFormObject;
  }
  /**
   * function to return fieldValue on update
   * @param fieldName
   * @param updateForm
   * @param defaultValue
   * @returns
   */
  getUpdatedValue(fieldName: string, updateForm: any, defaultValue: any): any {
    const validCheckedValue = this.validCheckedValues.find(
      (val) => val.name === fieldName
    );
    const fieldValue = updateForm.value[fieldName];
    if (typeof fieldValue === 'string')
      return validCheckedValue ? fieldValue.trim() : defaultValue;
    else return validCheckedValue ? fieldValue : defaultValue;
  }

  /**
   * Performs document bulk update operation
   * @param data takes DocumentCreateUpdateDTO Array
   */
  onBulkUpdate(data: DocumentCreateUpdateDTO[]): void {
    const params: BulkUpdateDocumentRequestParams = {
      bulkDocumentCreateUpdateDTO: data,
    };

    this.documentV1Service.bulkUpdateDocument(params).subscribe({
      next: () => {
        this.portalMessageService.success({
          summaryKey: `${data.length} ${this.translatedData['DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.UPDATE_SUCCESS']}`,
        });
        this.documentBulkForm.enable();
        this.isSubmitting = false;
        this.router.navigate(['../../search'], {
          relativeTo: this.activeRoute,
        });
      },
      error: () => {
        this.portalMessageService.error({
          summaryKey:
            'DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.BULK_ERROR',
        });
        this.documentBulkForm.enable();
        this.isSubmitting = false;
      },
    });
  }

  /**
   * Navigates to the search page on cancel button click
   */
  onCancel(): void {
    this.router.navigate(['../../search'], {
      relativeTo: this.activeRoute,
    });
    this.dataSharingService.setUpdateModification([]);
  }

  /**
   * Decreses the active index number
   */
  OnBack() {
    if (this.indexActive > 0) this.indexActive--;
    this.setHeaderButtons();
  }

  /**
   * Performs document bulk delete operation
   */
  onBulkDelete() {
    this.isSubmitting = true;
    let checkedDocumentIds = [];
    this.checkedArrayResults.forEach((docs) => {
      checkedDocumentIds.push(docs.id);
    });
    this.documentV1Service
      .deleteBulkDocumentByIds(checkedDocumentIds)
      .subscribe({
        next: () => {
          this.portalMessageService.success({
            summaryKey: `${checkedDocumentIds.length} ${this.translatedData['DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.DELETE_SUCCESS']}`,
          });
          this.router.navigate(['../../search'], {
            relativeTo: this.activeRoute,
          });
        },
        error: () => {
          this.portalMessageService.error({
            summaryKey:
              'DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.BULK_ERROR',
          });
          this.isSubmitting = false;
        },
      });
  }
  /**
   * Wrapper method for loadAllDocumentTypes() to write Unit Test for this private method
   */
  public loadAllDocumentTypesWrapper(): void {
    this.loadAllDocumentTypes();
  }
  /**
   * function to load all document types to show in dropdown of document type form field
   */
  private loadAllDocumentTypes(): void {
    this.documentTypeV1Service.getAllTypesOfDocument().subscribe((results) => {
      this.allDocumentTypes = results;
      this.documentTypes = results.map((type) => ({
        label: type.name,
        value: type.id,
      }));
    });
  }
  /**
   * Invoved when the component is destroyed
   */
  ngOnDestroy(): void {
    this.dataSharingService.setModification('');
    localStorage.removeItem('searchCriteria');
    localStorage.removeItem('isFiltered');
    localStorage.removeItem('searchResults');
  }

  /**
   * function to render subheader dynamically based on index value on all 3 steps of bulk changes
   */
  renderSubheader() {
    if (this.indexActive === 0) {
      this.subHeader =
        this.translatedData[
          'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_DOCUMENT'
        ];
    } else if (this.indexActive === 1) {
      this.subHeader =
        this.translatedData[
          'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_MODIFICATION'
        ];
    } else if (this.indexActive === 2) {
      this.subHeader =
        this.translatedData[
          'DOCUMENT_DETAIL.BULK_UPDATE.UPDATE_MODIFICATION_DETAILS'
        ];
    }
    return this.subHeader;
  }
}
