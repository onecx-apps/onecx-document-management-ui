// Core imports
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

// Third party imports
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { catchError } from 'rxjs/operators';

// Application imports
import { AttachmentUploadService } from '../../attachment-upload.service';
import {
  DocumentDetailDTO,
  SupportedMimeTypeControllerV1APIService,
  SupportedMimeTypeDTO,
} from 'src/app/generated';
import { noSpecialCharacters, trimSpaces } from 'src/app/utils';
import { DataSharingService } from 'src/app/shared/data-sharing.service';

@Component({
  selector: 'app-document-edit-attachment',
  templateUrl: './document-edit-attachment.component.html',
  styleUrls: ['./document-edit-attachment.component.scss'],
})
export class DocumentEditAttachmentComponent implements OnInit {
  @ViewChild('attachmentList') scroll: ElementRef;
  @Input() attachmentArray;
  @Input() isEditable: boolean;

  editAttachmentIndex = -1;
  activeElement = 0;
  maxlengthDescription = 500;
  disableAttachmentBtn = false;
  isHavingAttachment = false;
  isEditEnabled = false;
  showAttachment: boolean;

  attachmentFieldsForm: UntypedFormGroup;
  loadedSupportedMimeType: SupportedMimeTypeDTO[];
  supportedMimeType: SelectItem[];
  fileType: any = {};
  translatedData: any;
  fileData: any;
  uploadFileMimetype: any;
  tooltipmimeType: string;
  attachmentErrorMessage = '';
  specialChar: string;

  constructor(
    private readonly translateService: TranslateService,
    private readonly supportedMimeTypeV1Service: SupportedMimeTypeControllerV1APIService,
    private readonly attachmentUploadService: AttachmentUploadService,
    private readonly dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.specialChar = this.dataSharingService.specialChar;
    this.showAttachment = false;
    this.attachmentFieldsForm = new FormGroup({
      name: new FormControl('', [Validators.required, noSpecialCharacters]),
      mimeType: new FormControl(''),
      validity: new FormControl(null),
      description: new FormControl('', Validators.maxLength(500)),
    });
    this.getMimetype();
    this.checkInitialData();
  }

  ngOnChanges() {
    this.checkInitialData();
    this.onSelectAttachment(this.editAttachmentIndex);
  }

  /**
   * function to eliminate space from the beginning of the required fields
   */
  trimSpace(event: any) {
    let controlName = event.target.getAttribute('formControlName');
    let value = event.target.value.trim();
    this.attachmentFieldsForm.controls[controlName].setValue(value);
  }
  trimSpaceOnPaste(
    event: ClipboardEvent,
    controlName: string,
    maxlength: number
  ) {
    this.attachmentFieldsForm = trimSpaces(
      event,
      controlName,
      this.attachmentFieldsForm,
      maxlength
    );
  }
  /**
   * function to reset the datefield
   */
  resetDate() {
    this.attachmentFieldsForm.controls['validity'].setValue(null);
    this.updateAttachmentData();
  }

  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }

  getMimetype() {
    this.supportedMimeTypeV1Service
      .getAllSupportedMimeTypes()
      .subscribe((results) => {
        this.loadedSupportedMimeType = results;
        this.supportedMimeType = results.map((el) => ({
          label: el.name,
          value: el.id,
        }));
      });
  }
  public selectedItem(id) {
    this.activeElement = id;
  }
  checkInitialData() {
    if (this.attachmentArray?.length) {
      this.populateAttachmentFormData(
        this.attachmentArray[this.attachmentArray.length - 1],
        this.attachmentArray.length - 1
      );
      this.validateAttachmentData();
    }
  }

  onSelectAttachment(index) {
    let attachmentData = this.attachmentArray[index];
    this.populateAttachmentFormData(attachmentData, index);
    this.validateAttachmentData();
    if (this.attachmentArray?.length) {
      this.populateAttachmentFormData(
        this.attachmentArray[
          this.attachmentArray.length - 1 && this.activeElement
        ],
        this.attachmentArray.length - 1 && this.activeElement
      );
    }
  }

  addFile(event) {
    let file = event.target.files[0];

    if (file && file.size <= 2000000) {
      this.attachmentErrorMessage = '';
      this.disableAttachmentBtn = true;
      this.uploadFileMimetype = file.type;
      const arr = this.supportedMimeType.filter((results) => {
        return results.label === this.uploadFileMimetype;
      });

      if (arr.length) {
        this.fileType.name = arr[0].label;
        this.fileType.id = arr[0].value;
        this.tooltipmimeType = this.fileType.name;
      } else {
        this.fileType.name = 'Unknown';
        this.fileType.id = 1;
        this.tooltipmimeType = this.fileType.name;
      }
      this.setAttachmentFormData(file);
    } else {
      this.showAttachmentErrorMessage(file);
    }
  }

  setAttachmentFormData(file) {
    this.fileData = file;
    this.attachmentFieldsForm.controls['name'].setValue(
      this.attachmentFieldsForm.controls['name'].value
        ? this.attachmentFieldsForm.controls['name'].value
        : this.fileData.name
    );
    this.attachmentFieldsForm.controls['mimeType'].setValue(this.fileType.name);
    this.tooltipmimeType = this.fileType.name;
    this.enterDataToListView();
    this.validateAttachmentData();
  }
  /**
   * function to show error message when attachment size is greater than 2 MB
   * @param file
   */
  showAttachmentErrorMessage(file) {
    this.translateService
      .get(['DOCUMENT_DETAIL.ATTACHMENTS.FILESIZE_ERROR_MESSAGE'], {
        filename: file.name,
      })
      .subscribe((data) => {
        this.attachmentErrorMessage =
          data['DOCUMENT_DETAIL.ATTACHMENTS.FILESIZE_ERROR_MESSAGE'];
      });
  }
  /**
   * function to show latest attachement list also it scroll up to top and highlight last added attachment
   */
  showAttachmentForm() {
    this.showAttachment = !this.showAttachment;
    this.isHavingAttachment = true;
    this.attachmentFieldsForm.reset();
    this.fileData = '';
    this.disableAttachmentBtn = false;
    this.editAttachmentIndex = -1;
    this.tooltipmimeType = '';
    let attachmntObj: object = {
      name: '',
      mimeType: '',
      validity: '',
      description: '',
      fileData: '',
      id: '',
      isDownloadable: false,
      fileName: '',
    };
    this.attachmentArray.push(attachmntObj);
    this.selectedItem(this.attachmentArray.length - 1);
    this.scroll.nativeElement.scrollTop = 0;
  }
  /**
   * function to convert byte stream into size format
   * @param bytes
   * @param decimals
   * @returns
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
   * function to update the attachment data on user inputs to show in the list
   */
  updateAttachmentData() {
    this.enterDataToListView();
    this.validateAttachmentData();
  }
  /**
   * function to set the file data from checkedArray to show in attachment list
   */
  enterDataToListView() {
    if (this.attachmentArray?.length) {
      let attachmentIndex =
        this.editAttachmentIndex > -1
          ? this.editAttachmentIndex
          : this.attachmentArray.length - 1;
      let attachmentData = this.attachmentArray[attachmentIndex];
      attachmentData.name =
        this.attachmentFieldsForm.controls['name'].value.trim();
      attachmentData.mimeType =
        this.attachmentFieldsForm.controls['mimeType'].value;
      attachmentData.validity =
        this.attachmentFieldsForm.controls['validity'].value;
      attachmentData.description =
        this.attachmentFieldsForm.controls['description'].value;
      attachmentData.fileData = this.fileData;
      attachmentData.fileName = this.fileData.name;
      if (this.fileType.id) {
        attachmentData.mimeTypeId = this.fileType.id;
      }
    }
  }
  /**
   * function to validate attachment data when user edit the attachment form fields
   */
  validateAttachmentData() {
    let incompleteAttachment = this.attachmentArray.filter((attachment) => {
      const pattern = /[\\/:*?<>|"]/;
      return (
        !attachment.name ||
        !attachment.mimeType ||
        !attachment.fileData ||
        pattern.test(attachment.name)
      );
    });

    if (
      this.attachmentArray.length &&
      Array.isArray(incompleteAttachment) &&
      !incompleteAttachment.length
    ) {
      this.showAttachment = false;
      this.isHavingAttachment = true;
    } else if (
      Array.isArray(incompleteAttachment) &&
      incompleteAttachment.length
    ) {
      this.showAttachment = true;
    } else {
      this.showAttachment = false;
      this.isHavingAttachment = false;
    }
    if (this.fileData) this.disableAttachmentBtn = true;
    else this.disableAttachmentBtn = false;
  }
  /**
   * function to delete uploaded file from attachment form field
   */
  onDeleteUploadFile() {
    this.fileData = null;
    let attachmentIndex =
      this.editAttachmentIndex > -1
        ? this.editAttachmentIndex
        : this.attachmentArray.length - 1;
    this.attachmentArray[attachmentIndex]['fileData'] = '';
    this.attachmentArray[attachmentIndex]['isDownloadable'] = false;
    this.validateAttachmentData();
  }
  /**
   * function to edit file data when user select attachment from the list
   * @param index
   */

  editAttachmentData(index) {
    this.editAttachmentIndex = index > -1 ? index : '';
    this.attachmentFieldsForm.reset();
    this.fileData = '';
    let attachmentData = this.attachmentArray[index];
    this.populateAttachmentFormData(attachmentData, index);
    this.validateAttachmentData();
  }
  /**
   * function to delete attachment from attachment list
   * @param index
   */
  deleteAttachment(index) {
    this.editAttachmentIndex = index > -1 ? index : '';
    this.attachmentFieldsForm.reset();
    this.fileData = '';
    this.attachmentErrorMessage = '';
    if (this.attachmentArray.length && this.editAttachmentIndex > -1) {
      if (this.attachmentArray.length > 1) {
        let nextIndex =
          index == this.attachmentArray.length - 1
            ? this.editAttachmentIndex - 1
            : this.editAttachmentIndex;
        this.attachmentArray.splice(this.editAttachmentIndex, 1);
        let nextAttachmentData =
          nextIndex > -1 ? this.attachmentArray[nextIndex] : '';
        this.populateAttachmentFormData(nextAttachmentData, nextIndex);
        this.editAttachmentIndex = nextIndex;
        this.validateAttachmentData();
      } else {
        this.attachmentArray.splice(this.editAttachmentIndex, 1);
        this.showAttachment = false;
        this.isHavingAttachment = false;
        this.editAttachmentIndex = -1;
      }
    }
  }
  /**
   * function to populate attachment data in the respective form
   * @param attachmentData
   * @param index
   */
  populateAttachmentFormData(attachmentData, index) {
    if (attachmentData) {
      this.attachmentFieldsForm.controls['name'].setValue(
        attachmentData['name']
      );
      this.attachmentFieldsForm.controls['mimeType'].setValue(
        attachmentData['mimeType']
      );

      this.attachmentFieldsForm.controls['validity'].setValue(
        attachmentData['validity']
      );

      this.attachmentFieldsForm.controls['description'].setValue(
        attachmentData['description']
      );
      this.fileData = attachmentData['fileData'];
      this.tooltipmimeType = attachmentData['mimeType'];
      this.selectedItem(index);
    }
  }
  /**
   * function to get the filenameonly from the httpResponse
   * @param response
   * @returns
   */
  getFileName(response: HttpResponse<Blob>) {
    let filename: string;
    try {
      const contentDisposition: string = response.headers.get(
        'content-disposition'
      );
      filename = contentDisposition
        .split(';')[1]
        .split('filename')[1]
        .split('=')[1]
        .trim();
    } catch (e) {
      console.log(e);
    }
    return filename;
  }
  /**
   * function to download attachment file
   * @param index
   */
  downloadAttachment(index) {
    let attachmentIndex = index > -1 ? index : '';
    if (this.attachmentArray.length && attachmentIndex > -1) {
      let attachmentData = this.attachmentArray[attachmentIndex];
      let attachmentId = attachmentData.id;
      if (attachmentId) {
        this.attachmentUploadService
          .downloadFile(attachmentId)
          .pipe(
            catchError((err) => {
              return err;
            })
          )
          .subscribe((response: HttpResponse<Blob>) => {
            if (response) {
              let filename: string = this.getFileName(response);
              let binaryData = [];
              binaryData.push(response.body);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(
                new Blob(binaryData, { type: 'blob' })
              );
              downloadLink.setAttribute('download', filename);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            }
          });
      }
    }
  }
  /**
   * function to set attachemt details on edit
   * @param copyDocuments
   */
  preFillLatestDocument(copyDocuments) {
    this.fileData = '';
    this.disableAttachmentBtn = false;
    this.attachmentErrorMessage = '';
    this.isHavingAttachment = false;
    this.editAttachmentIndex = -1;
    this.isEditEnabled = false;
    this.showAttachment = false;
    this.setAttachmentData(copyDocuments);
    this.checkInitialData();
  }
  /**
   * function to push newly created attachment in the attachment array
   * @param document
   */
  setAttachmentData(document: DocumentDetailDTO) {
    let attachments: any = [];
    this.attachmentArray.length = 0;
    attachments = document.attachments ? document.attachments : [];
    this.setAllAttachmentData(attachments);
  }
  setAllAttachmentData(attachments) {
    if (attachments.length) {
      attachments.forEach((attachment) => {
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
        attachmntObj['validity'] = attachment.validFor?.endDateTime
          ? new Date(attachment.validFor.endDateTime)
          : '';
        attachmntObj['id'] = attachment.id ?? '';
        attachmntObj['isDownloadable'] = attachment.id ? true : false;
        this.attachmentArray.push(attachmntObj);
      });
    }
  }
}
