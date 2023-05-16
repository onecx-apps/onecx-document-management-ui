import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

import { DocumentCharacteristicCreateUpdateDTO } from 'src/app/generated';
import { GenericFormArrayComponent } from '../../generic-form-components/generic-form-array/generic-form-array.component';

@Component({
  selector: 'app-document-edit-characteristics',
  templateUrl: './document-edit-characteristics.component.html',
  styleUrls: ['./document-edit-characteristics.component.scss'],
})
export class DocumentEditCharacteristicsComponent
  extends GenericFormArrayComponent<DocumentCharacteristicCreateUpdateDTO>
  implements OnInit
{
  public array: DocumentCharacteristicCreateUpdateDTO;
  public emptyTemplateObject = {
    id: { value: null, validators: null },
    name: { value: '', validators: Validators.maxLength(40) },
    value: { value: '', validators: Validators.maxLength(40) },
  };

  @Input() isEditable: boolean;
  ngOnInit(): void {}
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

  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }
}
