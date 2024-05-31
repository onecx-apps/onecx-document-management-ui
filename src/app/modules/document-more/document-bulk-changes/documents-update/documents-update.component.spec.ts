import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { providePortalMessageServiceMock } from '@onecx/portal-integration-angular/mocks';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';

import { DocumentsUpdateComponent } from './documents-update.component';
import { DataSharingService } from '../../../../shared/data-sharing.service';

describe('DocumentsUpdateComponent', () => {
  let component: DocumentsUpdateComponent;
  let fixture: ComponentFixture<DocumentsUpdateComponent>;
  let controlName = 'documentDescription';
  let dataSharingService: DataSharingService;

  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsUpdateComponent, TranslatePipeMock],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: DataSharingService },
        providePortalMessageServiceMock(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsUpdateComponent);
    component = fixture.componentInstance;
    dataSharingService = TestBed.inject(DataSharingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check inputMesssage is defined', () => {
    component.showInputErrorMessage(controlName);
    expect(component.inputMessage).toBeDefined();
  });

  it('should call initializeCheckedStatus and set checkedStatus values', () => {
    spyOn(component, 'initializeCheckedStatus');
    component.ngOnInit();
    expect(component.initializeCheckedStatus).toHaveBeenCalled();
    expect(component.checkedStatus).toBeDefined();
  });

  it('should call initializeCheckedStatus and set checkedStatus values', () => {
    spyOn(component, 'initializeCheckedStatus');
    component.ngOnInit();
    expect(component.initializeCheckedStatus).toHaveBeenCalled();
    expect(component.checkedStatus).toBeDefined();
  });

  it('should call emit event of formValue', () => {
    const event = {
      clipboardData: new DataTransfer(),
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    event.clipboardData.setData('text', ' trimmedValue ');
    component.documentBulkUpdateForm = new FormGroup({
      documentDescription: new FormControl(),
    });
    component.documentBulkUpdateForm.controls[controlName].patchValue('test');
    spyOn(component.formValue, 'emit');
    component.trimSpaceOnPaste(event as unknown as ClipboardEvent, controlName);
    expect(component.formValue.emit).toHaveBeenCalled();
  });

  it('should prevent space key press at the beginning of the input', () => {
    const event = {
      target: {
        selectionStart: 0,
      },
      code: 'Space',
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.preventSpace(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call fieldReset if inputType is 1 and value is null', () => {
    const event = {
      target: {
        value: '',
      },
    };
    const inputType = 1;
    spyOn(component, 'fieldReset');
    component.clearField(event, controlName, inputType);
    expect(component.fieldReset).toHaveBeenCalled();
  });

  it('should clear inputMessage field if inputType is 1 and value is not null', () => {
    const event = {
      target: {
        value: 'Test',
      },
    };
    const inputType = 1;
    component.clearField(event, controlName, inputType);
    expect(component.inputMessage[controlName]).toBe('');
  });

  it('should call fieldReset if inputType is 2 and value is null', () => {
    const event = {
      value: '',
    };
    const inputType = 2;
    spyOn(component, 'fieldReset');
    component.clearField(event, controlName, inputType);
    expect(component.fieldReset).toHaveBeenCalled();
  });

  it('should clear inputMessage field if inputType is 2 and value is not null', () => {
    const event = {
      value: 'Test',
    };
    const inputType = 2;
    component.clearField(event, controlName, inputType);
    expect(component.inputMessage[controlName]).toBe('');
  });

  it('should clear inputMessage field if inputType is 3', () => {
    const event = {
      target: {
        value: 'Test',
      },
    };
    const inputType = 1;
    component.clearField(event, controlName, inputType);
    expect(component.inputMessage[controlName]).toBe('');
  });

  it('should reset controls details and call showInputErrorMessage', () => {
    component.checkedArray = [
      {
        name: controlName,
        isChecked: 1,
      },
    ];
    spyOn(component, 'showInputErrorMessage');
    component.fieldReset(controlName);
    expect(component.showInputErrorMessage).toHaveBeenCalled();
  });

  it('should call showInputErrorMessage if value is null', () => {
    const value = '';
    spyOn(component, 'showInputErrorMessage');
    component.onCheckField(controlName, value);
    expect(component.showInputErrorMessage).toHaveBeenCalled();
  });

  it('should clear inputMessage field if value is not null', () => {
    const value = 'Test';
    component.onCheckField(controlName, value);
    expect(component.inputMessage[controlName]).toBe('');
  });

  it('should check length of checkedArray to be 0 and inputMessage to be blank', () => {
    const event = {
      checked: false,
    };
    component.checkedArray = [
      {
        name: controlName,
        isChecked: 1,
      },
    ];
    component.getCheckedStatus(controlName, event);
    expect(component.checkedArray.length).toBe(0);
    expect(component.inputMessage[controlName]).toBe('');
  });

  it('should check length of checkedArray to be 1', () => {
    const event = {
      checked: false,
    };
    component.checkedArray = [];
    component.getCheckedStatus(controlName, event);
    expect(component.checkedArray.length).toBe(1);
  });

  it('should call preventDefault method when document event value is 50', () => {
    const event = {
      which: 58,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.onKeyDocVersionPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call emit of documentVersion', () => {
    const event = {
      target: {
        value: 1.0,
      },
    };
    spyOn(component.documentVersion, 'emit');
    component.onKeyDocVersionUp(event);
    expect(component.documentVersion.emit).toHaveBeenCalled();
  });

  it('should allow the decimal point (.) key press', () => {
    const mockEvent = {
      which: 46,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.onKeyDocVersionPress(mockEvent);
    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent key press for non-numeric keys', () => {
    const nonNumericKeys = [33, 42, 64];
    const mockEvent = {
      which: 0,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    nonNumericKeys.forEach((keyCode) => {
      mockEvent.which = keyCode;
      component.onKeyDocVersionPress(mockEvent);
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  it('should allow key press for numeric keys', () => {
    const numericKeys = [48, 49, 50];
    const mockEvent = {
      which: 0,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    numericKeys.forEach((keyCode) => {
      mockEvent.which = keyCode;
      component.onKeyDocVersionPress(mockEvent);
      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });
  });

  it('should show input error message for checked values with empty or null values', () => {
    const mockCheckedArray = [
      { name: 'control1', isChecked: true, value: null },
      { name: 'control2', isChecked: true, value: '' },
      { name: 'control3', isChecked: false, value: null },
    ];
    spyOn(dataSharingService, 'getUpdateModification').and.returnValue(
      mockCheckedArray
    );
    spyOn(component, 'showInputErrorMessage');
    component.initializeCheckedStatus();
    expect(dataSharingService.getUpdateModification).toHaveBeenCalled();
    expect(component.showInputErrorMessage).toHaveBeenCalledTimes(2);
    expect(component.showInputErrorMessage).toHaveBeenCalledWith('control1');
    expect(component.showInputErrorMessage).toHaveBeenCalledWith('control2');
  });

  it('should set checked status based on data from the service', () => {
    const mockData = [
      { name: 'control1', isChecked: true },
      { name: 'control2', isChecked: false },
    ];
    const mockControls = {
      control1: new FormControl(),
      control2: new FormControl(),
      control3: new FormControl(),
    };
    component.documentBulkUpdateForm = new FormGroup(mockControls);
    spyOn(dataSharingService, 'getUpdateModification').and.returnValue(
      mockData
    );
    component.initializeCheckedStatus();
    expect(dataSharingService.getUpdateModification).toHaveBeenCalled();
    expect(component.checkedStatus['control1']).toBe(true);
    expect(component.checkedStatus['control2']).toBe(false);
    expect(component.checkedStatus['control3']).toBeUndefined();
  });

  it('should remove element from checkedArray when event is not checked', () => {
    const formControl = 'FormControl';
    const event = { checked: false };
    component.checkedArray = [
      { name: 'formControl1', isChecked: true },
      { name: formControl, isChecked: true },
      { name: 'formControl3', isChecked: true },
    ];
    component.getCheckedStatus(formControl, event);
    expect(component.checkedArray).toEqual([
      { name: 'formControl1', isChecked: true },
      { name: 'formControl3', isChecked: true },
    ]);
  });

  it('should add element to checkedArray when event is checked and the element does not exist', () => {
    const formControl = 'FormControl';
    const event = { checked: true };
    component.checkedArray = [
      { name: 'formControl1', isChecked: true },
      { name: 'formControl2', isChecked: true },
    ];
    component.getCheckedStatus(formControl, event);
    expect(component.checkedArray).toEqual([
      { name: 'formControl1', isChecked: true },
      { name: 'formControl2', isChecked: true },
      { name: formControl, isChecked: true },
    ]);
  });
});
