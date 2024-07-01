// Core imports
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

// Third party imports
import { TranslateService } from '@ngx-translate/core';
import {
  Action,
  PortalMessageService,
  PortalSearchPage,
  provideParent,
} from '@onecx/portal-integration-angular';
import { MenuItem } from 'primeng/api';
import { Observable, timer } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';

// Application imports
import { CriteriaComponent } from './criteria/criteria.component';
import { DocumentCriteriaAdvancedComponent } from './document-criteria-advanced/document-criteria-advanced.component';
import {
  DocumentControllerV1APIService,
  DocumentDetailDTO,
  GetDocumentByCriteriaRequestParams,
} from 'src/app/generated';
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { convertToCSV } from 'src/app/utils';
import { UserDetailsService } from 'src/app/generated/api/user-details.service';

@Component({
  selector: 'app-document-search',
  templateUrl: './document-search.component.html',
  styleUrls: ['./document-search.component.scss'],
  providers: [provideParent(DocumentSearchComponent), DatePipe],
})
export class DocumentSearchComponent
  extends PortalSearchPage<DocumentDetailDTO>
  implements OnInit
{
  @ViewChild(CriteriaComponent, { static: false })
  criteriaComponent: CriteriaComponent;
  @ViewChild(DocumentCriteriaAdvancedComponent, { static: false })
  criteriaAdvancedComponent: DocumentCriteriaAdvancedComponent;

  page = 0;
  size = 200;
  totalElements: number;
  completeElements: number;
  isBulkEnable: boolean;
  isExportDocEnable: boolean;
  isLoading = false;
  isLoadMoreDisable = true;
  isLoadMoreVisible = false;
  isShow = true;
  isSearchClicked = false;
  isFilterClick: boolean;
  isLoadMoreClicked = false;

  headerActions: Action[] = [];
  helpArticleId = 'PAGE_DOCUMENT_MGMT_SEARCH';
  mode: string;
  criteria: GetDocumentByCriteriaRequestParams = {};
  translatedData: any;
  updatedDataView: any;
  items: MenuItem[];
  searchedResults: any;
  loggedUserName: any;
  isFiltered: any;
  loadMoreSearchResult: DocumentDetailDTO[];

  constructor(
    private readonly translateService: TranslateService,
    private readonly documentV1Service: DocumentControllerV1APIService,
    private readonly portalMessageService: PortalMessageService,
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly datepipe: DatePipe,
    private readonly userDetailsService: UserDetailsService,
    private readonly dataSharingService: DataSharingService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.getLoggedInUserData();
    this.getTranslatedData();
    this.setHeaderActions();
    this.setFilterActions();
  }
  /**
   * function to get translatedData from translateService
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_SEARCH.MSG_NO_RESULTS',
        'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_SUCCESS',
        'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_ERROR',
        'DOCUMENT_MENU.DOCUMENT_EXPORT',
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER',
        'GENERAL.LOAD_MORE',
        'GENERAL.NO_RECORDS_TO_EXPORT',
        'GENERAL.NO_RECORDS_FOR_CHANGES',
        'DOCUMENT_SEARCH.FILTER.CREATED_BY_ME',
        'DOCUMENT_SEARCH.FILTER.RECENTLY_UPDATED',
        'DOCUMENT_SEARCH.FILTER.CLEAR_FILTER',
      ])
      .subscribe((data) => {
        this.translatedData = data;
      });
  }
  /**
   * function to reset search
   * @param mode
   */
  reset(mode: 'basic' | 'advanced'): void {
    this.criteriaComponent.criteriaGroup.reset();
    this.criteriaAdvancedComponent.criteriaGroup.reset();
    this.isBulkEnable = false;
    this.isExportDocEnable = false;
    this.isLoadMoreVisible = false;
  }
  /**
   * Search document based on criteria
   * @param mode flag to return data depending on mode type.
   * @return all documents matching with search criteria.
   */
  search(
    mode = 'basic',
    usePreviousCriteria = false,
    page = 0,
    size = 200
  ): Observable<any> {
    this.isFilterClick = false;
    this.setFilterActions();
    this.mode = mode;
    if (!usePreviousCriteria) {
      if (mode === 'basic') {
        this.criteria = this.criteriaComponent.criteriaGroup.value;
      } else {
        this.criteria = this.criteriaAdvancedComponent.criteriaGroup.value;
      }
    }
    if (this.criteria.startDate) {
      this.criteria.startDate =
        this.datepipe.transform(this.criteria.startDate, 'yyyy-MM-dd') +
        ' 00:00';
    }
    if (this.criteria.endDate) {
      this.criteria.endDate =
        this.datepipe.transform(this.criteria.endDate, 'yyyy-MM-dd') + ' 23:59';
    }
    this.criteria.size = size;
    this.criteria.page = page;
    this.page = page;

    this.isLoading = true;

    return this.documentV1Service.getDocumentByCriteria(this.criteria).pipe(
      finalize(() => (this.isLoading = false)),
      map((data: any) => {
        if (!usePreviousCriteria) {
          this.isShow = false;
          this.isBulkEnable = false;
          this.isExportDocEnable = false;
          this.isLoadMoreVisible = false;
          timer(50).subscribe(() => {
            this.isShow = true;
            if (data.stream.length) {
              this.isBulkEnable = true;
              this.isExportDocEnable = true;
              this.isSearchClicked = true;
              this.totalElements = data.totalElements;
              this.completeElements = data.totalElements;
              this.isLoadMoreDisable = true;
              this.isLoadMoreVisible = true;
            }
          });
        }
        this.searchedResults = JSON.parse(JSON.stringify([...data.stream]));
        localStorage.setItem(
          'searchResults',
          JSON.stringify(this.searchedResults)
        );
        return [...data.stream];
      }),
      tap({
        next: (data) => {
          if (data.length === 0) {
            this.portalMessageService.success({
              summaryKey: this.translateService.instant(
                'DOCUMENT_SEARCH.MSG_NO_RESULTS'
              ),
            });
            this.isLoadMoreVisible = false;
          }
        },
        error: (error) => {
          this.portalMessageService.error({
            summaryKey: this.translateService.instant(
              'DOCUMENT_SEARCH.MSG_NO_RESULTS'
            ),
          });
        },
      })
    );
  }
  /**
   * function to get split button options
   */
  setFilterActions() {
    this.items = [
      {
        label: this.translatedData['DOCUMENT_SEARCH.FILTER.CREATED_BY_ME'],
        styleClass: this.isFiltered === 'A' ? 'bg-primary' : '',
        command: () => {
          this.getFilteredCreatedByMe();
        },
      },
      {
        label: this.translatedData['DOCUMENT_SEARCH.FILTER.RECENTLY_UPDATED'],
        styleClass: this.isFiltered === 'B' ? 'bg-primary' : '',
        command: () => {
          this.getFilteredRecentlyUpdated();
        },
      },
      {
        label: this.translatedData['DOCUMENT_SEARCH.FILTER.CLEAR_FILTER'],
        disabled: !this.isFilterClick,
        command: () => {
          this.clearFilter();
        },
      },
    ];
  }
  /**
   * function to get the logged in username
   */

  getLoggedInUserData() {
    this.userDetailsService.getLoggedInUsername().subscribe((data) => {
      this.loggedUserName = JSON.parse(JSON.stringify(data.userId));
    });
  }
  /**
   * function to filter the results for created by me
   */

  getFilteredCreatedByMe() {
    this.dataSharingService.setSearchResults(this.searchedResults);
    if (this.isLoadMoreClicked) {
      this.dataSharingService.setSearchResults(this.loadMoreSearchResult);
    }
    this.isFilterClick = true;
    this.isFiltered = 'A';
    this.setFilterActions();
    this.isSearchClicked = true;
    this.isLoadMoreDisable = true;
    this.results = this.dataSharingService.getCreatedByMe(this.loggedUserName);
    this.dataSharingService.setSearchResults(this.results);
    this.totalElements = this.results.length;
  }

  /**
   * function to filter the results for recently updated
   */

  getFilteredRecentlyUpdated() {
    this.dataSharingService.setSearchResults(this.searchedResults);
    if (this.isLoadMoreClicked) {
      this.dataSharingService.setSearchResults(this.loadMoreSearchResult);
    }
    this.isFilterClick = true;
    this.isFiltered = 'B';
    this.setFilterActions();
    this.isSearchClicked = true;
    this.isLoadMoreDisable = true;
    this.results = this.dataSharingService.getRecentlyUpdated();
    this.dataSharingService.setSearchResults(this.results);
    this.totalElements = this.results.length;
  }

  /**
   * function to clear the filtered results
   */
  clearFilter() {
    this.isFilterClick = false;
    this.setFilterActions();
    this.isFiltered = '';
    this.search(this.mode || 'basic', true).subscribe({
      next: (data) => {
        this.results = data;
        this.totalElements = this.completeElements;
      },
    });
    this.dataSharingService.setSearchResults(this.searchedResults);
    this.isSearchClicked = true;
  }

  /**
   * Delete document based on selected document
   * @param id to select the particular document id.
   */
  public deleteDocument(id: string): void {
    this.documentV1Service.deleteDocumentById({ id }).subscribe({
      next: () => {
        this.portalMessageService.success({
          summaryKey: this.translateService.instant(
            'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_SUCCESS'
          ),
        });
        this.search(this.mode || 'basic', true).subscribe({
          next: (data) => {
            this.results = data;
            this.totalElements = this.completeElements - 1;
            this.completeElements = this.totalElements;
          },
        });
        this.isSearchClicked = false;
        this.clearFilter();
      },
      error: () => {
        this.portalMessageService.error({
          summaryKey: this.translateService.instant(
            'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_ERROR'
          ),
        });
      },
    });
  }
  /** function to set header actions */
  setHeaderActions() {
    this.headerActions = [
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_VIEW',
        label: this.translateService.instant('DOCUMENT_MENU.DOCUMENT_EXPORT'),
        icon: 'pi pi-download',
        title: this.translateService.instant('DOCUMENT_MENU.DOCUMENT_EXPORT'),
        show: 'asOverflow',
        actionCallback: () => {
          if (this.results.length == 0) {
            this.portalMessageService.success({
              summaryKey: this.translateService.instant(
                'GENERAL.NO_RECORDS_TO_EXPORT'
              ),
            });
          }
          if (this.isExportDocEnable == true) {
            localStorage.setItem(
              'searchCriteria',
              JSON.stringify(this.criteria)
            );
            this.exportAllDocuments();
          }
        },
      },
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_BULK',
        label: this.translateService.instant(
          'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER'
        ),
        icon: 'pi pi-pencil',
        title: this.translateService.instant(
          'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER'
        ),
        show: 'asOverflow',
        actionCallback: () => {
          if (this.results.length == 0) {
            this.portalMessageService.success({
              summaryKey: this.translateService.instant(
                'GENERAL.NO_RECORDS_FOR_CHANGES'
              ),
            });
          }
          if (this.isBulkEnable == true) {
            localStorage.setItem(
              'searchCriteria',
              JSON.stringify(this.criteria)
            );
            localStorage.setItem('isFiltered', this.isFiltered);
            this.router.navigate(['../more/bulkchanges'], {
              relativeTo: this.activeRoute,
            });
          }
        },
      },
    ];
  }
  /** function to export the documents which is found in search result */
  exportAllDocuments() {
    let csvData = [];
    let res = [];
    let header = [];
    this.results?.map((e) => {
      let exportObject = {
        documentName: e?.name,
        documentType: e?.type.name,
        createdBy: e?.creationUser,
        createdOn: e?.creationDate,
        lastModified: e?.modificationDate,
        version: e?.documentVersion,
        channel: e?.channel?.name,
        specification: e?.specification?.name,
        status: e?.lifeCycleState,
        description: e?.description,
        involvement: e?.relatedObject?.involvement,
        objectReferenceType: e?.relatedObject?.objectReferenceType,
        objectReferenceId: e?.relatedObject?.objectReferenceId,
      };
      header = Object.keys(exportObject);
      res.push(exportObject);
    });
    csvData.push(convertToCSV(res, header));

    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    let dwldLink = document.createElement('a');
    let url = URL.createObjectURL(blob);
    dwldLink.setAttribute('href', url);

    const now = new Date();
    const date = this.datepipe.transform(now, 'ddMMyy');
    const time = this.datepipe.transform(now, 'HHmmss');
    dwldLink.setAttribute(
      'download',
      'DocumentDetails-' + date + '-' + time + '.csv'
    );
    dwldLink.click();
  }
  /** function loads more documents if search result has large count */
  loadMoreResults() {
    this.page = this.page + 1;
    this.search(this.mode || 'basic', true, this.page, this.size).subscribe({
      next: (data) => {
        this.results = this.results.concat(data);
        this.loadMoreSearchResult = this.results;
        this.dataSharingService.setSearchResults(this.results);
        localStorage.setItem('searchResults', JSON.stringify(this.results));
      },
    });
    this.isLoadMoreClicked = true;
    this.isLoadMoreDisable = true;
    this.isSearchClicked = false;
  }
  /**
   * function to set load more butthon disable depending on event
   * @param event
   */
  isLoadMoreDisableEvent(event) {
    this.isLoadMoreDisable = event;
  }
  /**
   * function to update data view
   * @param event
   */
  updatedView(event) {
    this.updatedDataView = event;
  }
}
