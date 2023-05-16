import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import {
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  LifeCycleState,
} from 'src/app/generated';
import { trimSpaces } from 'src/app/utils';

@Component({
  selector: 'app-document-edit-details',
  templateUrl: './document-edit-details.component.html',
  styleUrls: ['./document-edit-details.component.scss'],
  providers: [UntypedFormBuilder],
})
export class DocumentEditDetailsComponent implements OnInit {
  constructor(
    private readonly documentTypeRestApi: DocumentTypeControllerV1APIService
  ) {}
  @Output()
  public allDocumentTypes: DocumentTypeDTO[];
  public documentTypes: SelectItem[];
  public documentStatus: SelectItem[];
  @Input() public documentDescriptionForm: UntypedFormGroup;
  @Output() documentVersion = new EventEmitter<String>();
  @Input() isEditable: boolean;
  ngOnInit(): void {
    this.loadAllDocumentTypes();
    this.loadDocumentStatus();
  }
  ngOnChanges() {
    if (!this.isEditable) {
      this.documentDescriptionForm.disable();
    } else {
      this.documentDescriptionForm.enable();
    }
  }
  /**
   * function to eliminate space from the beginning of the required fields
   */
  trimSpace(event: any) {
    let controlName = event.target.getAttribute('formControlName');
    let value = event.target.value.trim();
    this.documentDescriptionForm.controls[controlName].setValue(value);
  }

  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }

  trimSpaceOnPaste(
    event: ClipboardEvent,
    controlName: string,
    maxlength: number
  ) {
    this.documentDescriptionForm = trimSpaces(
      event,
      controlName,
      this.documentDescriptionForm,
      maxlength
    );
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
