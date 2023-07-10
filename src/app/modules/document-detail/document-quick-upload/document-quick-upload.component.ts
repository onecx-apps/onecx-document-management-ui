// Core imports
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Third party imports
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem, MessageService } from 'primeng/api';
import { catchError, Subscription, throwError, timer } from 'rxjs';
import { BreadcrumbService } from '@onecx/portal-integration-angular';

// Application imports
import { AttachmentUploadService } from '../attachment-upload.service';
import { DocumentQuickUploadFormComponent } from './document-quick-upload-form/document-quick-upload-form.component';
import {
  AttachmentCreateUpdateDTO,
  DocumentControllerV1APIService,
  DocumentCreateUpdateDTO,
  DocumentTypeDTO,
  SupportedMimeTypeDTO,
} from 'src/app/generated';

enum SortOrder {
  ASCENDING,
  DESCENDING,
}
@Component({
  selector: 'app-document-quick-upload',
  templateUrl: './document-quick-upload.component.html',
  styleUrls: ['./document-quick-upload.component.scss'],
  providers: [ConfirmationService],
})
export class DocumentQuickUploadComponent implements OnInit {
  editAttachmentIndex = -1;
  sortOrder = -1;
  activeElement = 0;
  rowsPerPage = 10;
  rowsPerPageOptions = [10, 20, 50];
  showToaster = false;
  disableAttachmentBtn = false;
  isHavingAttachment = false;
  isEditEnabled = false;
  enableCreateButton = false;
  formValid = false;
  isSubmitted = false;
  selectedFileList = false;
  showAttachment: boolean;
  cancelDialogVisible: boolean;

  documentCreateUpdateDTO: DocumentCreateUpdateDTO;
  documentQuickUploadForm: UntypedFormGroup;
  quickUploadForm: DocumentQuickUploadFormComponent;
  attachmentFieldsForm: UntypedFormGroup;
  sortOrderType: SortOrder = SortOrder.DESCENDING;
  allDocumentTypes: DocumentTypeDTO[];
  loadedSupportedMimeType: SupportedMimeTypeDTO[];
  documentTypes: SelectItem[];
  documentStatus: SelectItem[];
  supportedMimeType: SelectItem[];
  sortFields: SelectItem[];
  attachmentArray: any = [];
  attachmentsRespArray: any[];
  files: any = [];
  fileType: any = {};
  translatedData: any;
  fileData: any;
  uploadFileMimetype: any;
  attachmentErrorMessage = '';
  sortField = '';
  layout: 'list' | 'grid' = 'grid';
  subscriptions = new Subscription();

  constructor(
    private readonly messageService: MessageService,
    private readonly attachmentUploadService: AttachmentUploadService,
    private readonly documentV1Service: DocumentControllerV1APIService,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly breadcrumbService: BreadcrumbService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getTranslatedData();
    this.documentQuickUploadForm = new FormGroup({
      documentName: new FormControl('', [Validators.required]),
      typeId: new FormControl('', [Validators.required]),
      channelname: new FormControl('', [Validators.required]),
      lifeCycleState: new FormControl(),
    });
  }
  /**
   * function to get translatedData from translateService
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_CREATE.CREATE_SUCCESS',
        'DOCUMENT_MENU.DOCUMENT_CREATE.CREATE_ERROR',
        'DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_SUCCESS',
        'DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_ERROR',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_SUCCESS',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.UPLOAD_ERROR',
        'DOCUMENT_DETAIL.DOCUMENT_CANCEL_MODAL.CANCEL_CONFIRM_MESSAGE',
        'GENERAL.PROCESSING',
        'DOCUMENT_DETAIL.MULTIPLE_ATTACHMENTS.NO_DATA',
        'DOCUMENT_DETAIL.ATTACHMENTS.NAME',
        'DOCUMENT_DETAIL.ATTACHMENTS.SIZE',
        'DOCUMENT_DETAIL.ATTACHMENTS.TYPE',
        'DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_STATUS',
        'DOCUMENT_SEARCH.QUICK_UPLOAD',
      ])
      .subscribe((data) => {
        this.translatedData = data;
        this.breadcrumbService.setItems([
          { label: data['DOCUMENT_SEARCH.QUICK_UPLOAD'] as string },
        ]);
        this.sortFields = [
          {
            label: this.translatedData['DOCUMENT_DETAIL.ATTACHMENTS.NAME'],
            value: 'fileData.name',
          },
          {
            label: this.translatedData['DOCUMENT_DETAIL.ATTACHMENTS.SIZE'],
            value: 'fileData.size',
          },
          {
            label: this.translatedData['DOCUMENT_DETAIL.ATTACHMENTS.TYPE'],
            value: 'fileData.type',
          },
          {
            label:
              this.translatedData['DOCUMENT_DETAIL.ATTACHMENTS.UPLOAD_STATUS'],
            value: 'isValid',
          },
        ];
      });
  }
  /**
   * Tracks the updated value of view layout
   */
  updateAttachmentsLayout(event: any) {
    this.layout = event;
  }
  /**
   * function to enable create button to create new document
   * @param event which has boolean value
   */
  createButtonEnable(e): void {
    this.enableCreateButton = e;
  }
  /**
   * function to check form is valid or not to create document
   * @param e
   */
  setFormValid(e): void {
    this.formValid = e.valid;
    this.documentQuickUploadForm = e;
  }
  /**
   * function to save attachment list in attachment array
   * @param e
   */
  setAttachmentArray(e): void {
    this.attachmentArray = e;
  }

  /**
   * Reload the view on choosing the attachments
   */
  refreshAttachmentList(e): void {
    timer(50).subscribe(() => {
      this.selectedFileList = e;
    });
  }

  /**
   * Add the sort type
   */
  onSortOrderChange(sortOrder: boolean) {
    this.sortOrderType =
      sortOrder === true ? SortOrder.ASCENDING : SortOrder.DESCENDING;
    this.updateSorting();
  }
  /**
   * Add sort field
   */
  onSortFieldChange(sortField: string) {
    this.sortField = sortField;
    this.updateSorting();
  }
  /**
   * Sorting the field as per field names
   */
  updateSorting() {
    if (this.sortField === 'fileData.name') {
      this.sortOrder = this.sortOrderType === SortOrder.ASCENDING ? -1 : 1;
    } else {
      this.sortOrder = this.sortOrderType === SortOrder.ASCENDING ? 1 : -1;
    }
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
            fileName: 'attachment',
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

  /**
   * Creates new document. Returns a successful message on successful creation of document else returns an error message
   */

  /*
    @Description -> initializing the documentCreateUpdateDTO object and passing that object as parameter to callCreateDocumentApi
  */

  public onSave(): void {
    this.documentCreateUpdateDTO = {
      name: this.documentQuickUploadForm.controls.documentName.value,
      typeId: this.documentQuickUploadForm.controls.typeId.value,
      lifeCycleState:
        this.documentQuickUploadForm.controls.lifeCycleState.value,
      categories: [],
      characteristics: [],
      documentRelationships: [],
      relatedParties: [],
      tags: [],
      channel: {
        id: null,
        name: this.documentQuickUploadForm.controls.channelname.value,
      },
      relatedObject: {
        id: null,
        involvement: null,
        objectReferenceId: null,
        objectReferenceType: null,
      },
      attachments: this.mapAttachments(),
    };
    this.isSubmitted = true;
    this.documentQuickUploadForm.disable();
    this.callCreateDocumentApi(this.documentCreateUpdateDTO);
  }

  /**
   * @param  documentCreateUpdateDTO object
   * @Description calls the service class to send the object to the backend and sends the documentId (received from response object) to the callUploadAttachmentApi
   */

  callCreateDocumentApi(documentCreateUpdateDTO) {
    this.subscriptions = this.documentV1Service
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
        this.callUploadAttachmentsApi(res.id);
        this.isSubmitted = false;
        this.documentQuickUploadForm.enable();
        this.router.navigate(['../../search'], {
          relativeTo: this.activeRoute,
        });
      });
  }

  /**
    @param documentId
    @Description creates a list of the files that has to be uploaded and passes the documentId and the Files list to the uploadAttachment function of the service class.
  */

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

  /**
   * onCancel to cancel the quick upload dialog
   * @param event
   */

  onCancel() {
    let documentQuickUploadform = this.documentQuickUploadForm.value;
    let flagIsValid = false;
    for (let detail in documentQuickUploadform) {
      if (detail != 'lifeCycleState' && documentQuickUploadform[detail]) {
        flagIsValid = true;
      }
    }
    if (
      flagIsValid ||
      documentQuickUploadform.dirty ||
      this.attachmentArray.length
    ) {
      this.cancelDialogVisible = true;
    } else {
      this.router.navigate(['../../search'], {
        relativeTo: this.activeRoute,
      });
    }
  }

  /***function for no option on cancel dialogue */
  onCancelNo() {
    this.cancelDialogVisible = false;
  }

  /***function for Yes option on cancel dialogue */
  onCancelYes() {
    this.router.navigate(['../../search'], {
      relativeTo: this.activeRoute,
    });
  }
  /**
   * function to convert bytes to KB or MB according to bytes value
   * @param bytes file size value
   * @param decimal decimal places after decimal point. Default value is 2
   */
  formatBytes(bytes, decimals = 2) {
    try {
      bytes = +bytes;
      if (isNaN(bytes)) return false;
      if (bytes == 0) {
        return '0 Bytes';
      } else if (bytes > 0) {
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${
          sizes[i]
        }`;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  /**
   * function to get attachment Icon according to file type
   * @param attachment file data
   */
  getAttachmentIcon(attachment) {
    let fileName = attachment.fileName ?? '';
    let fileExtension = fileName.split('.').reverse();
    let fileTypeData = attachment?.fileData ? attachment.fileData.type : '';
    let attachmentIcon = '';

    if (fileTypeData) {
      let fileType = fileTypeData.split('/');
      if (fileType.length) {
        let type = fileType[0].toLowerCase();
        if (type == 'audio' || type == 'video' || type == 'image') {
          attachmentIcon = this.getMediaIcon(type);
        } else {
          if (fileExtension.length && fileExtension.length > 1) {
            let extension = fileExtension[0].toLowerCase();
            attachmentIcon = this.getFileExtensionIcon(extension);
          }
        }
      }
    }
    if (!attachmentIcon) {
      attachmentIcon = 'file.png';
    }
    return this.getAttachmentIconUrl(attachmentIcon);
  }

  /**
   * function to get attachmentIcon based on mediaType
   */
  getMediaIcon(type) {
    let attachmentIcon = '';
    switch (type) {
      case 'audio':
        attachmentIcon = 'audio.png';
        break;
      case 'video':
        attachmentIcon = 'video.png';
        break;
      case 'image':
        attachmentIcon = 'img.png';
        break;
      default:
        attachmentIcon = 'file.png';
    }
    return attachmentIcon;
  }

  /**
   * function to get attachmentIcon based on extension
   */
  getFileExtensionIcon(extension) {
    let attachmentIcon = '';
    switch (extension) {
      case 'xls':
      case 'xlsx':
        attachmentIcon = 'xls.png';
        break;
      case 'doc':
      case 'docx':
        attachmentIcon = 'doc.png';
        break;
      case 'ppt':
      case 'pptx':
        attachmentIcon = 'ppt.png';
        break;
      case 'pdf':
        attachmentIcon = 'pdf.png';
        break;
      case 'zip':
        attachmentIcon = 'zip.png';
        break;
      case 'txt':
        attachmentIcon = 'txt.png';
        break;
      default:
        attachmentIcon = 'file.png';
    }
    return attachmentIcon;
  }

  /**
   * function to get attachmentIconUrl
   */
  getAttachmentIconUrl(attachmentIcon) {
    return (
      this.attachmentUploadService.getAssetsUrl() +
      'images/file-format-icons/' +
      attachmentIcon
    );
  }

  /**
   * function to invoke if there is logo image error
   */
  imgError(event): void {
    if (!event.target.getAttribute('fallback')) {
      event.target.setAttribute('fallback', true);
      event.target.src =
        this.attachmentUploadService.getAssetsUrl() +
        'images/file-format-icons/file.png';
    }
  }

  /**
   * function to check if file is valid according to allowed file size
   * @param file file data
   */
  isValidFile(file) {
    let fileSize = file.size ?? '';
    if (fileSize && fileSize <= 2097152) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * function to remove file from attachmentArray according to array index
   * @param index index of current file
   */
  onDeleteUploadFile(attachment) {
    this.attachmentArray = this.attachmentArray.filter(
      (obj) => obj != attachment
    );
    this.validateAttachmentArray();
  }

  /**
   * function to enable or disable create button according to file isValid flag
   */
  validateAttachmentArray() {
    if (this.attachmentArray.length) {
      let invalidAttachment = this.attachmentArray.filter(
        (attachment) => !attachment.isValid
      );
      if (invalidAttachment.length) {
        this.enableCreateButton = false;
      } else {
        this.enableCreateButton = true;
      }
    } else {
      this.enableCreateButton = false;
    }
  }

  /**
   * function to enable or disable Pagination according to the attachmentArray length
   */
  get isPaginatorVisible(): boolean {
    if (this.attachmentArray.length == 0) {
      return false;
    }
    return true;
  }
}
