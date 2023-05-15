import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CriteriaComponent } from './criteria.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import {
  GetDocumentByCriteriaRequestParams,
  LifeCycleState,
} from 'src/app/generated';
import { MultiSelectModule } from 'primeng/multiselect';
describe('CriteriaComponent', () => {
  let component: CriteriaComponent;
  let fixture: ComponentFixture<CriteriaComponent>;

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
});
