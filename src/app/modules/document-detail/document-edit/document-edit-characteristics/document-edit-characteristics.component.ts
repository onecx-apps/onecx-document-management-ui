// Core imports
import { Component, Input } from '@angular/core';
import { Validators } from '@angular/forms';

// Application imports
import { GenericFormArrayComponent } from '../../generic-form-components/generic-form-array/generic-form-array.component';
import { DocumentCharacteristicCreateUpdateDTO } from 'src/app/generated';

@Component({
  selector: 'app-document-edit-characteristics',
  templateUrl: './document-edit-characteristics.component.html',
  styleUrls: ['./document-edit-characteristics.component.scss'],
})
export class DocumentEditCharacteristicsComponent extends GenericFormArrayComponent<DocumentCharacteristicCreateUpdateDTO> {
  @Input() isEditable: boolean;

  array: DocumentCharacteristicCreateUpdateDTO;
  emptyTemplateObject = {
    id: { value: null, validators: null },
    name: { value: '', validators: Validators.maxLength(40) },
    value: { value: '', validators: Validators.maxLength(40) },
  };

  /**
   *function to trim empty space from the begining and end of the form field on blur event
   */
  trimSpace() {
    let id = this.genericFormArray.controls[0].value.id;
    let name = this.genericFormArray.controls[0].value.name.trim();
    let value = this.genericFormArray.controls[0].value.value.trim();
    this.genericFormArray.controls[0].patchValue({
      id: id,
      name: name,
      value: value,
    });
  }
  /**
   * function to eliminate space from the beginning of the required fields on key press event
   */
  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }
}
