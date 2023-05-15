import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from '@onecx/portal-integration-angular';
import { MenuItem, MessageService } from 'primeng/api';
import {
  catchError,
  defaultIfEmpty,
  forkJoin,
  map,
  mergeMap,
  tap,
  throwError,
} from 'rxjs';
import {
  AttachmentDTO,
  BulkUpdateDocumentRequestParams,
  DocumentControllerV1APIService,
  DocumentCreateUpdateDTO,
  DocumentDetailDTO,
  UpdateDocumentRequestParams,
} from 'src/app/generated';
import { ActivatedRoute, Router } from '@angular/router';
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
  public documentChooseComponent: DocumentsChooseComponent;
  @ViewChild(DocumentsChooseModificationComponent, { static: false })
  public documentChooseModificationComponent: DocumentsChooseModificationComponent;
  @ViewChild(DocumentsUpdateComponent, { static: false })
  public documentsUpdateComponent: DocumentsUpdateComponent;

  translatedData: any;
  menuItems: MenuItem[];
  indexActive: number;
  documentBulkForm: UntypedFormGroup;

  isSubmitting = false;
  isChecked = false;
  radioCheck = false;
  checkedArrayResults = [];
  updateFormArray: DocumentCreateUpdateDTO[] = [];
  updateFormobject: DocumentCreateUpdateDTO;
  documentCreateUpdateDTO: DocumentCreateUpdateDTO;
  selectedOperation = null;
  documentBulkUpdateFormValid = false;
  validCheckedValues = [];
  isShow: boolean;
  constructor(
    private readonly documentRESTAPIService: DocumentControllerV1APIService,
    private readonly translateService: TranslateService,
    private readonly breadCrumbService: BreadcrumbService,
    private fb: UntypedFormBuilder,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly messageService: MessageService,
    private service: DataSharingService
  ) {}

  ngOnInit(): void {
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
        this.breadCrumbService.setItems([
          {
            label: data[
              'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER'
            ] as string,
          },
        ]);
        this.initSteps();
        this.getSearchResult();
      });
    this.documentBulkForm = this.fb.group({
      documentBulkUpdateForm: this.fb.group({
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
    this.documentBulkForm.valueChanges.subscribe(() => {
      const formControls =
        this.documentsUpdateComponent.documentBulkUpdateForm.controls;
      if (formControls.valid) {
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
  isCheck(event: boolean) {
    this.isChecked = event;
  }
  isRadioCheck(event: boolean) {
    this.radioCheck = event;
  }

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
    }
  }
  get canActive(): boolean {
    switch (this.selectedOperation) {
      case 'A':
        if (!this.documentBulkUpdateFormValid) {
          return true;
        } else return false;
      case 'B':
        return false;
    }
  }
  getSearchResult() {
    let criteria = localStorage.getItem('searchCriteria');
    this.isShow = false;
    this.documentRESTAPIService
      .getDocumentByCriteria(JSON.parse(criteria))
      .subscribe({
        next: (data: any) => {
          this.isShow = true;
          this.service.setSearchResults([...data.stream]);
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
    }
  }

  onCheckBulkOperation(): void {
    switch (this.selectedOperation) {
      case 'A':
        this.onConfirm();
        break;
      case 'B':
        this.onBulkDelete();
        break;
    }
  }

  public initSteps(): void {
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
        values.map((el) => {
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
  }

  public onConfirm(): void {
    let updateForm = this.documentsUpdateComponent.documentBulkUpdateForm;
    if (updateForm.value && updateForm.valid) {
      this.isSubmitting = true;
      this.checkedArrayResults.map((data) => {
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

  public onBulkUpdate(data: DocumentCreateUpdateDTO[]): void {
    const params: BulkUpdateDocumentRequestParams = {
      bulkDocumentCreateUpdateDTO: data,
    };

    this.documentRESTAPIService.bulkUpdateDocument(params).subscribe({
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

  onCancel() {
    this.router.navigate(['../../search'], {
      relativeTo: this.activeRoute,
    });
  }

  OnBack(): void {
    if (this.indexActive > 0) this.indexActive--;
  }

  onBulkDelete(): any {
    this.isSubmitting = true;
    let checkedDocumentIds = [];
    this.checkedArrayResults.forEach((docs) => {
      checkedDocumentIds.push(docs.id);
    });
    this.documentRESTAPIService
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

  ngOnDestroy(): void {
    this.service.setModification('');
    localStorage.removeItem('searchCriteria');
  }
}
