import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { DocumentTypeControllerV1APIService } from 'src/app/generated';

@Component({
  selector: 'app-document-edit-related-objects',
  templateUrl: './document-edit-related-objects.component.html',
  styleUrls: ['./document-edit-related-objects.component.scss'],
})
export class DocumentEditRelatedObjectsComponent implements OnInit {
  constructor() {}
  @Input() public documentDescriptionForm: UntypedFormGroup;

  ngOnInit(): void {}

  trimSpace(event: any) {
    let controlName = event.target.getAttribute('formControlName');
    let value = event.target.value.trim();
    this.documentDescriptionForm.controls[controlName].setValue(value);
  }

  preventSpace(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space')
      event.preventDefault();
  }
}
