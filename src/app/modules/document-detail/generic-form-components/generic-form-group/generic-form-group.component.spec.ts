import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { AttachmentDTO } from 'src/app/generated';

import { GenericFormGroupComponent } from './generic-form-group.component';

describe('GenericFormGroupComponent', () => {
  let component: GenericFormGroupComponent<AttachmentDTO>;
  let fixture: ComponentFixture<GenericFormGroupComponent<AttachmentDTO>>;
  let object = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericFormGroupComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    object = {
      attr1: 'value1',
      attr2: 'value2',
      attr3: null,
    };
    component.emptyTemplateObject = {
      attr1: { value: 'default1', validators: [] },
      attr2: { value: 'default2', validators: [] },
      attr3: { value: 'default3', validators: [] },
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add controls based on emptyTemplateObject', () => {
    const emptyTemplateObject = {
      attr1: { value: 'value1', validators: [] },
      attr2: { value: 'value2', validators: [] },
      attr3: { value: 'value3', validators: [] },
    };
    component.emptyTemplateObject = emptyTemplateObject;
    component.ngOnInit();
    expect(component.genericFormGroup.controls['attr1']).toBeDefined();
    expect(component.genericFormGroup.controls['attr2']).toBeDefined();
    expect(component.genericFormGroup.controls['attr3']).toBeDefined();
  });

  it('should set correct initial values and validators', () => {
    const emptyTemplateObject = {
      attr1: { value: 'value1', validators: [Validators.required] },
      attr2: { value: 'value2', validators: [Validators.minLength(3)] },
    };
    component.emptyTemplateObject = emptyTemplateObject;
    component.ngOnInit();
    const attr1Control = component.genericFormGroup.controls['attr1'];
    const attr2Control = component.genericFormGroup.controls['attr2'];
    expect(attr1Control.value).toBe('value1');
    expect(attr2Control.value).toBe('value2');
  });

  it('should update form controls with object values if they exist', () => {
    component.updateForm(object);
    expect(component.genericFormGroup.controls['attr1'].value).toBe('value1');
    expect(component.genericFormGroup.controls['attr2'].value).toBe('value2');
    expect(component.genericFormGroup.controls['attr3'].value).toBe('default3');
  });

  it('should set form controls to default values if object values do not exist', () => {
    object = {};
    component.updateForm(object);
    expect(component.genericFormGroup.controls['attr1'].value).toBe('default1');
    expect(component.genericFormGroup.controls['attr2'].value).toBe('default2');
    expect(component.genericFormGroup.controls['attr3'].value).toBe('default3');
  });

  it('should set form controls with correct validators', () => {
    component.emptyTemplateObject = {
      attr1: { value: 'default1', validators: [Validators.required] },
      attr2: { value: 'default2', validators: [Validators.minLength(3)] },
      attr3: { value: 'default3', validators: [] },
    };
    component.updateForm(object);
    expect(component.genericFormGroup.controls['attr3'].validator).toBeFalsy();
  });
});
