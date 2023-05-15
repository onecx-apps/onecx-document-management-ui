import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  LifeCycleState,
  DocumentCreateUpdateDTO,
} from 'src/app/generated';
import {
  SupportedMimeTypeControllerV1APIService,
  SupportedMimeTypeDTO,
} from 'src/app/generated';
import { TranslateService } from '@ngx-translate/core';
import { trimSpaces } from 'src/app/utils';

@Component({
  selector: 'app-document-quick-upload-form',
  templateUrl: './document-quick-upload-form.component.html',
  styleUrls: ['./document-quick-upload-form.component.scss'],
})
export class DocumentQuickUploadFormComponent implements OnInit {
  documentCreateUpdateDTO: DocumentCreateUpdateDTO;
  showToaster = false;
  attachmentsRespArray: any[];
  subscriptions = new Subscription();
  constructor(
    private readonly documentTypeRestApi: DocumentTypeControllerV1APIService,
    private readonly supportedMimeTypeAPI: SupportedMimeTypeControllerV1APIService,
    private readonly translateService: TranslateService
  ) {}
  @Output()
  public allDocumentTypes: DocumentTypeDTO[];
  public documentTypes: SelectItem[];
  public documentStatus: SelectItem[];
  documentQuickUploadForm: UntypedFormGroup;
  @Output() enableCreateButton = new EventEmitter<boolean>();
  @Output() formValid = new EventEmitter<any>();
  @Output() attchmentList = new EventEmitter<any>();
  @Output() selectedFileList = new EventEmitter<any>();
  translatedData: any;
  attachmentFieldsForm: UntypedFormGroup;
  fileData: any;
  @Input() attachmentArray;
  public supportedMimeType: SelectItem[];
  public loadedSupportedMimeType: SupportedMimeTypeDTO[];
  uploadFileMimetype: any;
  fileType: any = {};
  files: any = [];
  isSubmitted = false;

  ngOnInit(): void {
    this.documentQuickUploadForm = new FormGroup({
      documentName: new FormControl('', [Validators.required]),
      typeId: new FormControl('', [Validators.required]),
      channelname: new FormControl('', [Validators.required]),
      lifeCycleState: new FormControl(),
    });
    this.loadAllDocumentTypes();
    this.loadDocumentStatus();
    this.getMimetype();
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
      ])
      .subscribe((data) => {
        this.translatedData = data;
      });
    this.documentQuickUploadForm.valueChanges.subscribe(() => {
      this.formValid.emit(this.documentQuickUploadForm);
    });
  }
  /**
   * function to eliminate space from the beginning of the required fields
   */
  trimSpace(event: any) {
    let controlName = event.target.getAttribute('formControlName');
    let value = event.target.value.trim();
    this.documentQuickUploadForm.controls[controlName].setValue(value);
  }

  trimSpaceOnPaste(
    event: ClipboardEvent,
    controlName: string,
    maxlength: number
  ) {
    this.documentQuickUploadForm = trimSpaces(
      event,
      controlName,
      this.documentQuickUploadForm,
      maxlength
    );
  }

  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }
  /**
   * function to reterive document type
   */

  private loadAllDocumentTypes(): void {
    this.documentTypeRestApi.getAllTypesOfDocument().subscribe((results) => {
      this.allDocumentTypes = results;
      this.documentTypes = results.map((type) => ({
        label: type.name,
        value: type.id,
      }));
    });
  }

  /**
   * function to reterive document status
   */
  private loadDocumentStatus(): void {
    this.documentStatus = Object.keys(LifeCycleState).map((key) => ({
      label: LifeCycleState[key],
      value: key,
    }));
    // set "DRAFT" as default value for document status dropdown
    let docStatusDraft = this.documentStatus.filter(
      (document) => document.value.toLowerCase() == 'draft'
    );
    if (docStatusDraft.length > 0) {
      this.documentQuickUploadForm.controls.lifeCycleState.patchValue(
        this.documentStatus[1].value
      );
    }
  }

  /**
   * function to handle input file event
   * @param event change event raised by input element while uploading file
   */
  addFile(event) {
    this.selectedFileList.emit(false);
    let files = event.target.files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        this.enterDataToListView(files[i]);
      }
    }
    this.validateAttachmentArray();
  }

  /**
   * function to manipulate and store file data in attachmentArray
   * @param file file object having uploaded file data
   */
  enterDataToListView(file) {
    let attachmntObj: object = {
      name: file.name,
      mimeType: '',
      mimeTypeId: '',
      validity: '',
      description: '',
      fileData: file,
      isValid: false,
      fileName: file.name,
    };
    let uploadFileMimetype = file.type;
    this.supportedMimeType =
      this.supportedMimeType && this.supportedMimeType.length
        ? this.supportedMimeType
        : [];
    const arr = this.supportedMimeType.filter((results) => {
      return results.label === uploadFileMimetype;
    });
    if (arr.length) {
      attachmntObj['mimeType'] = arr[0].label;
      attachmntObj['mimeTypeId'] = arr[0].value;
    } else {
      attachmntObj['mimeType'] = 'Unknown';
      attachmntObj['mimeTypeId'] = 1;
    }
    attachmntObj['isValid'] = this.isValidFile(file);
    this.attachmentArray.reverse();
    this.attachmentArray.push(attachmntObj);
    this.sortAttachmentArray();
    this.attchmentList.emit(this.attachmentArray);
    this.selectedFileList.emit(true);
  }

  /**
   * function reterive allowed mimetype
   */
  getMimetype() {
    this.supportedMimeTypeAPI
      .getAllSupportedMimeTypes()
      .subscribe((results) => {
        this.loadedSupportedMimeType = results;
        this.supportedMimeType = results.map((el) => ({
          label: el.name,
          value: el.id,
        }));
      });
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
   * function to handle drop event for drag & drop functionality
   * @param event web API drop event
   */
  dropFile(event) {
    event.preventDefault();
    let files = event.dataTransfer.files;
    if (files && files.length) {
      for (let i = 0; i < files.length; i++) {
        this.enterDataToListView(files[i]);
      }
    }
    this.validateAttachmentArray();
  }

  /**
   * function to handle dragover event for drag & drop functionality
   * @param event web API dragover event
   */
  allowDrop(event) {
    event.preventDefault();
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
        this.enableCreateButton.emit(false);
      } else {
        if (this.documentQuickUploadForm.valid) {
          this.enableCreateButton.emit(true);
        }
      }
    } else {
      this.enableCreateButton.emit(false);
    }
  }

  /**
   * P002271-3966 - Function to show failed documents at top of the list
   */
  sortAttachmentArray() {
    let validAttachmentArray: any = [];
    let inValidAttachmentArray: any = [];
    this.attachmentArray.forEach((element) => {
      if (!element['isValid']) {
        inValidAttachmentArray.unshift(element);
      }
    });
    this.attachmentArray.forEach((element) => {
      if (element['isValid']) {
        validAttachmentArray.unshift(element);
      }
    });
    this.attachmentArray = inValidAttachmentArray.concat(validAttachmentArray);
  }
}
