// Core imports
import { HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Third party imports
import * as JSZip from 'jszip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import {
  Action,
  BreadcrumbService,
  ObjectDetailItem,
} from '@onecx/portal-integration-angular';
import { saveAs } from 'file-saver';
import { MessageService } from 'primeng/api';
import { throwError, forkJoin, of } from 'rxjs';
import { catchError, defaultIfEmpty, tap, map, mergeMap } from 'rxjs/operators';

// Application imports
import { AttachmentUploadService } from '../attachment-upload.service';
import { DocumentEditAttachmentComponent } from './document-edit-attachment/document-edit-attachment.component';
import { DocumentEditCharacteristicsComponent } from './document-edit-characteristics/document-edit-characteristics.component';
import { DocumentEditLifecycleComponent } from './document-edit-lifecycle/document-edit-lifecycle.component';
import {
  AttachmentDTO,
  DocumentDetailDTO,
  DocumentControllerV1APIService,
  DocumentCreateUpdateDTO,
  UpdateDocumentRequestParams,
} from 'src/app/generated';
import { DocumentTabStateService } from 'src/app/shared/document-tab-state.service';
import { convertToCSV, noSpecialCharacters } from 'src/app/utils';
import { DataSharingService } from 'src/app/shared/data-sharing.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss'],
  providers: [DatePipe],
})
export class DocumentEditComponent implements OnInit {
  @ViewChild(DocumentEditLifecycleComponent, { static: false })
  documentEditLifecycleComponent: DocumentEditLifecycleComponent;
  @ViewChild(DocumentEditCharacteristicsComponent, { static: false })
  documentEditCharacteristicsComponent: DocumentEditCharacteristicsComponent;
  @ViewChild(DocumentEditAttachmentComponent, { static: false })
  documentEditAttachmentComponent: DocumentEditAttachmentComponent;
  @ViewChild(DocumentEditAttachmentComponent)
  attachmentList: DocumentEditAttachmentComponent;

  activeCurrentTab: number;
  documentDescriptionIsValid = false;
  isEditable = false;
  deleteDialogVisible: boolean;
  mandateDialogFlag: boolean;

  document: DocumentDetailDTO;
  copyDocument: DocumentDetailDTO;
  documentEditForm: UntypedFormGroup;
  headerLabels: ObjectDetailItem[];
  headerActions: Action[] = [];
  attachmentArray: any = [];
  initialAttachmentData: any = [];
  deletedAttachmentsIds: any = [];
  mandateList: any[];
  translatedData: any;
  documentVersion;
  documentId: string;
  channelName: string;
  specialChar: string;

  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly documentV1Service: DocumentControllerV1APIService,
    private readonly messageService: MessageService,
    private readonly translateService: TranslateService,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly attachmentUploadService: AttachmentUploadService,
    private readonly router: Router,
    public documentTabStateService: DocumentTabStateService,
    private readonly dataSharingService: DataSharingService,
    private readonly datepipe: DatePipe
  ) {}

  public ngOnInit(): void {
    this.specialChar = this.dataSharingService.specialChar;
    this.getTranslatedData();
    const tabQuery = +this.activeRoute.snapshot.queryParamMap.get('tab');

    if (!isNaN(tabQuery) && tabQuery >= 0) {
      this.activeCurrentTab = tabQuery;
    } else {
      this.activeCurrentTab = 0;
    }

    this.handleTabChange({ index: this.activeCurrentTab });
    this.documentId = String(this.activeRoute.snapshot.paramMap.get('id'));
    this.getDocumentDetail();
    this.setHeaderButtons(this.document);

    /* 
     form validations
     */
    this.documentEditForm = this.formBuilder.group({
      documentDescriptionForm: this.formBuilder.group({
        name: [
          '',
          [Validators.required, Validators.maxLength(60), noSpecialCharacters],
        ],
        typeId: ['', Validators.required],
        documentVersion: ['', Validators.min(0)],
        channelname: ['', [Validators.required, Validators.maxLength(60)]],
        specificationName: [''],
        lifeCycleState: [null],
        description: [null],
        involvement: [null],
        referenceType: [null],
        referenceId: [null],
      }),
    });
    this.documentEditForm.valueChanges.subscribe(() => {
      const formControls = this.documentEditForm.controls;
      this.documentDescriptionIsValid =
        formControls.documentDescriptionForm.valid;
    });
  }
  /**
   * function to get translatedData from translateService
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_SUCCESS',
        'DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_ERROR',
        'DOCUMENT_MENU.DOCUMENT_EDIT.HEADER',
        'DOCUMENT_MENU.DOCUMENT_EDIT.TYPE',
        'DOCUMENT_MENU.DOCUMENT_EDIT.CREATED_BY',
        'DOCUMENT_MENU.DOCUMENT_EDIT.CREATED_ON',
        'DOCUMENT_MENU.DOCUMENT_EDIT.STATUS',
        'DOCUMENT_MENU.DOCUMENT_EDIT.FETCH_ERROR',
        'DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_SUCCESS',
        'DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_ERROR',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_SUCCESS',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_ERROR',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.DELETE_SUCCESS',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.DELETE_ERROR',
        'DOCUMENT_DETAIL.ATTACHMENTS.DELETE_SUCCESS',
        'DOCUMENT_DETAIL.ATTACHMENTS.DELETE_ERROR',
        'GENERAL.EDIT',
        'GENERAL.SAVE',
        'GENERAL.CANCEL',
        'GENERAL.DOWNLOAD_ZIP',
        'GENERAL.CLOSE',
        'GENERAL.DELETE',
        'GENERAL.DOWNLOAD',
        'DOCUMENT_MENU.DOCUMENT_EDIT.EMPTY_REQUIRED_FIELD_ERROR',
        'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_ERROR',
        'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_SUCCESS',
        'DOCUMENT_MENU.DOCUMENT_EDIT.SPECIAL_CHARACTER_ERROR',
        'DOCUMENT_MENU.DOCUMENT_EDIT.DOCUMENT_NAME_MISSING',
        'DOCUMENT_MENU.DOCUMENT_EDIT.DOCUMENT_TYPE_MISSING',
        'DOCUMENT_MENU.DOCUMENT_EDIT.CHANNEL_MISSING',
        'DOCUMENT_MENU.DOCUMENT_EDIT.ATTACHMENT_NAME_MISSING',
        'DOCUMENT_MENU.DOCUMENT_EDIT.ATTACHMENT_FILE_MISSING',
      ])
      .subscribe((data) => {
        this.translatedData = data;
        this.breadcrumbService.setItems([
          { label: data['DOCUMENT_MENU.DOCUMENT_EDIT.HEADER'] as string },
        ]);
      });
  }
  /**
   * function to get document details
   */
  getDocumentDetail() {
    this.documentV1Service.getDocumentById({ id: this.documentId }).subscribe({
      next: (data) => {
        this.document = data;
        this.copyDocument = JSON.parse(JSON.stringify(this.document));
        this.setHeaderFields(this.document);
        this.setDocumentFormFields(this.document);
        this.setRelatedFormFields(this.document);
        this.setCharacteristics(this.document);
        this.setAttachmentData(this.document);
        this.channelName = data.channel?.name;
        this.documentEditLifecycleComponent?.refreshTimeline();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary:
            this.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.FETCH_ERROR'],
        });
      },
    });
  }

  /**
   * Wrapper method for setHeaderFields to write Unit Test for this private method
   */
  public setHeaderFieldsWrapper(document: DocumentDetailDTO) {
    this.setHeaderFields(document);
  }

  /**
   * function to set header fields with label
   * @param document
   */
  private setHeaderFields(document: DocumentDetailDTO) {
    this.headerLabels = [
      {
        label: 'DOCUMENT_MENU.DOCUMENT_EDIT.TYPE',
        labelPipe: TranslatePipe,
        value: document.type?.name,
      },
      {
        label: 'DOCUMENT_MENU.DOCUMENT_EDIT.CREATED_BY',
        labelPipe: TranslatePipe,
        value: document.creationUser,
      },
      {
        label: 'DOCUMENT_MENU.DOCUMENT_EDIT.CREATED_ON',
        labelPipe: TranslatePipe,
        value: document.creationDate,
        valuePipe: DatePipe,
      },
      {
        label: 'DOCUMENT_MENU.DOCUMENT_EDIT.STATUS',
        labelPipe: TranslatePipe,
        value: document.lifeCycleState,
      },
    ];
  }

  /**
   * Wrapper method for setHeaderButtons to write Unit Test for this private method
   */
  public setHeaderButtonsWrapper(document: DocumentDetailDTO) {
    this.setHeaderButtons(document);
  }
  /**
   * function to set the header buttons
   * @param document
   */
  private setHeaderButtons(document: DocumentDetailDTO) {
    this.headerActions = [
      {
        label: this.translatedData['GENERAL.CLOSE'],
        title: this.translateService.instant('GENERAL.CLOSE'),
        show: 'always',
        icon: 'pi pi-arrow-left',

        actionCallback: () => {
          this.onClose();
        },
      },
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_EDIT',
        label: this.translatedData['GENERAL.EDIT'],
        title: this.translateService.instant('GENERAL.EDIT'),
        show: 'always',
        icon: 'pi pi-pencil',

        actionCallback: () => {
          this.onEdit();
        },
      },
      {
        label: this.translatedData['GENERAL.CANCEL'],
        title: this.translateService.instant('GENERAL.CANCEL'),
        show: 'always',
        icon: 'pi pi-times',
        conditional: true,
        showCondition: false,
        actionCallback: () => {
          this.onCancel();
        },
      },
      {
        label: this.translatedData['GENERAL.SAVE'],
        show: 'always',
        title: this.translateService.instant('GENERAL.SAVE'),
        icon: 'pi pi-save',
        conditional: true,
        showCondition: false,
        actionCallback: () => {
          this.onSave();
        },
      },
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_DOWNLOAD',
        label: this.translatedData['GENERAL.DOWNLOAD_ZIP'],
        title: this.translateService.instant('GENERAL.DOWNLOAD_ZIP'),
        show: 'always',
        icon: 'pi pi-download',

        actionCallback: () => {
          this.downloadZip(this.documentId);
        },
      },
      {
        label: this.translatedData['GENERAL.DELETE'],
        title: this.translateService.instant('GENERAL.DELETE'),
        icon: 'pi pi-trash',
        show: 'asOverflow',
        actionCallback: () => {
          this.deleteDialogVisible = true;
        },
      },
    ];
  }
  /**
   *
   * @param array
   * @returns new copied array
   */
  private deepCopyArray(array: any[]): any[] {
    return Object.assign([], array);
  }
  /**
   * @returns set of attachment array that user has uploaded
   */
  mapAttachments() {
    let setAttachments = [];
    let attachmentsArray = [];
    let udatedAttachment = this.getUpdatedAttachment();

    if (udatedAttachment.length) {
      attachmentsArray = udatedAttachment.map((el, i) => ({
        id: el.id,
        name: el.name,
        description: el.description,
        mimeTypeId: el.mimeTypeId,
        validFor: { startDateTime: null, endDateTime: el.validity },
        fileName: el.fileName,
      }));
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
  }

  /**
   * Wrapper method for mapUploads to write Unit Test for this private method
   */
  public mapUploadsWrapper() {
    this.mapUploads();
  }

  /**
   * @returns set of files array that user has uploaded
   */
  private mapUploads() {
    let fileUploads = [];
    try {
      fileUploads = this.attachmentArray.map((el) => ({
        file: el.fileData,
        id: el.id,
      }));
      return fileUploads;
    } catch (err) {
      console.error(err);
    }
  }

  formFieldValidate() {
    let formFieldArray = new Set();
    const formDetails = this.documentEditForm.controls.documentDescriptionForm;
    try {
      this.specialCharsCheck(formFieldArray, formDetails);
      this.documentFormValidation(formFieldArray, formDetails);
      this.attachmentFormValidation(formFieldArray);
      return [...formFieldArray];
    } catch (err) {
      console.error(err);
    }
  }

  /**
  special characters not allowed check 
   */
  specialCharsCheck(formFieldArray, formDetails) {
    const pattern = /[\\/:*?<>|"]/;
    //attachmentName
    if (this.attachmentArray) {
      this.attachmentArray.map((el) => {
        if (pattern.test(el['name'])) {
          formFieldArray.add(
            this.translatedData[
              'DOCUMENT_MENU.DOCUMENT_EDIT.SPECIAL_CHARACTER_ERROR'
            ] + this.specialChar
          );
        }
      });
    }
    //documentName
    if (pattern.test(formDetails.get('name').value)) {
      formFieldArray.add(
        this.translatedData[
          'DOCUMENT_MENU.DOCUMENT_EDIT.SPECIAL_CHARACTER_ERROR'
        ] + this.specialChar
      );
    }
  }

  /**
  document form missing fields
   */
  documentFormValidation(formFieldArray, formDetails) {
    if (formDetails.get('name').value.trim() == '') {
      formFieldArray.add(
        this.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.DOCUMENT_NAME_MISSING']
      );
    }
    if (formDetails.get('typeId').invalid) {
      formFieldArray.add(
        this.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.DOCUMENT_TYPE_MISSING']
      );
    }
    if (formDetails.get('channelname').invalid) {
      formFieldArray.add(
        this.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.CHANNEL_MISSING']
      );
    }
  }

  /**
  attachment form missing fields 
   */
  attachmentFormValidation(formFieldArray) {
    if (
      this.documentEditAttachmentComponent &&
      this.attachmentArray.length !== 0
    ) {
      this.attachmentArray.map((el) => {
        Object.keys(el).forEach((data) => {
          if (el[data] == '' || el[data] == null)
            switch (data) {
              case 'name':
                formFieldArray.add(
                  this.translatedData[
                    'DOCUMENT_MENU.DOCUMENT_EDIT.ATTACHMENT_NAME_MISSING'
                  ]
                );
                break;
              case 'fileData':
                formFieldArray.add(
                  this.translatedData[
                    'DOCUMENT_MENU.DOCUMENT_EDIT.ATTACHMENT_FILE_MISSING'
                  ]
                );
                break;
            }
        });
      });
    }
  }

  /**
   * function to refresh attachment when user edit the attachments
   * @param data
   */
  refreshAttachmentComponent(data) {
    this.documentEditAttachmentComponent?.preFillLatestDocument(data);
    this.attachmentList?.scroll?.nativeElement.scrollTo(0, 0);
  }
  public onSave(): void {
    const checkAttachment =
      !this.documentEditAttachmentComponent?.showAttachment;
    if (this.documentEditForm.valid && checkAttachment) {
      const documentCreateDTO: DocumentCreateUpdateDTO = {
        ...this.documentEditForm.value.documentDescriptionForm,
        channel: {
          id: this.channelName,
          name: this.documentEditForm.value.documentDescriptionForm.channelname,
        },
        categories: [],
        characteristics: this.getCharacteristicsData(),
        documentRelationships: [],
        relatedParties: [],
        tags: [],
        relatedObject: {
          id: null,
          involvement:
            this.documentEditForm.value.documentDescriptionForm.involvement,
          objectReferenceId:
            this.documentEditForm.value.documentDescriptionForm.referenceId,
          objectReferenceType:
            this.documentEditForm.value.documentDescriptionForm.referenceType,
        },
        specification: {
          name: this.documentEditForm.value.documentDescriptionForm
            .specificationName,
          specificationVersion: null,
        },
        attachments: this.mapAttachments(),
      };
      this.edit(documentCreateDTO);
      this.isEditable = false;
      this.headerActions = this.headerActions.map((item: Action) => {
        if (item.label === 'Save' || item.label === 'Cancel') {
          return {
            ...item,
            conditional: true,
            showCondition: false,
          };
        }
        if (item.label === 'Edit' || item.label === 'Download ZIP') {
          return {
            ...item,
            conditional: false,
            showCondition: true,
          };
        }
        return item;
      });
    } else {
      Object.keys(this.documentEditForm.controls).forEach((key) => {
        if (this.documentEditForm.controls[key].invalid) {
          this.documentEditForm.controls[key].markAsDirty();
        }
      });
      this.mandateList = this.formFieldValidate();
      this.mandateDialogFlag = true;
    }
  }
  /**
   * function to send updated data to the API when user click on save
   * @param data
   */
  public edit(data: DocumentCreateUpdateDTO): void {
    const attachmentIdArray = [];
    const attachmentFileArray = [];
    const newFileUploads = this.mapUploads().filter((entry) => entry.id === '');
    const existingFileUploads = this.mapUploads().filter(
      (entry) => !entry.file.hasOwnProperty('type')
    );
    const params: UpdateDocumentRequestParams = {
      id: this.documentId,
      documentCreateUpdateDTO: data,
    };
    this.documentV1Service
      .updateDocument(params)
      .pipe(
        catchError((err) => {
          this.messageService.add({
            severity: 'error',
            summary:
              this.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_ERROR'],
          });
          this.refreshAttachmentComponent(this.document);
          return throwError(err);
        }),
        tap((resp) => {
          this.messageService.add({
            severity: 'success',
            summary:
              this.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_SUCCESS'],
          });
        }),
        map((resp) => resp.attachments),
        map((attachments: AttachmentDTO[]) => {
          let obsArray = [];
          if (existingFileUploads.length) {
            existingFileUploads.forEach((fu, i) => {
              const attachment = attachments.filter((o) =>
                existingFileUploads.find((o2) => o.id === o2.id)
              );
              try {
                if (attachment.length) {
                  attachmentIdArray.push(attachment[i].id);
                  attachmentFileArray.push(fu.file);
                }
              } catch (e) {
                console.log(e);
              }
            });
          }
          if (newFileUploads.length) {
            newFileUploads.forEach((fuu, i) => {
              const attachment = attachments.filter((x) => x.size == null);
              if (attachment.length) {
                attachmentIdArray.push(attachment[i].id);
                attachmentFileArray.push(fuu.file);
              }
            });
          }
          if (attachmentFileArray.length) {
            obsArray.push(
              this.callEditFileUploadsApi(
                this.documentId,
                attachmentIdArray,
                attachmentFileArray
              )
            );
          }
          return obsArray;
        }),
        mergeMap((arr) => forkJoin(arr)),
        defaultIfEmpty(null)
      )
      .subscribe((resp) => {
          this.refreshAttachmentComponent(this.attachmentArray);
          if (this.deletedAttachmentsIds.length) {
            this.documentDeleteAttachments(this.deletedAttachmentsIds);
          } else {
            this.getDocumentDetail();
          }
        },
        (err) => {
          console.log(err);
        }
          );
  }

  /**
   * this function is called if any attachments are requied to be deleted from the edit attachment flow.
   * @param attachmentsId accepts a string of array as a parameter
   * stores the attachmentIds that is required to be deleted in an object.
   * passes the object as a parameeter to the deleteFile function in the documentAPI component class which invokes a delete call
   */
  documentDeleteAttachments(attachmentsId: string[]) {
    let params = {
      deletedAttachmentsIds: attachmentsId,
    };
    this.documentV1Service.deleteFile(params).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: `${attachmentsId.length} ${this.translatedData['DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.DELETE_SUCCESS']}`,
        });
        this.getDocumentDetail();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: `${attachmentsId.length} ${this.translatedData['DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.DELETE_ERROR']}`,
        });
        this.getDocumentDetail();
      },
    });
  }

  /**
   * this function is called if any new attachments are being uploaded from the edit attachment flow
   * @param documentId the Id of the document in which new files are being added.
   * @param attachmentIdArray contains the attachmentIds of the attachment for which the new files are being uploaded.
   * @param attachmentFileArray contains the binary files data of the newly added files.
   * passes the three parameters to function uploadEditAttachment of attachmentUploadService component class.
   */
  public callEditFileUploadsApi(
    documentId,
    attachmentIdArray,
    attachmentFileArray
  ) {
    return this.attachmentUploadService
      .uploadEditAttachment(documentId, attachmentIdArray, attachmentFileArray)
      .pipe(
        catchError((err) => {
          console.log(err);
          return throwError(err);
        }),
        tap((res) => {
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
              this.attachmentUploadService.exportAllFailedAttachments(
                documentId
              );
            }
          }
        })
      );
  }

  /**
   * function to set values for form fields
   * @param DocumentDetailDTO
   */
  setDocumentFormFields(document: DocumentDetailDTO) {
    let documentDescriptionForm: any =
      this.documentEditForm.controls.documentDescriptionForm;
    documentDescriptionForm.controls['name'].setValue(
      document.name ? document.name : ''
    );
    documentDescriptionForm.controls['typeId'].setValue(
      document?.type?.id ? document?.type?.id : ''
    );
    documentDescriptionForm.controls['documentVersion'].setValue(
      document && document.documentVersion?.toString()
        ? document.documentVersion
        : ''
    );
    documentDescriptionForm.controls['channelname'].setValue(
      document?.channel?.name ? document?.channel?.name : null
    );
    documentDescriptionForm.controls['specificationName'].setValue(
      document.specification?.name ? document.specification?.name : null
    );
    documentDescriptionForm.controls['lifeCycleState'].setValue(
      document.lifeCycleState ? document.lifeCycleState : null
    );
    documentDescriptionForm.controls['description'].setValue(
      document.description ? document.description : ''
    );
  }
  /**
   * function to set related object tab fields
   * @param DocumentDetailDTO
   */
  setRelatedFormFields(document: DocumentDetailDTO) {
    let documentDescriptionForm: any =
      this.documentEditForm.controls.documentDescriptionForm;
    documentDescriptionForm.controls['involvement'].setValue(
      document?.relatedObject?.involvement
        ? document?.relatedObject?.involvement
        : null
    );
    documentDescriptionForm.controls['referenceType'].setValue(
      document?.relatedObject?.objectReferenceType
        ? document?.relatedObject?.objectReferenceType
        : null
    );
    documentDescriptionForm.controls['referenceId'].setValue(
      document?.relatedObject?.objectReferenceId
        ? document?.relatedObject?.objectReferenceId
        : null
    );
  }
  /**
   * function to set characteristics
   * @param document
   */
  setCharacteristics(document: DocumentDetailDTO): void {
    let sortCharacteristics = document.characteristics?.sort(function (
      a: any,
      b: any
    ) {
      let x = a.modificationDate.toLowerCase();
      let y = b.modificationDate.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    this.documentEditCharacteristicsComponent?.updateForm(sortCharacteristics);
  }
  /**
   * function to show active tab on refresh
   * @param event
   */
  handleTabChange(event) {
    this.activeCurrentTab = event.index;
    this.documentTabStateService.saveactiveCurrentTab(event.index);
    this.router.navigate([], {
      relativeTo: this.activeRoute,
      queryParams: { tab: event.index },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
  /**
   * function to set old data on cancel
   */
  onCancel() {
    this.setDocumentFormFields(this.copyDocument);
    this.setRelatedFormFields(this.copyDocument);
    this.setCharacteristics(this.copyDocument);
    this.setAttachmentData(this.document);
    this.attachmentList?.scroll?.nativeElement.scrollTo(0, 0);
    this.onCancelEvent();
  }
  /**
   * function to close mandatory field missing dialog
   */
  mandateDialogClose() {
    this.mandateDialogFlag = false;
  }
  /**
   * function to store attachment data in attachment array
   * @param document which is selected for edit
   */
  setAttachmentData(document: DocumentDetailDTO) {
    let attachments: any = [];
    this.attachmentArray = [];
    attachments = document.attachments ? document.attachments : [];
    if (attachments.length) {
      attachments.forEach((attachment) => {
        if (attachment?.storageUploadStatus) {
          let fileData: any = {};
          fileData['name'] = attachment.fileName ?? '';
          fileData['size'] = attachment.size ?? '';
          fileData['type'] = attachment.type ?? '';

          let attachmntObj: object = {};
          attachmntObj['name'] = attachment.name ?? '';
          attachmntObj['description'] = attachment.description ?? '';
          attachmntObj['mimeType'] = attachment.mimeType.name ?? '';
          attachmntObj['mimeTypeId'] = attachment.mimeType.id ?? '';
          attachmntObj['fileData'] = fileData;
          attachmntObj['validity'] = attachment?.validFor?.endDateTime
            ? new Date(attachment.validFor.endDateTime)
            : null;
          attachmntObj['id'] = attachment.id ?? '';
          attachmntObj['isDownloadable'] = attachment.id ? true : false;
          this.attachmentArray.push(attachmntObj);
        }
      });
      this.initialAttachmentData = JSON.parse(
        JSON.stringify(this.attachmentArray)
      );
    }
  }
  /**
   * function to get the characteristics data
   * @returns characteristics set
   */
  getCharacteristicsData() {
    let documentCharacteristicsData = this.deepCopyArray(
      this.documentEditCharacteristicsComponent.genericFormArray.value
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
   * function to get updated attachment data
   * @returns updated data
   */
  getUpdatedAttachment() {
    let originalObj = this.initialAttachmentData;
    let updatedObj = JSON.parse(JSON.stringify(this.attachmentArray));
    let deletedObj = [];
    let changedData = updatedObj.filter((eachUpdatedObj) => {
      if (!eachUpdatedObj.id) return true;
      else {
        let ObjId = eachUpdatedObj.id;
        let orgObj: any = originalObj.filter((eachOriginalObj) => {
          return ObjId == eachOriginalObj.id;
        });
        orgObj = orgObj[0];
        return JSON.stringify(eachUpdatedObj) !== JSON.stringify(orgObj);
      }
    });
    deletedObj = originalObj.filter((o1) => {
      return !updatedObj.some(function (o2) {
        return o1.id === o2.id;
      });
    });
    this.deletedAttachmentsIds = deletedObj.map((eachDeletedObj) => {
      return eachDeletedObj.id;
    });

    return changedData;
  }

  /**
   *
   * @param value document version value
   * updates the global version value
   */
  onUpdateDocumentVersion(value) {
    this.documentVersion = value;
  }
  /**
   * Delete document based on selected document
   * @param id to select the particular document id.
   */
  public deleteDocument(id: string): void {
    this.documentV1Service.deleteDocumentById({ id }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary:
            this.translatedData['DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_SUCCESS'],
        });
        this.router.navigate(['../../../search'], {
          relativeTo: this.activeRoute,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary:
            this.translatedData['DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_ERROR'],
        });
      },
    });
    this.deleteDialogVisible = false;
  }
  /**
   * Closes the delete confirmation dialog box if user selects no option
   */
  onCancelDelete() {
    this.deleteDialogVisible = false;
  }

  /** Deletes the document if it is Yes**/
  onDelete() {
    this.deleteDocument(this.documentId);
  }

  /** Downloads all attachements and create csv file in zip folder
   *  @param documentId to pass to get all the attachment file from back end call
   **/
  downloadZip(documentId: string) {
    const zip = new JSZip();
    let formData = {};

    const now = new Date();
    const date = this.datepipe.transform(now, 'ddMMyy');
    const time = this.datepipe.transform(now, 'HHmmss');

    let docName = this.document?.name + '-' + date + '-' + time;
    formData = {
      documentName: this.document?.name,
      documentType: this.document?.type.name,
      createdBy: this.document?.creationUser,
      createdOn: this.document?.creationDate,
      lastModified: this.document?.modificationDate,
      version: this.document?.documentVersion,
      channel: this.document?.channel?.name,
      specification: this.document?.specification?.name,
      status: this.document?.lifeCycleState,
      description: this.document?.description,
      involvement: this.document?.relatedObject?.involvement,
      objectReferenceType: this.document?.relatedObject?.objectReferenceType,
      objectReferenceId: this.document?.relatedObject?.objectReferenceId,
    };

    this.attachmentUploadService
      .downloadDocAttachmentsAsZip(documentId)
      .pipe(
        catchError((err) => {
          return err;
        })
      )
      .subscribe((response: HttpResponse<Blob>) => {
        if (response) {
          const currDate = new Date();
          const dateWithTZOffset = new Date(
            currDate.getTime() - currDate.getTimezoneOffset() * 60000
          );
          if (response.status != 204) {
            let binaryData = [];
            binaryData.push(response.body);
            let res = new Blob(binaryData, { type: 'blob' });
            zip.file('attachments.zip', res, { date: dateWithTZOffset });
          }
          let header = Object.keys(formData);
          let csvData = convertToCSV(formData, header);
          zip.file(this.document?.name + '.csv', csvData, {
            date: dateWithTZOffset,
          });

          zip
            .generateAsync({
              type: 'blob',
            })
            .then(function (content) {
              saveAs(content, docName);
            });
        }
      });
  }

  /* Close button on tab format
   */
  onClose() {
    this.router.navigate(['../../../search'], {
      relativeTo: this.activeRoute,
    });
  }

  /**
   * edit button event
   */
  onEdit() {
    this.isEditable = true;
    this.headerActions = this.headerActions.map((item: Action) => {
      if (item.label === 'Edit' || item.label === 'Download ZIP') {
        return {
          ...item,
          conditional: true,
          showCondition: false,
        };
      }

      if (item.label === 'Cancel' || item.label === 'Save') {
        return {
          ...item,
          conditional: false,
          showCondition: true,
        };
      }

      return item;
    });
  }

  /**
   * Cancel button event on tab format
   */

  onCancelEvent() {
    this.isEditable = false;
    this.headerActions = this.headerActions.map((item: Action) => {
      if (item.label === 'Cancel' || item.label === 'Save') {
        return {
          ...item,
          conditional: true,
          showCondition: false,
        };
      }
      if (item.label === 'Edit' || item.label === 'Download ZIP') {
        return {
          ...item,
          conditional: false,
          showCondition: true,
        };
      }

      return item;
    });
  }
}
