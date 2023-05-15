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
  selector: 'app-document-description',
  templateUrl: './document-description.component.html',
  styleUrls: ['./document-description.component.scss'],
  providers: [UntypedFormBuilder],
})
export class DocumentDescriptionComponent implements OnInit {
  constructor(
    private readonly documentTypeRestApi: DocumentTypeControllerV1APIService
  ) {}
  @Output()
  public allDocumentTypes: DocumentTypeDTO[];
  public documentTypes: SelectItem[];
  public documentStatus: SelectItem[];
  @Input() public documentDescriptionForm: UntypedFormGroup;
  @Output() documentVersion = new EventEmitter<String>();
  ngOnInit(): void {
    this.loadAllDocumentTypes();
    this.loadDocumentStatus();
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
    // set "DRAFT" as default value for document status dropdown
    let docStatusDraft = this.documentStatus.filter(
      (document) => document.value.toLowerCase() == 'draft'
    );
    if (docStatusDraft.length > 0) {
      this.documentDescriptionForm.controls.lifeCycleState.patchValue(
        docStatusDraft[1].value
      );
    }
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
