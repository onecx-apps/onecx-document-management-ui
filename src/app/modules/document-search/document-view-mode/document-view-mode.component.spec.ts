import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentViewModeComponent } from './document-view-mode.component';

describe('DocumentViewModeComponent', () => {
  let component: DocumentViewModeComponent;
  let fixture: ComponentFixture<DocumentViewModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentViewModeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentViewModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
