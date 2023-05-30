// Core imports
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  template: '',
})
export class GenericFormGroupComponent<T> implements OnInit {
  public genericFormGroup: UntypedFormGroup;
  public emptyTemplateObject = {};

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
  /**
   * function to update genericFormGroup
   * @param object
   */
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
