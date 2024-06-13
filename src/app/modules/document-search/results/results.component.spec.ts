import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { ResultsComponent } from './results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DocumentDetailDTO, LifeCycleState } from 'src/app/generated';
import { createTranslateLoader, generateFilteredColumns } from 'src/app/utils';
import { AttachmentUploadService } from '../../document-detail/attachment-upload.service';
import { HttpClient } from '@angular/common/http';
import { AppStateService } from '@onecx/portal-integration-angular';

describe('ResultsComponent', () => {
  let component: ResultsComponent;
  let attachmentUploadService: AttachmentUploadService;
  let fixture: ComponentFixture<ResultsComponent>;
  const event = {
    attachments: [],
    categories: [],
    channel: {
      version: 13,
      creationDate: '2023-05-30T15:43:41.343211+05:30',
      creationUser: 'onecx',
      modificationDate: '2023-06-02T11:23:38.729352+05:30',
      modificationUser: 'onecx',
    },
    characteristics: [],
    creationDate: '2023-05-30T15:43:41.332643+05:30',
    creationUser: 'onecx',
    description: 'Update here',
    documentRelationships: [],
    documentVersion: '1',
    id: '8ae32cff-369f-44c0-a145-6408a72a15d0',
    lifeCycleState: LifeCycleState.DRAFT,
    modificationDate: '2023-06-02T11:23:38.729242+05:30',
    modificationUser: 'onecx',
    name: 'teamDoc',
    relatedObject: {
      version: 2,
      creationDate: '2023-05-30T15:43:41.347429+05:30',
      creationUser: 'onecx',
      modificationDate: '2023-06-01T12:02:20.786417+05:30',
      modificationUser: 'onecx',
    },
    relatedParties: [],
    specification: {
      version: 0,
      creationDate: '2023-06-02T11:23:38.727768+05:30',
      creationUser: 'onecx',
      modificationDate: '2023-06-02T11:23:38.727768+05:30',
      modificationUser: 'onecx',
    },
    tags: [],
    type: {
      version: 0,
      creationDate: '2023-05-30T20:57:15.7098+05:30',
      creationUser: 'Monalisha',
      modificationDate: null,
      modificationUser: null,
    },
    version: 18,
  };
  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return value;
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient, AppStateService],
          },
        }),
      ],
      declarations: [ResultsComponent, TranslatePipeMock],
      providers: [AttachmentUploadService, TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    attachmentUploadService = TestBed.inject(AttachmentUploadService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the selectedDocument property correctly', () => {
    component.setSelectedDocument(event);
    expect(component.selectedDocument).toBe(event);
  });

  it('should set deleteDialogVisible on onCancelDelete', () => {
    component.onCancelDelete();
    expect(component.deleteDialogVisible).toBe(false);
  });

  it('should set deleteDialogVisible on onDelete', () => {
    component.selectedDocument = { id: '12345' };
    spyOn(component.deleteDocument, 'emit');
    component.onDelete();
    expect(component.deleteDialogVisible).toBe(false);
    expect(component.deleteDocument.emit).toHaveBeenCalledWith('12345');
  });

  it('should call updateResultsLayout', () => {
    let event = 'grid';
    spyOn(component.updatedView, 'emit');
    component.updateResultsLayout(event);
    expect(component.layout).toBe(event);
    expect(component.updatedView.emit).toHaveBeenCalledWith(event);
  });

  it('should call onSortFieldChange', () => {
    spyOn(component, 'updateSorting');
    component.onSortFieldChange('true');
    expect(component.sortField).toEqual('true');
    expect(component.updateSorting).toHaveBeenCalled();
  });

  it('should call updateSorting', () => {
    spyOn(component, 'updateSorting');
    component.onSortOrderChange(true);
    expect(component.updateSorting).toHaveBeenCalled();
  });

  it('should call updateSorting', () => {
    spyOn(component, 'updateSorting');
    component.onSortOrderChange(false);
    expect(component.updateSorting).toHaveBeenCalled();
  });

  it('should call ngOnChanges()', () => {
    component.isSearchClicked = true;
    component.ngOnChanges();
    expect(component.first).toBe(0);
  });

  it('should update sortOrder in ASCENDING order', () => {
    component.sortField = 'modificationDate';
    component.updateSorting();
    expect(component.sortOrder).toEqual(1);
  });

  it('should update sortOrder in DSCENDING order', () => {
    component.sortField = 'name';
    component.updateSorting();
    expect(component.sortOrder).toEqual(-1);
  });

  it('should update generateFilteredColumns', () => {
    const activeColumnIds = [
      'name',
      'type.name',
      'lifeCycleState',
      'documentVersion',
      'modificationDate',
    ];
    component.handleColumnChange(activeColumnIds);
    const columns = [
      {
        field: 'name',
        header: 'NAME',
        translationPrefix: 'RESULTS',
        active: true,
      },
      {
        field: 'type.name',
        header: 'DOCUMENT_TYPE',
        translationPrefix: 'RESULTS',
        active: true,
      },
      {
        field: 'lifeCycleState',
        header: 'STATUS',
        translationPrefix: 'RESULTS',
        active: true,
      },
      {
        field: 'documentVersion',
        header: 'VERSION',
        translationPrefix: 'RESULTS',
        active: true,
      },
      {
        field: 'creationUser',
        header: 'CREATED',
        translationPrefix: 'RESULTS',
        active: false,
      },
      {
        field: 'creationDate',
        header: 'CREATED_ON',
        translationPrefix: 'RESULTS',
        active: false,
      },
      {
        field: 'modificationDate',
        header: 'MODIFICATION_DATE',
        translationPrefix: 'RESULTS',
        active: true,
      },
    ];
    generateFilteredColumns(activeColumnIds, columns);
    expect(component.columns).toEqual(columns);
  });

  it('should update isLoadMoreDisableEvent on PageChange', () => {
    spyOn(component.isLoadMoreDisableEvent, 'emit');
    let event = { first: 0, rows: 20 };
    component.results = [
      {
        version: 18,
        creationDate: '2023-05-30T15:43:41.332643+05:30',
        creationUser: 'onecx',
        modificationDate: '2023-06-02T11:23:38.729242+05:30',
        modificationUser: 'onecx',
        id: '8ae32cff-369f-44c0-a145-6408a72a15d0',
        name: 'teamDoc',
        description: 'Update here',
        lifeCycleState: LifeCycleState.DRAFT,
        documentVersion: '1',
        channel: {
          version: 13,
          creationDate: '2023-05-30T15:43:41.343211+05:30',
          creationUser: 'onecx',
          modificationDate: '2023-06-02T11:23:38.729352+05:30',
          modificationUser: 'onecx',
          id: 'f0387598-287c-41b8-b419-0325da4f8bb1',
          name: '            dsadsds',
        },
        tags: [],
        type: {
          version: 0,
          creationDate: '2023-05-30T20:57:15.7098+05:30',
          creationUser: 'Monalisha',
          modificationDate: null,
          modificationUser: null,
          id: 'df1f184e-b1a6-029e-1cde-c1fbe5ac07e7',
          name: 'Financial Document',
        },
        specification: {
          version: 0,
          creationDate: '2023-06-02T11:23:38.727768+05:30',
          creationUser: 'onecx',
          modificationDate: '2023-06-02T11:23:38.727768+05:30',
          modificationUser: 'onecx',
          id: '23bf42ec-83b4-4238-9c53-9ef09ce8b848',
          name: 'spck',
          specificationVersion: null,
        },
        documentRelationships: [],
        characteristics: [],
        relatedParties: [],
        relatedObject: {
          version: 2,
          creationDate: '2023-05-30T15:43:41.347429+05:30',
          creationUser: 'onecx',
          modificationDate: '2023-06-01T12:02:20.786417+05:30',
          modificationUser: 'onecx',
          id: 'e6fa5b3b-ed6f-4ee0-b15e-684925612ab7',
          involvement: 'invk',
          objectReferenceType: 'obj type',
          objectReferenceId: 'objkk',
        },
        categories: [],
        attachments: [],
      },
    ];
    component.totalElements = 100;
    component.onPageChange(event);
    expect(component.isLoadMoreDisableEvent.emit).toHaveBeenCalledOnceWith(
      false
    );
  });

  it('should update isLoadMoreDisableEvent on PageChange', () => {
    spyOn(component.isLoadMoreDisableEvent, 'emit');
    component.results = [];
    component.totalElements = 0;
    let event = { first: 0, rows: 30 };
    component.onPageChange(event);
    expect(component.isLoadMoreDisableEvent.emit).toHaveBeenCalledOnceWith(
      true
    );
  });

  it('should return the correct media icon based on the type', () => {
    const audioType = 'audio';
    const videoType = 'video';
    const imageType = 'image';
    const unknownType = 'unknown';

    const audioIcon = component.getMediaIcon(audioType);
    const videoIcon = component.getMediaIcon(videoType);
    const imageIcon = component.getMediaIcon(imageType);
    const unknownIcon = component.getMediaIcon(unknownType);

    expect(audioIcon).toEqual('audio.png');
    expect(videoIcon).toEqual('video.png');
    expect(imageIcon).toEqual('img.png');
    expect(unknownIcon).toEqual('file.png');
  });

  it('should return the correct file extension icon based on the extension', () => {
    const xlsExtension = 'xls';
    const xlsxExtension = 'xlsx';
    const docExtension = 'doc';
    const docxExtension = 'docx';
    const pptExtension = 'ppt';
    const pptxExtension = 'pptx';
    const pdfExtension = 'pdf';
    const zipExtension = 'zip';
    const txtExtension = 'txt';
    const unknownExtension = 'unknown';

    const xlsIcon = component.getFileExtensionIcon(xlsExtension);
    const xlsxIcon = component.getFileExtensionIcon(xlsxExtension);
    const docIcon = component.getFileExtensionIcon(docExtension);
    const docxIcon = component.getFileExtensionIcon(docxExtension);
    const pptIcon = component.getFileExtensionIcon(pptExtension);
    const pptxIcon = component.getFileExtensionIcon(pptxExtension);
    const pdfIcon = component.getFileExtensionIcon(pdfExtension);
    const zipIcon = component.getFileExtensionIcon(zipExtension);
    const txtIcon = component.getFileExtensionIcon(txtExtension);
    const unknownIcon = component.getFileExtensionIcon(unknownExtension);

    expect(xlsIcon).toBe('xls.png');
    expect(xlsxIcon).toBe('xls.png');
    expect(docIcon).toBe('doc.png');
    expect(docxIcon).toBe('doc.png');
    expect(pptIcon).toBe('ppt.png');
    expect(pptxIcon).toBe('ppt.png');
    expect(pdfIcon).toBe('pdf.png');
    expect(zipIcon).toBe('zip.png');
    expect(txtIcon).toBe('txt.png');
    expect(unknownIcon).toBe('file.png');
  });

  it('should update showPageReport and showPaginator to false when results array is empty', () => {
    const mockResults: DocumentDetailDTO[] = [];
    component.resultsArray = mockResults;
    expect(component.results).toEqual(mockResults);
    expect(component.showPageReport).toBe(false);
    expect(component.showPaginator).toBe(false);
  });

  it('should return URL on getFolderIconUrl()', () => {
    const actualUrl = component.getFolderIconUrl();
    let expectedUrl =
      attachmentUploadService.getAssetsUrl() +
      'images/file-format-icons/folder.png';
    expect(actualUrl).toEqual(expectedUrl);
  });

  it('should return the icon based on file extension for other file types', () => {
    const attachment = {
      fileName: 'document.pdf',
      mimeType: { name: 'application/pdf' },
    };
    const expectedIcon = 'pdf.png';
    const actualIcon = component.getAttachmentIconName(attachment);
    expect(actualIcon).toEqual(expectedIcon);
  });

  it('should return the default icon when no matching icon is found', () => {
    let attachmentIcon = component.getMediaIcon('txt');
    expect(attachmentIcon).toEqual('file.png');
  });

  it('should return valid attachment array', () => {
    const result = {
      attachments: [
        { storageUploadStatus: true },
        { storageUploadStatus: false },
        { storageUploadStatus: true },
      ],
    };
    const validAttachmentArray = component.getValidAttachmentArray(result);
    expect(validAttachmentArray).toEqual([
      { storageUploadStatus: true },
      { storageUploadStatus: true },
    ]);
  });

  it('should return empty array if no attachments', () => {
    const result = {};
    const validAttachmentArray = component.getValidAttachmentArray(result);
    expect(validAttachmentArray).toEqual([]);
  });

  it('should return folder icon URL when fileCount is greater than 1', () => {
    const result = {};
    spyOn(component, 'getValidAttachmentArray').and.returnValue([{}, {}]);
    spyOn(component, 'getFolderIconUrl').and.returnValue('folder-icon-url');
    const iconUrl = component.getAttachmentIcon(result);
    expect(component.getValidAttachmentArray).toHaveBeenCalledWith(result);
    expect(component.getFolderIconUrl).toHaveBeenCalled();
    expect(iconUrl).toBe('folder-icon-url');
    expect(component.showCount).toBeTrue();
  });

  it('should return attachment icon URL when fileCount is 1', () => {
    const result = {};
    spyOn(component, 'getValidAttachmentArray').and.returnValue([{}]);
    spyOn(component, 'getAttachmentIconName').and.returnValue(
      'attachment-icon'
    );
    spyOn(component, 'getAttachmentIconUrl').and.returnValue(
      'attachment-icon-url'
    );
    const iconUrl = component.getAttachmentIcon(result);
    expect(component.getValidAttachmentArray).toHaveBeenCalledWith(result);
    expect(component.getAttachmentIconName).toHaveBeenCalledWith({});
    expect(component.getAttachmentIconUrl).toHaveBeenCalledWith(
      'attachment-icon'
    );
    expect(iconUrl).toBe('attachment-icon-url');
    expect(component.showCount).toBeFalse();
  });

  it('should return empty icon URL when fileCount is 0', () => {
    const result = {};
    spyOn(component, 'getValidAttachmentArray').and.returnValue([]);
    spyOn(component, 'getEmptyIconUrl').and.returnValue('empty-icon-url');
    const iconUrl = component.getAttachmentIcon(result);
    expect(component.getValidAttachmentArray).toHaveBeenCalledWith(result);
    expect(component.getEmptyIconUrl).toHaveBeenCalled();
    expect(iconUrl).toBe('empty-icon-url');
    expect(component.showCount).toBeFalse();
  });

  it('should emit true for any other case', () => {
    component.totalElements = 10;
    component.results = [
      { id: 1, name: 'Document 1' },
      { id: 2, name: 'Document 2' },
      { id: 3, name: 'Document 3' },
      { id: 4, name: 'Document 4' },
      { id: 5, name: 'Document 5' },
    ] as any;
    spyOn(component.isLoadMoreDisableEvent, 'emit');
    component.onPageChange({ first: 0, rows: 3 });
    expect(component.isLoadMoreDisableEvent.emit).toHaveBeenCalledWith(true);
  });

  it('should emit false when results.length is less than or equal to event.rows', () => {
    component.totalElements = 10;
    component.results = [
      { id: 1, name: 'Document 1' },
      { id: 2, name: 'Document 2' },
      { id: 3, name: 'Document 3' },
      { id: 4, name: 'Document 4' },
      { id: 5, name: 'Document 5' },
    ] as any;
    spyOn(component.isLoadMoreDisableEvent, 'emit');
    component.onPageChange({ first: 0, rows: 5 });
    expect(component.isLoadMoreDisableEvent.emit).toHaveBeenCalledWith(false);
  });
});
