import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  GetDocumentByCriteriaRequestParams,
  LifeCycleState,
} from 'src/app/generated';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { DocumentCriteriaAdvancedComponent } from './document-criteria-advanced.component';

describe('DocumentCriteriaAdvancedComponent', () => {
  let component: DocumentCriteriaAdvancedComponent;
  let fixture: ComponentFixture<DocumentCriteriaAdvancedComponent>;

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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCriteriaAdvancedComponent);
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
});
