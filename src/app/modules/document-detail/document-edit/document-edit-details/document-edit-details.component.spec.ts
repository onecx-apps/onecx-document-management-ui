import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { DocumentTypeControllerV1APIService } from 'src/app/generated';
import { DocumentEditDetailsComponent } from './document-edit-details.component';

describe('DocumentEditDetailsComponent', () => {
  let component: DocumentEditDetailsComponent;
  let fixture: ComponentFixture<DocumentEditDetailsComponent>;
  let documentTypeV1Service: DocumentTypeControllerV1APIService;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentEditDetailsComponent, TranslatePipeMock],
      providers: [DocumentTypeControllerV1APIService],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    documentTypeV1Service = TestBed.inject(DocumentTypeControllerV1APIService);
  });

  it('should disable the form when isEditable is false', () => {
    component.isEditable = false;
    const form = new FormGroup({});
    component.documentDescriptionForm = form;
    component.ngOnChanges();
    expect(form.enabled).toBe(false);
  });

  it('should enable the form when isEditable is true', () => {
    component.isEditable = true;
    const form = new FormGroup({});
    component.documentDescriptionForm = form;
    component.ngOnChanges();
    expect(form.enabled).toBe(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trim value and set it in the form control', () => {
    const event = {
      target: {
        getAttribute: jasmine
          .createSpy('getAttribute')
          .and.returnValue('controlName'),
        value: '  trimmedValue  ',
      },
    };
    const formControl = new FormControl('');
    const formGroup = new FormGroup({
      controlName: formControl,
    });
    component.documentDescriptionForm = formGroup;
    component.trimSpace(event);
    expect(formControl.value).toBe('trimmedValue');
  });

  it('should prevent space key press at the beginning of the input', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    const event = {
      target: inputElement,
      code: 'Space',
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    inputElement.selectionStart = 0;
    component.preventSpace(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not prevent key press if not space key', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    const event = {
      target: inputElement,
      code: 'KeyA',
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    inputElement.selectionStart = 0;
    component.preventSpace(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should allow key press of numbers and backspace', () => {
    const event = {
      which: 49,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.onKeyDocVersionPress(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent key press of non-numeric and non-backspace keys', () => {
    const event = {
      which: 65,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.onKeyDocVersionPress(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should allow key press of period (.)', () => {
    const event = {
      which: 46,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.onKeyDocVersionPress(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });
  it('should emit the target value', () => {
    const event = {
      target: {
        value: '1.0',
      },
    };
    spyOn(component.documentVersion, 'emit');
    component.onKeyDocVersionUp(event);
    expect(component.documentVersion.emit).toHaveBeenCalledWith('1.0');
  });
});
