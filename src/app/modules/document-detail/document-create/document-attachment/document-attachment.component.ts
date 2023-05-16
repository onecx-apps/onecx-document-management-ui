import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import {
  SupportedMimeTypeControllerV1APIService,
  SupportedMimeTypeDTO,
} from 'src/app/generated';
@Component({
  selector: 'app-document-attachment',
  templateUrl: './document-attachment.component.html',
  styleUrls: ['./document-attachment.component.scss'],
})
export class DocumentAttachmentComponent implements OnInit {
  translatedData: any;
  attachmentFieldsForm: UntypedFormGroup;
  fileData: any;
  disableAttachmentBtn = false;
  attachmentErrorMessage = '';
  isHavingAttachment = false;
  editAttachmentIndex = -1;
  isEditEnabled = false;
  public showAttachment: boolean;
  public activeElement = 0;
  @Input() public attachmentArray;
  @ViewChild('attachmentList') private scroll: ElementRef;
  public supportedMimeType: SelectItem[];
  public loadedSupportedMimeType: SupportedMimeTypeDTO[];
  uploadFileMimetype: any;
  fileType: any = {};
  maxlengthDescription = 500;
  tooltipmimeType: string;

  constructor(
    private readonly translateService: TranslateService,
    private readonly supportedMimeTypeAPI: SupportedMimeTypeControllerV1APIService
  ) {}

  ngOnInit(): void {
    this.showAttachment = false;
    this.attachmentFieldsForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mimeType: new FormControl(''),
      validity: new FormControl(),
      description: new FormControl('', Validators.maxLength(500)),
    });
    this.checkInitialData();
    this.getMimetype();
  }
  /**
   * function to eliminate space from the beginning of the required fields
   */
  trimSpace(event: any) {
    let controlName = event.target.getAttribute('formControlName');
    let value = event.target.value.trim();
    this.attachmentFieldsForm.controls[controlName].setValue(value);
  }
  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }

  /**
   * function to reset the datefield
   */
  resetDate() {
    this.attachmentFieldsForm.controls['validity'].setValue(null);
  }
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
  public selectedItem(id) {
    this.activeElement = id;
  }
  checkInitialData() {
    if (this.attachmentArray && this.attachmentArray.length) {
      this.populateAttachmentFormData(
        this.attachmentArray[this.attachmentArray.length - 1],
        this.attachmentArray.length - 1
      );
      this.validateAttachmentData();
    }
  }

  addFile(event) {
    let file = event.target.files[0];
    if (file && file.size <= 2000000) {
      this.attachmentErrorMessage = '';
      this.uploadFileMimetype = file.type;
      this.disableAttachmentBtn = true;
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
    this.attachmentFieldsForm.controls['name'].setValue(this.fileData.name);
    this.attachmentFieldsForm.controls['mimeType'].setValue(this.fileType.name);
    this.tooltipmimeType = this.fileType.name;
    this.enterDataToListView();
    this.validateAttachmentData();
  }

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
      fileName: '',
    };
    this.attachmentArray.push(attachmntObj);
    this.selectedItem(this.attachmentArray.length - 1);
    this.scroll.nativeElement.scrollTop = 0;
  }

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

  updateAttachmentData() {
    this.enterDataToListView();
    this.validateAttachmentData();
  }

  enterDataToListView() {
    if (this.attachmentArray && this.attachmentArray.length) {
      let attachmentIndex =
        this.editAttachmentIndex > -1
          ? this.editAttachmentIndex
          : this.attachmentArray.length - 1;
      let attachmentData = this.attachmentArray[attachmentIndex];
      attachmentData.name = this.attachmentFieldsForm.controls['name'].value;
      attachmentData.mimeType =
        this.attachmentFieldsForm.controls['mimeType'].value;
      attachmentData.validity =
        this.attachmentFieldsForm.controls['validity'].value;
      attachmentData.description =
        this.attachmentFieldsForm.controls['description'].value;
      attachmentData.fileData = this.fileData;
      attachmentData.fileName = this.fileData.name;
      attachmentData.mimeTypeId = this.fileType.id;
    }
  }

  validateAttachmentData() {
    let incompleteAttachment = this.attachmentArray.filter((attachment) => {
      return !attachment.name || !attachment.mimeType || !attachment.fileData;
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

  onDeleteUploadFile() {
    this.fileData = null;
    let attachmentIndex =
      this.editAttachmentIndex > -1
        ? this.editAttachmentIndex
        : this.attachmentArray.length - 1;
    this.attachmentArray[attachmentIndex]['fileData'] = '';
    this.validateAttachmentData();
  }

  editAttachmentData(index) {
    this.editAttachmentIndex = index > -1 ? index : '';
    this.attachmentFieldsForm.reset();
    this.fileData = '';
    let attachmentData = this.attachmentArray[index];
    this.populateAttachmentFormData(attachmentData, index);
    this.validateAttachmentData();
  }

  deleteAttachment(index) {
    this.editAttachmentIndex = index > -1 ? index : '';
    this.attachmentFieldsForm.reset();
    this.fileData = '';
    this.attachmentErrorMessage = '';
    if (this.attachmentArray && this.editAttachmentIndex > -1) {
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
}
