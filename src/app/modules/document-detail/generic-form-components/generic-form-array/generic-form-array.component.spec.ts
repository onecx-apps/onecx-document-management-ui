import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AttachmentDTO } from 'src/app/generated';

import { GenericFormArrayComponent } from './generic-form-array.component';

describe('BasicFormArrayComponent', () => {
  let component: GenericFormArrayComponent<AttachmentDTO>;
  let fixture: ComponentFixture<GenericFormArrayComponent<AttachmentDTO>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericFormArrayComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFormArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an empty form at the beginning of the form array', () => {
    const formArray = new FormArray([]);
    component.genericFormArray = formArray;
    const emptyTemplateObject = {};
    component.addEmptyForm();
    expect(component.genericFormArray.length).toBe(1);
    expect(component.genericFormArray.at(0)).toBeInstanceOf(FormGroup);
    const addedForm = component.genericFormArray.at(0) as FormGroup;
    expect(addedForm.getRawValue()).toEqual(emptyTemplateObject);
  });
  it('should update the form with the provided object array', () => {
    const objectArray: AttachmentDTO[] = [
      {
        creationDate: '23-02-2023',
        creationUser: 'john',
        modificationDate: '09-03-2023',
        modificationUser: 'john',
        version: 1,
        id: '1',
        description: 'sample test case',
        externalStorageURL: '',
        name: 'attachment',
        size: 1,
        storage: '',
        type: '',
        fileName: '',
        storageUploadStatus: true,
      },
    ];
    component.updateForm(objectArray);
    expect(component.objects).toEqual(objectArray);
    const formArray = component.genericFormArray as FormArray;
    expect(formArray.length).toBe(objectArray.length);
    objectArray.forEach((element, index) => {
      const formGroup = formArray.at(index) as FormGroup;
      Object.keys(element).forEach((attr) => {
        expect(formGroup.controls[attr]).toBe(undefined);
      });
    });
  });
  it('should remove form at the specified index', () => {
    const index = 1;
    component.genericFormArray = jasmine.createSpyObj('genericFormArray', [
      'removeAt',
    ]);
    component.removeForm(index);
    expect(component.genericFormArray.removeAt).toHaveBeenCalledWith(index);
  });
});
