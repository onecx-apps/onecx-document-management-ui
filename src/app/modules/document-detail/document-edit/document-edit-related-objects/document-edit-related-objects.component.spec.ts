import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentEditRelatedObjectsComponent } from './document-edit-related-objects.component';

describe('DocumentEditRelatedObjectsComponent', () => {
  let component: DocumentEditRelatedObjectsComponent;
  let fixture: ComponentFixture<DocumentEditRelatedObjectsComponent>;
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentEditRelatedObjectsComponent, TranslatePipeMock],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditRelatedObjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
