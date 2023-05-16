import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from '@onecx/portal-integration-angular';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { of, throwError } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  DocumentCreateUpdateDTO,
  DocumentControllerV1APIService,
  AttachmentDTO,
  TimePeriodDTO,
  AttachmentCreateUpdateDTO,
} from 'src/app/generated';
import { AttachmentUploadService } from '../attachment-upload.service';

import { DocumentCharacteristicsComponent } from '../document-create/document-characteristics/document-characteristics.component';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DocumentAttachmentComponent } from './document-attachment/document-attachment.component';

@Component({
  selector: 'app-document-create',
  templateUrl: './document-create.component.html',
  styleUrls: ['./document-create.component.scss'],
  providers: [ConfirmationService],
})
export class DocumentCreateComponent implements OnInit {
  @ViewChild(DocumentAttachmentComponent, { static: false })
  public documentAttachmentComponent: DocumentAttachmentComponent;

  @ViewChild(DocumentCharacteristicsComponent, { static: false })
  public documentCharacteristicsComponent: DocumentCharacteristicsComponent;
  translatedData: any;
  menuItems: MenuItem[];
  indexActive: number;
  documentCreateForm: UntypedFormGroup;
  isSubmitting = false;
  public documentDescriptionIsValid = false;
  documentCreateUpdateDTO: DocumentCreateUpdateDTO;
  attachmentArray: any = [];
  charactersticsArray: any = [];
  documentVersion;
  subscriptions: any;
  constructor(
    private readonly translateService: TranslateService,
    private readonly breadCrumbService: BreadcrumbService,
    private readonly documentRESTAPIService: DocumentControllerV1APIService,
    private readonly messageService: MessageService,
    private readonly attachmentUploadService: AttachmentUploadService,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_CREATE.CREATE_SUCCESS',
        'DOCUMENT_MENU.DOCUMENT_CREATE.CREATE_ERROR',
        'DOCUMENT_MENU.DOCUMENT_CREATE.HEADER',
        'DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_SUCCESS',
        'DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_ERROR',
        'DOCUMENT_DETAIL.DOCUMENT_CANCEL_MODAL.CANCEL_CONFIRM_MESSAGE',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_SUCCESS',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_ERROR',
        'GENERAL.PROCESSING',
      ])
      .subscribe((data) => {
        this.translatedData = data;
        this.breadCrumbService.setItems([
          { label: data['DOCUMENT_MENU.DOCUMENT_CREATE.HEADER'] as string },
        ]);
        this.initSteps();
      });

    // Form Validations
    this.documentCreateForm = this.fb.group({
      documentDescriptionForm: this.fb.group({
        name: ['', Validators.required],
        typeId: ['', Validators.required],
        documentVersion: ['', Validators.min(0)],
        channelname: ['', Validators.required],
        specificationName: [''],
        lifeCycleState: ['DRAFT'],
        description: ['', Validators.maxLength(1000)],
        involvement: [null],
        reference_type: [null],
        reference_id: [null],
      }),
    });
    this.documentCreateForm.valueChanges.subscribe(() => {
      const formControls = this.documentCreateForm.controls;
      this.documentDescriptionIsValid =
        formControls.documentDescriptionForm.valid;
    });
    this.initSteps();
  }

  get canActivateNext(): boolean {
    switch (this.indexActive) {
      case 0:
        if (this.documentDescriptionIsValid) {
          return true;
        }
        return false;
      case 1:
        if (this.documentAttachmentComponent?.showAttachment) {
          return (
            this.documentAttachmentComponent.attachmentFieldsForm.valid &&
            !this.documentAttachmentComponent.showAttachment
          );
        } else {
          return true;
        }
      default:
        return true;
    }
  }

  submitForm(): void {
    this.isSubmitting = true;
    switch (this.indexActive) {
      case 0:
        this.indexActive = 1;
        this.isSubmitting = false;
        break;
      case 1:
        this.indexActive = 2;
        this.isSubmitting = false;
        break;
      default:
        this.onSubmit();
    }
  }
  onSaveSubmit() {
    if (this.isSubmitting) {
      return 1;
    } else return 0;
  }

  /**
   * Returns set of attachment array that user has uploaded
   */

  private mapAttachments(): AttachmentCreateUpdateDTO[] {
    let setAttachments = [];
    let attachmentsArray = [];
    try {
      attachmentsArray = this.attachmentArray.map((element) => ({
        name: element.name,
        description: element.description,
        mimeTypeId: element.mimeTypeId,
        validFor: { startDateTime: null, endDateTime: element.validity },
        fileName: element.fileName,
      }));

      if (attachmentsArray.length !== 0) {
        setAttachments = attachmentsArray;
      } else {
        setAttachments = [
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
        ];
      }
      return setAttachments;
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Returns set of files array that user has uploaded
   */
  private mapUploads() {
    let fileUploads = [];
    try {
      fileUploads = this.attachmentArray.map((element) => ({
        file: element.fileData,
      }));
      return fileUploads;
    } catch (err) {
      console.error(err);
    }
  }

  public onSubmit(): void {
    this.documentCreateUpdateDTO = {
      ...this.documentCreateForm.value.documentDescriptionForm,
      categories: [],
      characteristics: this.getCharacteristicsData(),
      documentRelationships: [],
      relatedParties: [],
      tags: [],
      channel: {
        id: null,
        name: this.documentCreateForm.value.documentDescriptionForm.channelname,
      },
      specification: {
        name: this.documentCreateForm.value.documentDescriptionForm
          .specificationName,
        specificationVersion: null,
      },
      relatedObject: {
        id: null,
        involvement:
          this.documentCreateForm.value.documentDescriptionForm.involvement,
        objectReferenceId:
          this.documentCreateForm.value.documentDescriptionForm.reference_id,
        objectReferenceType:
          this.documentCreateForm.value.documentDescriptionForm.reference_type,
      },
      attachments: this.mapAttachments(),
    };
    this.documentCreateUpdateDTO.documentVersion = this.documentVersion;
    this.callCreateDocumentApi(this.documentCreateUpdateDTO);
  }

  callCreateDocumentApi(documentCreateUpdateDTO) {
    this.subscriptions = this.documentRESTAPIService
      .createDocument({ documentCreateUpdateDTO: documentCreateUpdateDTO })
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary:
              this.translatedData['DOCUMENT_MENU.DOCUMENT_CREATE.CREATE_ERROR'],
          });
          this.router.navigate(['../../search'], {
            relativeTo: this.activeRoute,
          });
          return throwError(err);
        })
      )
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary:
            this.translatedData['DOCUMENT_MENU.DOCUMENT_CREATE.CREATE_SUCCESS'],
        });
        if (this.mapUploads().length) {
          this.callUploadAttachmentsApi(res.id);
        }
        this.router.navigate(['../../search'], {
          relativeTo: this.activeRoute,
        });
      });
  }

  callUploadAttachmentsApi(documentId) {
    const fileUploads = this.mapUploads();
    let filesToBeUploaded = [];
    for (let fileUpload of fileUploads) {
      filesToBeUploaded.push(fileUpload.file);
    }
    this.attachmentUploadService
      .uploadAttachment(documentId, filesToBeUploaded)
      .subscribe((res) => {
        if (res.attachmentResponse) {
          let successFiles = 0;
          let failedFiles = 0;
          const resp = Object.values(res.attachmentResponse);
          resp.forEach((element) => {
            if (element === 201) {
              successFiles++;
            } else {
              failedFiles++;
            }
          });
          if (successFiles > 0) {
            this.messageService.add({
              severity: 'success',
              summary: `${successFiles} ${this.translatedData['DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_SUCCESS']}`,
            });
          }
          if (failedFiles > 0) {
            this.messageService.add({
              severity: 'error',
              life: 5000,
              summary: `${failedFiles} ${this.translatedData['DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_ERROR']}`,
            });
            this.attachmentUploadService.exportAllFailedAttachments(documentId);
          }
        }
      });
  }

  private deepCopyArray(array: any[]): any[] {
    return Object.assign([], array);
  }

  openConfirmationModal(event) {
    this.confirmationService.confirm({
      target: event.target,
      message:
        this.translatedData[
          'DOCUMENT_DETAIL.DOCUMENT_CANCEL_MODAL.CANCEL_CONFIRM_MESSAGE'
        ],
      accept: () => {
        this.router.navigate(['../../search'], {
          //nav to search relative to this page
          relativeTo: this.activeRoute,
        });
      },
      reject: () => {},
    });
  }

  onCancel(event) {
    const isDocChanges = this.attachmentArray.length >= 1;
    const isCharChanges =
      this.documentCharacteristicsComponent?.genericFormArray?.value?.length >=
      1;
    let flagIsValid = false;

    let documentform = this.documentCreateForm.value.documentDescriptionForm;

    for (let detail in documentform) {
      if (detail != 'lifeCycleState' && documentform[detail]) {
        flagIsValid = true;
      }
    }

    if (flagIsValid || isDocChanges || isCharChanges) {
      this.openConfirmationModal(event);
    } else {
      this.router.navigate(['../../search'], {
        relativeTo: this.activeRoute,
      });
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
  navigateBack(): void {
    if (this.indexActive > 0) this.indexActive--;
  }

  getCharacteristicsData() {
    let documentCharacteristicsData = this.deepCopyArray(
      this.documentCharacteristicsComponent.genericFormArray.value
    ).filter((entry) => entry.name != '' || entry.value != '');

    let characteristicsSet = documentCharacteristicsData.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.name.toLowerCase() === value.name.toLowerCase() &&
            t.value.toLowerCase() === value.value.toLowerCase()
        )
    );
    return characteristicsSet;
  }

  /**
   *
   * @param value documentversion
   * which will update the global variable.
   */
  onUpdateDocumentVersion(value) {
    this.documentVersion = value;
  }
}
