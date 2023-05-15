import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api/selectitem';
import {
  DocumentDetailDTO,
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  LifeCycleState,
} from 'src/app/generated';
import { trimSpaces } from 'src/app/utils';

@Component({
  selector: 'app-documents-update',
  templateUrl: './documents-update.component.html',
  styleUrls: ['./documents-update.component.scss'],
})
export class DocumentsUpdateComponent implements OnInit {
  constructor(
    private readonly documentTypeRestApi: DocumentTypeControllerV1APIService,
    private fb: UntypedFormBuilder,
    private readonly translateService: TranslateService
  ) {}
  @Input() checkedResults: DocumentDetailDTO[] = [];
  @Input() public documentBulkUpdateForm: UntypedFormGroup;
  public allDocumentTypes: DocumentTypeDTO[];
  public documentTypes: SelectItem[];
  public documentStatus: SelectItem[];
  @Output() documentVersion = new EventEmitter<String>();
  @Output() formValue = new EventEmitter<Boolean>();
  @Input() isSubmitting: boolean;
  checkedArray = [];
  inputMessage = [];

  ngOnInit(): void {
    this.loadAllDocumentTypes();
    this.loadDocumentStatus();
  }

  private loadAllDocumentTypes(): void {
    this.documentTypeRestApi.getAllTypesOfDocument().subscribe((results) => {
      this.allDocumentTypes = results;
      this.documentTypes = results.map((type) => ({
        label: type.name,
        value: type.id,
      }));
    });
  }

  private loadDocumentStatus(): void {
    this.documentStatus = Object.keys(LifeCycleState).map((key) => ({
      label: LifeCycleState[key],
      value: key,
    }));
  }
  showInputErrorMessage(formControl: string) {
    this.translateService
      .get(['DOCUMENT_MENU.DOCUMENT_EDIT.INVALID_VALUE_ERROR'])
      .subscribe((data) => {
        this.inputMessage[formControl] =
          data['DOCUMENT_MENU.DOCUMENT_EDIT.INVALID_VALUE_ERROR'];
      });
  }

  /**
   * function to eliminate space from the beginning of the required fields
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

  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }

  /**
   *
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
    this.checkedArray.map((el) => {
      if (el.name == controlName && el.isChecked == true)
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
    if (event?.checked == false) this.inputMessage[formControl] = '';

    this.checkedArray?.forEach((el) => {
      if (event?.checked == false && el?.name == formControl)
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
   *
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
   *
   * @param evt document event
   * emits newly updated documenr version value
   */
  onKeyDocVersionUp(evt) {
    this.documentVersion.emit(evt.target.value);
  }
}
