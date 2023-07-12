import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  DocumentControllerV1APIService,
  DocumentTypeControllerV1APIService,
  GetDocumentByCriteriaRequestParams,
  LifeCycleState,
} from 'src/app/generated';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { DocumentCriteriaAdvancedComponent } from './document-criteria-advanced.component';
import { of } from 'rxjs';

describe('DocumentCriteriaAdvancedComponent', () => {
  let component: DocumentCriteriaAdvancedComponent;
  let fixture: ComponentFixture<DocumentCriteriaAdvancedComponent>;
  let formBuilder: FormBuilder;
  let documentTypeV1Service: DocumentTypeControllerV1APIService;
  let documentV1Service: DocumentControllerV1APIService;

  @Pipe({ name: 'translate', pure: false })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentCriteriaAdvancedComponent, TranslatePipeMock],
      imports: [
        DropdownModule,
        AutoCompleteModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MultiSelectModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCriteriaAdvancedComponent);
    documentTypeV1Service = TestBed.inject(DocumentTypeControllerV1APIService);
    documentV1Service = TestBed.inject(DocumentControllerV1APIService);
    formBuilder = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    let critiera: GetDocumentByCriteriaRequestParams = {
      id: '1',
      channelName: 'Test',
      name: 'Test',
      page: 1,
      size: 1,
      state: [LifeCycleState.ARCHIVED],
      typeId: ['1'],
      startDate: '03.21.23',
      endDate: '05.21.23',
      createdBy: 'new',
      objectReferenceId: 'obi',
      objectReferenceType: 'obt',
    };
    component.criteria = critiera;
    component.ngOnInit();
    expect(component.criteriaGroup).toBeTruthy();
  });

  it('should form reset', () => {
    spyOn(component.resetEmitter, 'emit');
    component.resetFormGroup();
    expect(component.resetEmitter.emit).toHaveBeenCalledWith();
  });

  it('should not submit if the criteriaGroup is invalid', () => {
    const invalidFormGroup: FormGroup = formBuilder.group({
      criteria: ['', Validators.required],
    });
    component.criteriaGroup = invalidFormGroup;
    spyOn(component, 'submitCriteria').and.callThrough();
    component.submitCriteria();
    expect(component.submitCriteria).toHaveBeenCalled();
    expect(invalidFormGroup.invalid).toBe(true);
  });

  it('should submit if the criteriaGroup is valid', () => {
    const validFormGroup: FormGroup = formBuilder.group({
      criteria: ['Some value', Validators.required],
    });
    component.criteriaGroup = validFormGroup;
    spyOn(component, 'submitCriteria').and.callThrough();
    component.submitCriteria();
    expect(component.submitCriteria).toHaveBeenCalled();
    expect(validFormGroup.invalid).toBe(false);
  });
  it('should modify startDate and endDate when present in the form value', () => {
    const startDate = new Date(2023, 5, 15, 12, 0, 0, 0);
    const endDate = new Date(2023, 5, 15, 18, 0, 0, 0);

    const formGroup = formBuilder.group({
      criteria: ['', Validators.required],
      startDate: null,
      endDate: null,
    });
    component.criteriaGroup = formGroup;
    component.criteriaGroup.patchValue({
      criteria: 'Some value',
      startDate: startDate,
      endDate: endDate,
    });

    component.submitCriteria();

    expect(component.criteriaGroup.value.startDate.getHours()).toBe(0);
    expect(component.criteriaGroup.value.startDate.getMinutes()).toBe(0);
    expect(component.criteriaGroup.value.startDate.getSeconds()).toBe(0);
    expect(component.criteriaGroup.value.startDate.getMilliseconds()).toBe(0);

    expect(component.criteriaGroup.value.endDate.getHours()).toBe(23);
    expect(component.criteriaGroup.value.endDate.getMinutes()).toBe(59);
    expect(component.criteriaGroup.value.endDate.getSeconds()).toBe(59);
    expect(component.criteriaGroup.value.endDate.getMilliseconds()).toBe(999);
  });

  it('should not modify startDate and endDate when not present in the form value', () => {
    const formGroup = formBuilder.group({
      criteria: ['', Validators.required],
      startDate: null,
      endDate: null,
    });
    component.criteriaGroup = formGroup;
    component.criteriaGroup.patchValue({
      criteria: 'Some value',
    });
    component.submitCriteria();
    expect(component.criteriaGroup.value.startDate).toBeNull();
    expect(component.criteriaGroup.value.endDate).toBeNull();
  });

  it('should reset the specified control', () => {
    component.criteriaGroup?.controls['controlName'].setValue('initial value');

    component.fieldReset('controlName');
    expect(component.criteriaGroup?.controls['controlName'].value).toBe(
      undefined
    );
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
  }));

  it('should load all Channel', fakeAsync(() => {
    const mockDocumentTypes = [
      { id: 1, name: 'Type 1' },
      { id: 2, name: 'Type 2' },
    ];

    spyOn(documentV1Service, 'getAllChannels').and.returnValue(
      of(mockDocumentTypes as any)
    );

    component.loadAllChannelWrapper();
    tick();

    component['documentV1Service'].getAllChannels().subscribe((results) => {
      component.channelItems = results.map((el) => ({
        label: el.name,
        value: el.id,
      }));
    });

    expect(component.allDocumentTypes).toBeUndefined([
      Object({ id: 1, name: 'Type 1' }),
      Object({ id: 2, name: 'Type 2' }),
    ]);

    expect(component.documentTypes).toBeUndefined([
      { label: 'Type 1', value: 1 },
      { label: 'Type 2', value: 2 },
    ]);
  }));
});
