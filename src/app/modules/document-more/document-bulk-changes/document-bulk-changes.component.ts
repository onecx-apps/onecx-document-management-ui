// Core imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Third party imports
import { BreadcrumbService } from '@onecx/portal-integration-angular';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem, MessageService } from 'primeng/api';

// Application imports
import {
  BulkUpdateDocumentRequestParams,
  DocumentControllerV1APIService,
  DocumentCreateUpdateDTO,
} from 'src/app/generated';
import { DocumentsChooseComponent } from './documents-choose/documents-choose.component';
import { DocumentsUpdateComponent } from './documents-update/documents-update.component';
import { DocumentsChooseModificationComponent } from './documents-choose-modification/documents-choose-modification.component';
import { DataSharingService } from 'src/app/shared/data-sharing.service';

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

  updateFormobject: DocumentCreateUpdateDTO;
  documentCreateUpdateDTO: DocumentCreateUpdateDTO;
  documentBulkForm: UntypedFormGroup;
  checkedArrayResults = [];
  validCheckedValues = [];
  menuItems: MenuItem[];
  updateFormArray: DocumentCreateUpdateDTO[] = [];
  selectedOperation = null;
  translatedData: any;

  constructor(
    private readonly documentV1Service: DocumentControllerV1APIService,
    private readonly translateService: TranslateService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.getTranslatedData();
    this.getSearchResult();
    this.documentBulkFormInitialize();
    this.documentBulkFormValueChange();
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
   * Holds the event If any check box is selected from the documentChooseComponent
   * @param event takes true or false value
   */
  isCheck(event: boolean) {
    this.isChecked = event;
  }

  /**
   * Holds the event If any radio button is selected from the documentChooseModificationComponent
   * @param event takes true or false value
   */
  isRadioCheck(event: boolean) {
    this.radioCheck = event;
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
    this.isShow = false;
    this.documentV1Service
      .getDocumentByCriteria(JSON.parse(criteria))
      .subscribe({
        next: (data: any) => {
          this.isShow = true;
          this.dataSharingService.setSearchResults([...data.stream]);
          if (data.stream.length === 0) {
            this.messageService.add({
              severity: 'success',
              summary: this.translatedData['DOCUMENT_SEARCH.MSG_NO_RESULTS'],
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translatedData['DOCUMENT_SEARCH.MSG_NO_RESULTS'],
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
        this.checkedArrayResults = this.documentChooseComponent.results?.filter(
          (item) => item['isChecked']
        );
        this.isSubmitting = false;
        break;
      case 1:
        this.indexActive = 2;
        this.selectedOperation =
          this.documentChooseModificationComponent.selectedValue.key;
        this.isSubmitting = false;
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
            (obj) =>
              obj.value == null || (obj.value === '' && obj.isChecked == true)
          )
        )
          this.documentBulkUpdateFormValid = false;
        else this.documentBulkUpdateFormValid = true;
      }
    } else this.documentBulkUpdateFormValid = false;
    this.dataSharingService.setUpdateModification(this.validCheckedValues);
    this.documentsUpdateComponent.initializeCheckedStatus();
  }

  /**
   * Generates a custom document array of objects with user selected documents and then calls bulk update API
   */
  onConfirm(): void {
    let updateForm = this.documentsUpdateComponent.documentBulkUpdateForm;
    if (updateForm.value && updateForm.valid) {
      this.isSubmitting = true;
      this.checkedArrayResults.forEach((data) => {
        this.updateFormobject = {
          id: data.id,
          name: data?.name,
          documentVersion: this.validCheckedValues.some(
            (val) => val.name == 'documentVersion'
          )
            ? updateForm.value.documentVersion
            : data?.documentVersion,
          typeId: this.validCheckedValues.some((val) => val.name == 'typeId')
            ? updateForm.value.typeId
            : data.type.id,
          lifeCycleState: this.validCheckedValues.some(
            (val) => val.name == 'lifeCycleState'
          )
            ? updateForm.value.lifeCycleState
            : data?.lifeCycleState,
          categories: [],
          characteristics: data?.characteristics,
          description: this.validCheckedValues.some(
            (val) => val.name == 'documentDescription'
          )
            ? updateForm.value.documentDescription.trim()
            : data?.description,
          documentRelationships: [],
          relatedParties: [],
          tags: [],
          specification: {
            name: this.validCheckedValues.some(
              (val) => val.name == 'specificationName'
            )
              ? updateForm.value.specificationName.trim()
              : data.specification?.name,
            specificationVersion: null,
          },
          channel: {
            id: data.channel?.id,
            name: this.validCheckedValues.some(
              (val) => val.name == 'channelname'
            )
              ? updateForm.value.channelname.trim()
              : data.channel?.name,
          },
          relatedObject: {
            id: data.relatedObject?.id,
            involvement: this.validCheckedValues.some(
              (val) => val.name == 'involvement'
            )
              ? updateForm.value.involvement.trim()
              : data.relatedObject?.involvement,
            objectReferenceId: this.validCheckedValues.some(
              (val) => val.name == 'reference_id'
            )
              ? updateForm.value.reference_id.trim()
              : data.relatedObject?.objectReferenceId,
            objectReferenceType: this.validCheckedValues.some(
              (val) => val.name == 'reference_type'
            )
              ? updateForm.value.reference_type.trim()
              : data.relatedObject?.objectReferenceType,
          },
          attachments: data.attachments.map((el) => ({
            id: el.id,
            name: el?.name,
            description: this.validCheckedValues.some(
              (val) => val.name == 'attachmentDescription'
            )
              ? updateForm.value.attachmentDescription.trim()
              : el?.description,
            mimeTypeId: el.mimeType.id,
            validFor: {
              startDateTime: null,
              endDateTime: this.validCheckedValues.some(
                (val) => val.name == 'validity'
              )
                ? updateForm.value.validity
                : el.validFor?.endDateTime,
            },
            fileName: el?.fileName,
          })),
        };
        this.updateFormArray.push(this.updateFormobject);
      });
      this.documentBulkForm.disable();
      this.onBulkUpdate(this.updateFormArray);
    }
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
        this.messageService.add({
          severity: 'success',
          summary: `${data.length} ${this.translatedData['DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.UPDATE_SUCCESS']}`,
        });
        this.documentBulkForm.enable();
        this.isSubmitting = false;
        this.router.navigate(['../../search'], {
          relativeTo: this.activeRoute,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: `${this.translatedData['DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.BULK_ERROR']}`,
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
  }

  /**
   * Decreses the active index number
   */
  OnBack() {
    if (this.indexActive > 0) this.indexActive--;
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
          this.messageService.add({
            severity: 'success',
            summary: `${checkedDocumentIds.length} ${this.translatedData['DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.DELETE_SUCCESS']}`,
          });
          this.router.navigate(['../../search'], {
            relativeTo: this.activeRoute,
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: `${this.translatedData['DOCUMENT_MENU.DOCUMENT_MORE.SELECTED_DOCUMENTS.BULK_ERROR']}`,
          });
          this.isSubmitting = false;
        },
      });
  }

  /**
   * Invoved when the component is destroyed
   */
  ngOnDestroy(): void {
    this.dataSharingService.setModification('');
    localStorage.removeItem('searchCriteria');
  }
}
