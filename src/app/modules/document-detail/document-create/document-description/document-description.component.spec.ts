import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { providePortalMessageServiceMock } from '@onecx/portal-integration-angular/mocks';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { FormControl, FormGroup } from '@angular/forms';
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { DocumentDescriptionComponent } from './document-description.component';
import { DocumentTypeControllerV1APIService } from 'src/app/generated/api/documentTypeControllerV1.service';
import { of } from 'rxjs';

describe('DocumentDescriptionComponent', () => {
  let component: DocumentDescriptionComponent;
  let fixture: ComponentFixture<DocumentDescriptionComponent>;
  let documentTypeV1Service: DocumentTypeControllerV1APIService;
  @Pipe({ name: 'translate', pure: false })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [DocumentDescriptionComponent, TranslatePipeMock],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: DataSharingService },
        providePortalMessageServiceMock(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentDescriptionComponent);
    component = fixture.componentInstance;
    documentTypeV1Service = TestBed.inject(DocumentTypeControllerV1APIService);
    component.documentDescriptionForm = new FormGroup({
      controlName: new FormControl(),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trim the value and set it in the form control', () => {
    const mockEvent = {
      target: {
        getAttribute: () => 'controlName',
        value: '  trimmedValue  ',
      },
    };
    component.trimSpace(mockEvent);
    expect(
      component.documentDescriptionForm.controls['controlName'].value
    ).toBe('trimmedValue');
  });

  it('should not prevent space key press at the middle or end of the input', () => {
    const event = {
      target: {
        selectionStart: 5,
        code: 'Space',
        preventDefault: jasmine.createSpy('preventDefault'),
      },
    };
    component.preventSpace(event);
    expect(event.target.preventDefault).not.toHaveBeenCalled();
  });

  it('should allow key press of period (.)', () => {
    const event = {
      which: 46,
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

  it('should allow key press of numbers and backspace', () => {
    const event = {
      which: 49,
      preventDefault: jasmine.createSpy('preventDefault'),
    };
    component.onKeyDocVersionPress(event);
    expect(event.preventDefault).not.toHaveBeenCalled();
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

  it('should onKeyDocVersionUp', () => {
    const inputValue = '1.0.0';
    spyOn(component.documentVersion, 'emit');
    const event = {
      target: {
        value: inputValue,
      },
    };
    component.onKeyDocVersionUp(event);
    expect(component.documentVersion.emit).toHaveBeenCalledWith(inputValue);
  });

  it('should load all document types', fakeAsync(() => {
    const mockDocumentTypes = [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' },
    ];

    spyOn(documentTypeV1Service, 'getAllTypesOfDocument').and.returnValue(
      of(mockDocumentTypes as any)
    );

    component.loadAllDocumentTypesWrapper();
    tick();

    component['documentTypeV1Service']
      .getAllTypesOfDocument()
      .subscribe((results) => {
        component.allDocumentTypes = results;
        component.documentTypes = results.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      });

    expect(component.allDocumentTypes).toEqual([
      Object({ id: 1, name: 'Type 1' }),
      Object({ id: 2, name: 'Type 2' }),
    ]);

    expect(component.documentTypes).toEqual([
      { label: 'Type 1', value: 1 },
      { label: 'Type 2', value: 2 },
    ]);

    fixture.detectChanges();
  }));

  it('should load document status correctly', () => {
    component.loadDocumentStatusWrapper();
    expect(component.documentStatus).toEqual([
      { label: 'ARCHIVED', value: 'ARCHIVED' },
      { label: 'DRAFT', value: 'DRAFT' },
      { label: 'RELEASED', value: 'RELEASED' },
      { label: 'REVIEW', value: 'REVIEW' },
    ]);
    fixture.detectChanges();
  });
});
