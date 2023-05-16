import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';

import { DocumentEditLifecycleComponent } from './document-edit-lifecycle.component';

describe('DocumentEditLifecycleComponent', () => {
  let component: DocumentEditLifecycleComponent;
  let fixture: ComponentFixture<DocumentEditLifecycleComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentEditLifecycleComponent, TranslatePipeMock],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        { provide: MessageService, useClass: MessageService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditLifecycleComponent);
    component = fixture.componentInstance;
    component.documentId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
