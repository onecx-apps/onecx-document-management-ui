import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentEditAttachmentComponent } from './document-edit-attachment.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { SupportedMimeTypeControllerV1APIService } from 'src/app/generated';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DocumentEditAttachmentComponent', () => {
  let component: DocumentEditAttachmentComponent;
  let fixture: ComponentFixture<DocumentEditAttachmentComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentEditAttachmentComponent, TranslatePipeMock],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        {
          provide: SupportedMimeTypeControllerV1APIService,
          useClass: SupportedMimeTypeControllerV1APIService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
