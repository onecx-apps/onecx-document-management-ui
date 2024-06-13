import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../../test/TranslateServiceMock';

import { DocumentsChooseModificationComponent } from './documents-choose-modification.component';
import { HttpClient } from '@angular/common/http';
import {
  createTranslateLoader,
  AppStateService,
} from '@onecx/portal-integration-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DocumentsChooseModificationComponent', () => {
  let component: DocumentsChooseModificationComponent;
  let fixture: ComponentFixture<DocumentsChooseModificationComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient, AppStateService],
          },
        }),
      ],
      declarations: [DocumentsChooseModificationComponent, TranslatePipeMock],
      providers: [TranslateService],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsChooseModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
