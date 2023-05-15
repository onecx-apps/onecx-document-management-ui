import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import {
  DocumentControllerV1APIService,
  DocumentDetailDTO,
  GetDocumentByCriteriaRequestParams,
} from 'src/app/generated';
import {
  Action,
  PortalSearchPage,
  provideParent,
} from '@onecx/portal-integration-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { tap, finalize, map, catchError } from 'rxjs/operators';
import { CriteriaComponent } from './criteria/criteria.component';
import { DocumentCriteriaAdvancedComponent } from './document-criteria-advanced/document-criteria-advanced.component';
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { DatePipe } from '@angular/common';
import { convertToCSV } from 'src/app/utils';

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
  public criteria: GetDocumentByCriteriaRequestParams = {};
  public helpArticleId = 'PAGE_DOCUMENT_MGMT_SEARCH';
  public headerActions: Action[] = [];
  translatedData: any;
  isLoading = false;
  isShow = true;
  public isBulkEnable: boolean;
  public isExportDocEnable: boolean;
  isLoadMoreVisible = false;
  isLoadMoreDisable = true;
  @ViewChild(CriteriaComponent, { static: false })
  criteriaComponent: CriteriaComponent;
  @ViewChild(DocumentCriteriaAdvancedComponent, { static: false })
  criteriaAdvancedComponent: DocumentCriteriaAdvancedComponent;
  mode: string;
  totalElements: number;
  page = 0;
  size = 200;
  isSearchClicked = false;
  updatedDataView: any;

  constructor(
    private readonly translateService: TranslateService,
    private readonly documentRestApi: DocumentControllerV1APIService,
    private readonly messageService: MessageService,
    private router: Router,
    private readonly route: ActivatedRoute,
    private dataSharing: DataSharingService,
    private datepipe: DatePipe
  ) {
    super();
  }

  public ngOnInit(): void {
    this.translateService
      .get([
        'DOCUMENT_SEARCH.MSG_NO_RESULTS',
        'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_SUCCESS',
        'DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_ERROR',
        'DOCUMENT_MENU.DOCUMENT_EXPORT',
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.HEADER',
        'GENERAL.LOAD_MORE',
      ])
      .subscribe((data) => {
        this.translatedData = data;
      });
    this.setHeaderActions();
  }

  reset(mode: 'basic' | 'advanced'): void {
    this.criteriaComponent.criteriaGroup.reset();
    this.criteriaAdvancedComponent.criteriaGroup.reset();
    this.isBulkEnable = false;
    this.isExportDocEnable = false;
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

    return this.documentRestApi.getDocumentByCriteria(this.criteria).pipe(
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
              this.isLoadMoreVisible = true;
              this.isLoadMoreDisable = true;
              this.isSearchClicked = true;
              this.totalElements = data.totalElements;
            }
          });
        }
        return [...data.stream];
      }),
      tap({
        next: (data) => {
          if (data.length === 0) {
            this.messageService.add({
              severity: 'success',
              summary: this.translatedData['DOCUMENT_SEARCH.MSG_NO_RESULTS'],
            });
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translatedData['DOCUMENT_SEARCH.MSG_NO_RESULTS'],
          });
        },
      })
    );
  }

  /**
   * Delete document based on selected document
   * @param id to select the particular document id.
   */
  public deleteDocument(id: string): void {
    this.documentRestApi.deleteDocumentById({ id }).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary:
            this.translatedData['DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_SUCCESS'],
        });
        this.search(this.mode || 'basic', true).subscribe({
          next: (data) => {
            this.results = data;
          },
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary:
            this.translatedData['DOCUMENT_MENU.DOCUMENT_DELETE.DELETE_ERROR'],
        });
      },
    });
  }
  setHeaderActions() {
    this.headerActions = [
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_VIEW',
        label: this.translateService.instant('DOCUMENT_MENU.DOCUMENT_EXPORT'),
        icon: 'pi pi-download',
        title: this.translateService.instant('DOCUMENT_MENU.DOCUMENT_EXPORT'),
        show: 'asOverflow',
        actionCallback: () => {
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
          if (this.isBulkEnable == true) {
            localStorage.setItem(
              'searchCriteria',
              JSON.stringify(this.criteria)
            );
            this.router.navigate(['../more/bulkchanges'], {
              relativeTo: this.route,
            });
          }
        },
      },
    ];
  }

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
    dwldLink.setAttribute('download', 'DocumentDetails' + '.csv');
    dwldLink.click();
  }

  loadMoreResults() {
    this.page = this.page + 1;
    this.search(this.mode || 'basic', true, this.page, this.size).subscribe({
      next: (data) => {
        this.results = this.results.concat(data);
      },
    });
    this.isLoadMoreDisable = true;
    this.isSearchClicked = false;
  }

  isLoadMoreDisableEvent(event) {
    this.isLoadMoreDisable = event;
  }

  updatedView(event) {
    this.updatedDataView = event;
  }
}
