import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

@Component({
  template: '',
})
export class GenericFormGroupComponent<T> implements OnInit {
  public genericFormGroup: UntypedFormGroup;
  public emptyTemplateObject = {};

  constructor(private readonly fb: UntypedFormBuilder) {}

  public ngOnInit(): void {
    this.genericFormGroup = new UntypedFormGroup({});
    Object.keys(this.emptyTemplateObject).forEach((attr) => {
      this.genericFormGroup.addControl(
        attr,
        new UntypedFormControl(
          this.emptyTemplateObject[attr].value,
          this.emptyTemplateObject[attr].validators
        )
      );
    });
  }

  public updateForm(object: T): void {
    this.genericFormGroup = new UntypedFormGroup({});
    Object.keys(this.emptyTemplateObject).forEach((attr) => {
      this.genericFormGroup.addControl(
        attr,
        object[attr]
          ? new UntypedFormControl(
              object[attr],
              this.emptyTemplateObject[attr].validators
            )
          : new UntypedFormControl(
              this.emptyTemplateObject[attr].value,
              this.emptyTemplateObject[attr].validators
            )
      );
    });
  }
}
