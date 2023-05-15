import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { DocumentCharacteristicCreateUpdateDTO } from 'src/app/generated';
import { GenericFormArrayComponent } from '../../generic-form-components/generic-form-array/generic-form-array.component';

@Component({
  selector: 'app-document-characteristics',
  templateUrl: './document-characteristics.component.html',
  styleUrls: ['./document-characteristics.component.scss'],
})
export class DocumentCharacteristicsComponent
  extends GenericFormArrayComponent<DocumentCharacteristicCreateUpdateDTO>
  implements OnInit, OnDestroy
{
  public emptyTemplateObject = {
    id: { value: null, validators: null },
    name: { value: '', validators: Validators.maxLength(40) },
    value: { value: '', validators: Validators.maxLength(40) },
  };
  @Input() public isSubmitting: boolean;
  @Input() public charactersticsArray;
  ngOnInit(): void {
    if (this.charactersticsArray && this.charactersticsArray.length)
      this.updateForm(this.charactersticsArray);
  }

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

  ngOnDestroy(): void {
    this.charactersticsArray.length = 0;
    let charactersticsData =
      this.genericFormArray.value && this.genericFormArray.value.length
        ? this.genericFormArray.value
        : [];
    charactersticsData.forEach((element, index) => {
      this.charactersticsArray.push(
        charactersticsData[charactersticsData.length - index - 1]
      );
    });
  }
}
