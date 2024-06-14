// Core imports
import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-document-edit-related-objects',
  templateUrl: './document-edit-related-objects.component.html',
})
export class DocumentEditRelatedObjectsComponent {
  @Input() documentDescriptionForm: UntypedFormGroup;

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
}
