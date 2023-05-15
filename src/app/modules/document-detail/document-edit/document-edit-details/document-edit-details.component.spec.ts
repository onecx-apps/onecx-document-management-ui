import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEditDetailsComponent } from './document-edit-details.component';

describe('DocumentEditDetailsComponent', () => {
  let component: DocumentEditDetailsComponent;
  let fixture: ComponentFixture<DocumentEditDetailsComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DocumentEditDetailsComponent, TranslatePipeMock],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
