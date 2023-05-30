import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbService } from '@onecx/portal-integration-angular';
import { MessageService } from 'primeng/api';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';

import { DocumentBulkChangesComponent } from './document-bulk-changes.component';

describe('DocumentBulkChangesComponent', () => {
  let component: DocumentBulkChangesComponent;
  let fixture: ComponentFixture<DocumentBulkChangesComponent>;
  let service: BreadcrumbService;

  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentBulkChangesComponent, TranslatePipeMock],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        MessageService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DocumentBulkChangesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
