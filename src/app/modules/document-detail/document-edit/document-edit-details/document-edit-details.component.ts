// Core imports
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Third party imports
import { SelectItem } from 'primeng/api';

// Application imports
import {
  DocumentTypeControllerV1APIService,
  DocumentTypeDTO,
  LifeCycleState,
} from 'src/app/generated';
import { trimSpaces } from 'src/app/utils';
import { DataSharingService } from 'src/app/shared/data-sharing.service';

@Component({
  selector: 'app-document-edit-details',
  templateUrl: './document-edit-details.component.html',
  styleUrls: ['./document-edit-details.component.scss'],
  providers: [UntypedFormBuilder],
})
export class DocumentEditDetailsComponent implements OnInit {
  @Input() documentDescriptionForm: UntypedFormGroup;
  @Input() isEditable: boolean;
  @Output() documentVersion = new EventEmitter<string>();

  allDocumentTypes: DocumentTypeDTO[];
  documentTypes: SelectItem[];
  documentStatus: SelectItem[];
  specialChar: string;

  constructor(
    private readonly documentTypeV1Service: DocumentTypeControllerV1APIService,
    private readonly dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.loadAllDocumentTypes();
    this.loadDocumentStatus();
    this.specialChar = this.dataSharingService.specialChar;
  }
  ngOnChanges() {
    if (!this.isEditable) {
      this.documentDescriptionForm.disable();
    } else {
      this.documentDescriptionForm.enable();
    }
  }
  /**
   *function to trim empty space from the begining and end of the form field on blur event
   */
  trimSpace(event: any) {
    let controlName = event.target.getAttribute('formControlName');
    let value = event.target.value.trim();
    this.documentDescriptionForm.controls[controlName].setValue(value);
  }
  /**
   * function to eliminate space from the beginning of the required fields on key press event
   */
  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }
  /**
   * function to trim empty space from the begining and end of the form field on paste event
   */
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
