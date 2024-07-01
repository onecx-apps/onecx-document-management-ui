import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  PortalMessageServiceMock,
  providePortalMessageServiceMock,
} from '@onecx/portal-integration-angular/mocks';
import {
  LifeCycleState,
  DocumentControllerV1APIService,
} from 'src/app/generated';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { DocumentEditLifecycleComponent } from './document-edit-lifecycle.component';
import { of, throwError } from 'rxjs';

describe('DocumentEditLifecycleComponent', () => {
  let component: DocumentEditLifecycleComponent;
  let fixture: ComponentFixture<DocumentEditLifecycleComponent>;
  let documentV1Service: DocumentControllerV1APIService;
  let portalMessageServiceMock: PortalMessageServiceMock;
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
        DocumentControllerV1APIService,
        { provide: TranslateService, useClass: TranslateServiceMock },
        providePortalMessageServiceMock(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentEditLifecycleComponent);
    component = fixture.componentInstance;
    component.documentId = '1';
    fixture.detectChanges();
    documentV1Service = TestBed.inject(DocumentControllerV1APIService);
    portalMessageServiceMock = TestBed.inject(PortalMessageServiceMock);
    component.translatedData = {
      'DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_ERROR': 'Update error message',
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the document status correctly', () => {
    component.loadDocumentStatusWrapper();
    const expectedDocumentStatusList = Object.keys(LifeCycleState).map(
      (key) => ({
        label: LifeCycleState[key],
        value: key,
      })
    );
    expect(component.documentStatusList).toEqual(expectedDocumentStatusList);
  });

  it('should refresh timeline and update entries and status on success', () => {
    const mockData = {
      lifeCycleState: 'someState',
    };
    spyOn(documentV1Service, 'getDocumentById').and.returnValue(
      of(mockData) as any
    );
    spyOn(portalMessageServiceMock, 'success');
    component.documentId = 'someId';
    component.refreshTimeline();
    expect(documentV1Service.getDocumentById).toHaveBeenCalledWith({
      id: 'someId',
    });
    expect(component.timeLineEntries).toEqual(mockData);
    expect(component.documentStatus).toEqual(mockData.lifeCycleState);
    expect(portalMessageServiceMock.success).not.toHaveBeenCalled();
  });

  it('should show error message on API error', () => {
    spyOn(documentV1Service, 'getDocumentById').and.returnValue(
      throwError(() => new Error('API error'))
    );
    spyOn(portalMessageServiceMock, 'success');
    component.refreshTimeline();
    expect(documentV1Service.getDocumentById).toHaveBeenCalled();
    expect(component.timeLineEntries).toBeUndefined();
    expect(component.documentStatus).toBeUndefined();
    expect(portalMessageServiceMock.lastMessages[0]).toEqual({
      type: 'error',
      value: { summaryKey: 'DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_ERROR' },
    });
  });
});
