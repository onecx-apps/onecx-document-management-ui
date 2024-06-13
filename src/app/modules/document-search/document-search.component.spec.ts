import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  PortalMessageServiceMock,
  providePortalMessageServiceMock,
} from '@onecx/portal-integration-angular/mocks';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  createTranslateLoader,
  AppStateService,
} from '@onecx/portal-integration-angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateServiceMock } from 'src/app/test/TranslateServiceMock';
import { CriteriaComponent } from './criteria/criteria.component';
import { DocumentCriteriaAdvancedComponent } from './document-criteria-advanced/document-criteria-advanced.component';
import { DocumentSearchComponent } from './document-search.component';
import { UserDetailsService } from 'src/app/generated/api/user-details.service';
import { DocumentControllerV1APIService } from 'src/app/generated';

describe('DocumentSearchComponent', () => {
  let component: DocumentSearchComponent;
  let fixture: ComponentFixture<DocumentSearchComponent>;
  let userDetailsService: UserDetailsService;
  let documentV1Service: DocumentControllerV1APIService;
  let portalMessageServiceMock: PortalMessageServiceMock;
  let translateService: TranslateService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  @Pipe({ name: 'translate' })
  class TranslatePipeMock implements PipeTransform {
    transform(value: string): string {
      return '';
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DocumentSearchComponent,
        TranslatePipeMock,
        CriteriaComponent,
        DocumentCriteriaAdvancedComponent,
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MultiSelectModule,
        DropdownModule,
        AutoCompleteModule,
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient, AppStateService],
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: TranslateService, useClass: TranslateServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        providePortalMessageServiceMock(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userDetailsService = TestBed.inject(UserDetailsService);
    translateService = TestBed.inject(TranslateService);
    portalMessageServiceMock = TestBed.inject(PortalMessageServiceMock);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    documentV1Service = TestBed.inject(DocumentControllerV1APIService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter items created by the logged-in user', () => {
    const loggedUserName = 'JohnDoe';
    const searchedResults = [
      { creationUser: 'JohnDoe', title: 'Item 1' },
      { creationUser: 'JaneSmith', title: 'Item 2' },
      { creationUser: 'JohnDoe', title: 'Item 3' },
    ];
    component.loggedUserName = loggedUserName;
    component.searchedResults = searchedResults;
    component.getTranslatedData();
    component.getFilteredCreatedByMe();
    expect(component.searchedResults.length).toBe(3);
    expect(component.searchedResults[0].creationUser).toBe('JohnDoe');
    expect(component.searchedResults[0].title).toBe('Item 1');
    expect(component.searchedResults[1].creationUser).toBe('JaneSmith');
    expect(component.searchedResults[1].title).toBe('Item 2');
  });

  it('should filter recently updated items', () => {
    component.searchedResults = [
      { modificationDate: new Date().toISOString(), title: 'Item 1' },
      { modificationDate: new Date().toISOString(), title: 'Item 2' },
      { modificationDate: new Date().toISOString(), title: 'Item 3' },
    ];
    component.getTranslatedData();
    component.getFilteredRecentlyUpdated();
    expect(component.results.length).toBe(3);
  });

  it('should be reset AdvanceCriteriaSearch ', () => {
    spyOn(component.criteriaAdvancedComponent.criteriaGroup, 'reset');
    component.reset('advanced');
    expect(
      component.criteriaAdvancedComponent.criteriaGroup.reset
    ).toHaveBeenCalled();
    expect(component.isBulkEnable).toBe(false);
    expect(component.isExportDocEnable).toEqual(false);
    expect(component.isLoadMoreVisible).toEqual(false);
  });

  it('should load more results', () => {
    component.page = 0;
    component.mode = 'basic';
    component.size = 200;
    component.loadMoreResults();
    expect(component.page).toBe(1);
    expect(component.isLoadMoreDisable).toBeTrue();
    expect(component.isSearchClicked).toBeFalse();
  });

  it('should reset criteria and disable options', () => {
    const criteriaGroupSpy = spyOn(
      component.criteriaComponent.criteriaGroup,
      'reset'
    );
    component.reset('basic');
    expect(criteriaGroupSpy).toHaveBeenCalled();
    expect(component.isBulkEnable).toBeFalse();
    expect(component.isExportDocEnable).toBeFalse();
    expect(component.isLoadMoreVisible).toBeFalse();
  });

  it('should be called updateView', () => {
    component.updatedView('');
    expect(component.updatedDataView).toBe('');
  });

  it('should load more results and update the result array', () => {
    const searchSpy = spyOn(component, 'search').and.returnValue(
      of(['newData'])
    );
    component.page = 0;
    component.results = [];
    component.isLoadMoreDisable = false;
    component.isSearchClicked = true;
    component.loadMoreResults();
    expect(component.page).toBe(1);
    expect(component.isLoadMoreDisable).toBe(true);
    expect(component.isSearchClicked).toBe(false);
    expect(searchSpy).toHaveBeenCalledWith(
      component.mode || 'basic',
      true,
      component.page,
      component.size
    );
  });

  it('should update isLoadMoreDisable property with the event value', () => {
    const event = true;
    component.isLoadMoreDisableEvent(event);
    expect(component.isLoadMoreDisable).toBeTrue();
  });

  it('should clear filter and update results when mode is present', () => {
    component.getTranslatedData();
    const mode = 'basic';
    const searchResults = [{ id: '1' }, { id: '2' }];
    component.mode = mode;
    component.searchedResults = searchResults;
    spyOn(component, 'search').and.returnValue(of(searchResults));
    component.clearFilter();
    expect(component.isFilterClick).toBeFalse();
    expect(component.search).toHaveBeenCalledWith(mode, true);
    expect(component.results).toEqual(searchResults);
  });

  it('should clear filter and update results when mode is not present', () => {
    const defaultMode = 'basic';
    const searchResults = [{ id: '1' }, { id: '2' }];
    component.searchedResults = searchResults;
    spyOn(component, 'search').and.returnValue(of(searchResults));
    component.getTranslatedData();
    component.clearFilter();
    expect(component.isFilterClick).toBeFalse();
    expect(component.search).toHaveBeenCalledWith(defaultMode, true);
    expect(component.results).toEqual(searchResults);
  });

  it('should get logged-in user data and update loggedUserName', () => {
    const userId = 'user123';
    spyOn(userDetailsService, 'getLoggedInUsername').and.returnValue(
      of({ userId })
    );
    component.getLoggedInUserData();
    expect(userDetailsService.getLoggedInUsername).toHaveBeenCalled();
    expect(component.loggedUserName).toBe('user123');
  });

  it('should set the items array with correct labels and commands', () => {
    component.setFilterActions();
    expect(component.items).toBeTruthy();
    expect(component.items.length).toBe(3);
    expect(component.items[0].label).toBe(
      'DOCUMENT_SEARCH.FILTER.CREATED_BY_ME'
    );
    expect(component.items[0].command).toBeDefined();
    spyOn(component, 'getFilteredCreatedByMe');
    component.items[0].command();
    expect(component.getFilteredCreatedByMe).toHaveBeenCalled();
    expect(component.items[1].label).toBe(
      'DOCUMENT_SEARCH.FILTER.RECENTLY_UPDATED'
    );
    expect(component.items[1].command).toBeDefined();
    spyOn(component, 'getFilteredRecentlyUpdated');
    component.items[1].command();
    expect(component.getFilteredRecentlyUpdated).toHaveBeenCalled();
    expect(component.items[2].label).toBe(
      'DOCUMENT_SEARCH.FILTER.CLEAR_FILTER'
    );
    expect(component.items[2].command).toBeDefined();
    spyOn(component, 'clearFilter');
    component.items[2].command();
    expect(component.clearFilter).toHaveBeenCalled();
  });

  it('should disable the "Clear Filter" item when isFilterClick is false', () => {
    component.isFilterClick = false;
    component.setFilterActions();
    expect(component.items).toBeTruthy();
    expect(component.items.length).toBe(3);
    expect(component.items[2].disabled).toBe(true);
  });

  it('should delete document successfully', () => {
    const id = '123';
    const mockSearchResult = [];
    spyOn(documentV1Service, 'deleteDocumentById').and.returnValue(of(null));
    spyOn(component, 'search').and.returnValue(of(mockSearchResult));
    component.deleteDocument(id);
    expect(portalMessageServiceMock.lastMessages[0]).toEqual({
      type: 'success',
      value: { summaryKey: 'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_SUCCESS' },
    });
    expect(component.search).toHaveBeenCalledWith(
      component.mode || 'basic',
      true
    );
    expect(component.results).toEqual(mockSearchResult);
    expect(documentV1Service.deleteDocumentById).toHaveBeenCalledWith({ id });
  });

  it('should handle error when deleting document', () => {
    const id = '123';
    spyOn(documentV1Service, 'deleteDocumentById').and.returnValue(
      throwError(new Error())
    );
    component.deleteDocument(id);

    expect(portalMessageServiceMock.lastMessages[0]).toEqual({
      type: 'error',
      value: { summaryKey: 'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_ERROR' },
    });

    expect(documentV1Service.deleteDocumentById).toHaveBeenCalledWith({ id });
  });

  it('should set header actions correctly', () => {
    component.isExportDocEnable = true;
    component.isBulkEnable = true;

    spyOn(translateService, 'instant').and.returnValue('Mock Label');
    spyOn(localStorage, 'setItem');
    spyOn(router, 'navigate');

    component.setHeaderActions();

    expect(component.headerActions).toEqual([
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_VIEW',
        label: component['translateService'].instant(
          'DOCUMENT_MENU.DOCUMENT_EXPORT'
        ),
        icon: 'pi pi-download',
        title: component['translateService'].instant(
          'DOCUMENT_MENU.DOCUMENT_EXPORT'
        ),
        show: 'asOverflow',
        actionCallback: jasmine.any(Function),
      },
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_BULK',
        label: component['translateService'].instant(
          'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER'
        ),
        icon: 'pi pi-pencil',
        title: component['translateService'].instant(
          'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER'
        ),
        show: 'asOverflow',
        actionCallback: jasmine.any(Function),
      },
    ]);

    component.headerActions[0].actionCallback();
    expect(portalMessageServiceMock.lastMessages[0]).toEqual({
      type: 'success',
      value: { summaryKey: 'GENERAL.NO_RECORDS_TO_EXPORT' },
    });
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'searchCriteria',
      JSON.stringify(component.criteria)
    );

    component.headerActions[1].actionCallback();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'searchCriteria',
      JSON.stringify(component.criteria)
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'isFiltered',
      component.isFiltered
    );
    expect(router.navigate).toHaveBeenCalledWith(['../more/bulkchanges'], {
      relativeTo: activatedRoute,
    });
  });

  beforeEach(() => {
    spyOn(documentV1Service, 'getDocumentByCriteria').and.returnValue(
      of({
        stream: [
          { id: '1', name: 'Document 1' },
          { id: '2', name: 'Document 2' },
        ],
        totalElements: 2,
      }) as any
    );
  });

  it('should handle search correctly', fakeAsync(() => {
    const mode = 'basic';
    const usePreviousCriteria = false;
    const page = 0;
    const size = 200;

    const mockBasicCriteria = {
      id: '1',
      name: 'doc1',
    };

    component.criteria = mockBasicCriteria as any;
    component.isLoading = false;
    component.isShow = true;
    component.isBulkEnable = false;
    component.isExportDocEnable = false;
    component.isLoadMoreVisible = false;
    component.isSearchClicked = false;
    component.totalElements = 0;
    component.completeElements = 0;
    component.isLoadMoreDisable = false;
    component.isLoadMoreVisible = false;
    component.searchedResults = [];
    component.search(mode, usePreviousCriteria, page, size);

    expect(component.isFilterClick).toBe(false);
    expect(component.isLoading).toBe(true);

    tick();

    expect(component.isShow).toBe(true);
    expect(component.isBulkEnable).toBe(false);
    expect(component.isExportDocEnable).toBe(false);
    expect(component.isLoadMoreVisible).toBe(false);
    expect(component.isShow).toBe(true);

    expect(component.totalElements).toBe(0);
    expect(component.completeElements).toBe(0);
    expect(component.searchedResults).toEqual([]);
    expect(documentV1Service.getDocumentByCriteria).toHaveBeenCalledWith(
      component.criteria
    );
  }));
});
