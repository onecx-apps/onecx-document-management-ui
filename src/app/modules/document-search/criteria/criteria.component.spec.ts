import { Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CriteriaComponent } from './criteria.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  DocumentControllerV1APIService,
  DocumentTypeControllerV1APIService,
  GetDocumentByCriteriaRequestParams,
  LifeCycleState,
} from 'src/app/generated';
import { MultiSelectModule } from 'primeng/multiselect';
import { of } from 'rxjs';
describe('CriteriaComponent', () => {
  let component: CriteriaComponent;
  let fixture: ComponentFixture<CriteriaComponent>;
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
      declarations: [CriteriaComponent, TranslatePipeMock],
      imports: [
        DropdownModule,
        AutoCompleteModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MultiSelectModule,
      ],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriteriaComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    documentV1Service = TestBed.inject(DocumentControllerV1APIService);
    documentTypeV1Service = TestBed.inject(DocumentTypeControllerV1APIService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form', () => {
    let critiera: GetDocumentByCriteriaRequestParams = {
      channelName: 'Test',
      id: '1',
      name: 'Test',
      page: 1,
      size: 1,
      state: [LifeCycleState.ARCHIVED],
      typeId: ['1'],
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

  it('should load all channels correctly', fakeAsync(() => {
    const mockChannels = [{ name: 'Channel 1' }, { name: 'Channel 2' }];

    spyOn(documentV1Service, 'getAllChannels').and.returnValue(
      of(mockChannels as any)
    );

    component.loadAllChannelsWrapper();
    tick();
    expect(component.channelItems).toEqual([
      { label: 'Channel 1', value: 'Channel 1' },
      { label: 'Channel 2', value: 'Channel 2' },
    ]);

    fixture.detectChanges();
  }));
});
