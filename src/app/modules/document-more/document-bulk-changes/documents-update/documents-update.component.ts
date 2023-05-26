// Core imports
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

// Third party imports
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api/selectitem';

// Application imports
import {
  DocumentDetailDTO,
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  LifeCycleState,
} from 'src/app/generated';
import { BulkUpdateInitFormField } from 'src/app/generated/model/DocumentUpdate';
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { trimSpaces } from 'src/app/utils';

@Component({
  selector: 'app-documents-update',
  templateUrl: './documents-update.component.html',
  styleUrls: ['./documents-update.component.scss'],
})
export class DocumentsUpdateComponent implements OnInit {
  @Input() checkedResults: DocumentDetailDTO[] = [];
  @Input() documentBulkUpdateForm: UntypedFormGroup;
  @Input() isSubmitting: boolean;
  @Output() documentVersion = new EventEmitter<string>();
  @Output() formValue = new EventEmitter<boolean>();

  checkedStatus = BulkUpdateInitFormField;
  allDocumentTypes: DocumentTypeDTO[];
  documentTypes: SelectItem[];
  documentStatus: SelectItem[];
  checkedArray = [];
  inputMessage = [];

  constructor(
    private readonly documentTypeV1Service: DocumentTypeControllerV1APIService,
    private readonly translateService: TranslateService,
    private readonly dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.loadAllDocumentTypes();
    this.loadDocumentStatus();
    this.initializeCheckedStatus();
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
   * function to get all dropdown values for document status form field
   */
  private loadDocumentStatus(): void {
    this.documentStatus = Object.keys(LifeCycleState).map((key) => ({
      label: LifeCycleState[key],
      value: key,
    }));
  }
  /**
   * function to show error message for invalid user inputs
   * @param formControl
   */
  showInputErrorMessage(formControl: string) {
    this.translateService
      .get(['DOCUMENT_MENU.DOCUMENT_EDIT.INVALID_VALUE_ERROR'])
      .subscribe((data) => {
        this.inputMessage[formControl] =
          data['DOCUMENT_MENU.DOCUMENT_EDIT.INVALID_VALUE_ERROR'];
      });
  }
  /**
   * function to trim empty space from the begining and end of the form field on paste event
   */
  trimSpaceOnPaste(
    event: ClipboardEvent,
    controlName: string,
    maxlength?: number
  ) {
    this.documentBulkUpdateForm = trimSpaces(
      event,
      controlName,
      this.documentBulkUpdateForm,
      maxlength
    );
    this.formValue.emit(true);
  }
  /**
   * function to eliminate space from the beginning of the required fields on key press event
   */
  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }

  /**
   * Reset form field if form input value is empty
   */
  clearField(event: any, controlName: string, inputType: number) {
    switch (inputType) {
      case 1:
        if (!event.target.value) this.fieldReset(controlName);
        else this.inputMessage[controlName] = '';
        break;
      case 2:
        if (!event.value) this.fieldReset(controlName);
        else this.inputMessage[controlName] = '';
        break;
      case 3:
        if (event) this.inputMessage[controlName] = '';
        break;
    }
    this.formValue.emit(true);
  }
  /**
   * function to reset the fields
   */
  fieldReset(controlName: string) {
    this.documentBulkUpdateForm?.controls[controlName].reset();
    this.checkedArray.forEach((el) => {
      if (el.name == controlName && el.isChecked && el.checked != '0')
        this.showInputErrorMessage(el.name);
    });
    this.formValue.emit(true);
  }

  /**
   * function to check checkbox event of field and show message on invalid or empty value
   */
  onCheckField(formControl: string, val: string): void {
    if (val !== '' && val !== null) this.inputMessage[formControl] = '';
    else this.showInputErrorMessage(formControl);
  }

  /**
   * function to get value of checked field
   */
  getCheckedStatus(formControl: string, event: any): void {
    let len = this.checkedArray.length;
    if (!event?.checked) this.inputMessage[formControl] = '';

    this.checkedArray?.forEach((el) => {
      if (!event?.checked && el?.name == formControl)
        this.checkedArray.splice(this.checkedArray.indexOf(el), 1);
      else if (this.checkedArray.indexOf(el) + 1 == len)
        this.checkedArray.push({ name: formControl, isChecked: event.checked });
    });
    if (len == 0) {
      this.checkedArray.push({ name: formControl, isChecked: event.checked });
    }
    this.formValue.emit(true);
  }

  /**
   * @param evt document event
   * @returns prevent character e and operators (+, -)
   */
  onKeyDocVersionPress(evt) {
    if (evt.which === 46) {
      return;
    }
    if (
      (evt.which != 8 && evt.which != 0 && evt.which < 48) ||
      evt.which > 57
    ) {
      evt.preventDefault();
    }
  }

  /**
   * @param evt document event
   * emits newly updated documenr version value
   */
  onKeyDocVersionUp(evt) {
    this.documentVersion.emit(evt.target.value);
  }
  /**
   * function to set checkbox state
   */
  initializeCheckedStatus() {
    let val = this.documentBulkUpdateForm?.controls;
    let checkedValues = this.dataSharingService.getUpdateModification();
    Object.entries(this.documentBulkUpdateForm.value).map((el) => {
      let controlName = el[0];
      if (
        (el[1] === '' || el[1] == null) &&
        this.checkedStatus[controlName] &&
        this.checkedStatus[controlName] != '0'
      )
        this.showInputErrorMessage(el[0]);
    });
    Object.keys(val).map((el) => {
      checkedValues?.map((data) => {
        let name = data.name;
        if (name == el) this.checkedStatus[name] = data.isChecked;
      });
    });
  }
}
