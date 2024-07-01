import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../../test/TranslateServiceMock';

import { DocumentsChooseModificationComponent } from './documents-choose-modification.component';
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
      imports: [HttpClientTestingModule],
      declarations: [DocumentsChooseModificationComponent, TranslatePipeMock],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentsChooseModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
