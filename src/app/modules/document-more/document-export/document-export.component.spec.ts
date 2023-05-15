import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentExportComponent } from './document-export.component';

describe('DocumentExportComponent', () => {
  let component: DocumentExportComponent;
  let fixture: ComponentFixture<DocumentExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentExportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
