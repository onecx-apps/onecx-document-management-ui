import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { DocumentEditRelatedObjectsComponent } from './document-edit-related-objects.component';

describe('DocumentEditRelatedObjectsComponent', () => {
  let component: DocumentEditRelatedObjectsComponent;
  let fixture: ComponentFixture<DocumentEditRelatedObjectsComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentEditRelatedObjectsComponent, TranslatePipeMock],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditRelatedObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
});
