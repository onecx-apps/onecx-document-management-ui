import { Component } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
} from '@angular/forms';

@Component({
  template: '',
})
export class GenericFormArrayComponent<T> {
  public genericFormArray = new UntypedFormArray([]);
  public emptyTemplateObject = {};
  public objects: T[];

  constructor(private readonly fb: UntypedFormBuilder) {}

  public updateForm(objectArray: T[]): void {
    this.objects = JSON.parse(JSON.stringify(objectArray));
    this.genericFormArray.clear();
    objectArray.forEach((element) => {
      const group = new UntypedFormGroup({});
      Object.keys(this.emptyTemplateObject).forEach((attr) => {
        group.addControl(
          attr,
          element[attr]
            ? new UntypedFormControl(
                element[attr],
                this.emptyTemplateObject[attr].validators
              )
            : new UntypedFormControl(
                this.emptyTemplateObject[attr].value,
                this.emptyTemplateObject[attr].validators
              )
        );
      });
      this.genericFormArray.insert(0, group);
    });
  }

  public addEmptyForm(): void {
    const group = new UntypedFormGroup({});
    Object.keys(this.emptyTemplateObject).forEach((key) => {
      group.addControl(
        key,
        new UntypedFormControl(
          this.emptyTemplateObject[key].value,
          this.emptyTemplateObject[key].validators
        )
      );
    });
    this.genericFormArray.insert(0, group);
  }

  public removeForm(index: number): void {
    this.genericFormArray.removeAt(index);
  }
}
