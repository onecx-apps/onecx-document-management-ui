// Core imports
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

// Application imports
import { GenericFormArrayComponent } from '../../generic-form-components/generic-form-array/generic-form-array.component';
import { DocumentCharacteristicCreateUpdateDTO } from 'src/app/generated';

@Component({
  selector: 'app-document-characteristics',
  templateUrl: './document-characteristics.component.html',
  styleUrls: ['./document-characteristics.component.scss'],
})
export class DocumentCharacteristicsComponent
  extends GenericFormArrayComponent<DocumentCharacteristicCreateUpdateDTO>
  implements OnInit, OnDestroy
{
  @Input() isSubmitting: boolean;
  @Input() charactersticsArray;

  emptyTemplateObject = {
    id: { value: null, validators: null },
    name: { value: '', validators: Validators.maxLength(40) },
    value: { value: '', validators: Validators.maxLength(40) },
  };

  ngOnInit(): void {
    if (this.charactersticsArray?.length)
      this.updateForm(this.charactersticsArray);
  }
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
  /** life cycle hook to set data on destroy */
  ngOnDestroy(): void {
    this.charactersticsArray.length = 0;
    let charactersticsData = this.genericFormArray.value?.length
      ? this.genericFormArray.value
      : [];
    charactersticsData.forEach((element, index) => {
      this.charactersticsArray.push(
        charactersticsData[charactersticsData.length - index - 1]
      );
    });
  }
}
