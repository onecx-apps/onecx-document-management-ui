import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentAttachmentComponent } from './document-attachment.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { SupportedMimeTypeControllerV1APIService } from 'src/app/generated';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DocumentAttachmentComponent', () => {
  let component: DocumentAttachmentComponent;
  let fixture: ComponentFixture<DocumentAttachmentComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentAttachmentComponent, TranslatePipeMock],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: SupportedMimeTypeControllerV1APIService,
          useClass: SupportedMimeTypeControllerV1APIService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
