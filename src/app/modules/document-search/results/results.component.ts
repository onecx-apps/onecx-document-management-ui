/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectorRef,
  OnChanges,
  Inject,
} from '@angular/core';
import { DocumentDetailDTO } from 'src/app/generated';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import {
  AUTH_SERVICE,
  Column,
  ColumnViewTemplate,
  IAuthService,
} from '@onecx/portal-integration-angular';
import { generateFilteredColumns, initFilteredColumns } from 'src/app/utils';

enum SortOrder {
  ASCENDING,
  DESCENDING,
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  @Input('results') set resultsArray(value: DocumentDetailDTO[]) {
    this.results = value;
    this.showPageReport = this.results?.length > 0;
    this.showPaginator = this.results?.length > 0;
  }
  @Input() public isShow: boolean;
  @Input() public totalElements: number;
  @Input() public isSearchClicked: boolean;
  results: DocumentDetailDTO[];
  first: number;
  rowsPerPage = 20;
  rowsPerPageOptions = [20, 50, 100];
  layout: 'table' | 'list' | 'grid' = 'table';
  items: MenuItem[] = [];
  routerUrl: string;
  translatedData: object;
  selectedDocument: DocumentDetailDTO;
  deleteDialogVisible: boolean;
  @Output() deleteDocument: EventEmitter<any> = new EventEmitter();
  @Output() isLoadMoreDisableEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() updatedView: EventEmitter<any> = new EventEmitter();
  sortField: string = null;
  sortFields: SelectItem[];
  sortOrder = -1;
  sortOrderType: SortOrder = SortOrder.DESCENDING;
  selectedSortField: SelectItem;
  dataView: DataView;
  showPageReport = false;
  showPaginator = false;

  public columns: Column[] = [
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
      active: false,
    },
  ];
  public filteredColumns: Column[] = [];

  public columnTemplate: ColumnViewTemplate[] = [
    {
      label: 'DOCUMENT_DETAIL.COLUMN_TEMPLATES.EXTENDED',
      template: [
        { field: 'name', active: true },
        { field: 'type.name', active: true },
        { field: 'lifeCycleState', active: true },
        { field: 'documentVersion', active: true },
        { field: 'creationUser', active: false },
        { field: 'creationDate', active: false },
        { field: 'modificationDate', active: true },
      ],
    },
    {
      label: 'DOCUMENT_DETAIL.COLUMN_TEMPLATES.FULL',
      template: [
        { field: 'name', active: true },
        { field: 'type.name', active: true },
        { field: 'lifeCycleState', active: true },
        { field: 'documentVersion', active: true },
        { field: 'creationUser', active: true },
        { field: 'creationDate', active: true },
        { field: 'modificationDate', active: true },
      ],
    },
  ];

  constructor(
    @Inject(AUTH_SERVICE) private authService: IAuthService,
    private router: Router,
    private translateService: TranslateService,
    private cdRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.filteredColumns = initFilteredColumns(this.columns);
    this.translateService
      .get([
        'GENERAL.EDIT',
        'GENERAL.DELETE',
        'GENERAL.SORT',
        'RESULTS.LAST_MODIFIED',
        'RESULTS.DATE_CREATED',
        'RESULTS.TITLE',
        'RESULTS.NAME',
        'RESULTS.DOCUMENT_TYPE',
        'RESULTS.STATUS',
        'RESULTS.MODIFICATION_DATE',
        'DOCUMENT_DETAIL.COLUMN_TEMPLATES.EXTENDED',
        'DOCUMENT_DETAIL.COLUMN_TEMPLATES.FULL',
        'DOCUMENT_DETAIL.COLUMN_TEMPLATES.PLACEHOLDER',
      ])
      .subscribe((text: object) => {
        this.translatedData = text;
        this.constructMenu();
        this.sortFields = [
          {
            label: this.translatedData['RESULTS.LAST_MODIFIED'],
            value: 'modificationDate',
          },
          {
            label: this.translatedData['RESULTS.DATE_CREATED'],
            value: 'creationDate',
          },
          {
            label: this.translatedData['RESULTS.TITLE'],
            value: 'name',
          },
        ];
      });
  }
  /**
   * Sets the record of selected document
   * @param event holds the record of selected document.
   */
  setSelectedDocument(event: DocumentDetailDTO) {
    this.selectedDocument = event;
  }
  /**
   * Closes the delete confirmation dialog box if user selects no option
   */
  onCancelDelete() {
    this.selectedDocument = undefined;
    this.deleteDialogVisible = false;
  }
  /**
   * Emits the selected document id to the parent component if user selects yes option from the dialog box
   */
  onDelete() {
    if (this.selectedDocument != undefined) {
      this.deleteDocument.emit(this.selectedDocument.id);
    }
    this.deleteDialogVisible = false;
  }
  /**
   * Tracks the updated value of view layout
   */
  updateResultsLayout(event: any) {
    this.layout = event;
    this.updatedView.emit(this.layout);
  }
  /**
   * Creates actions list on document
   */
  private constructMenu() {
    const itemList = [
      {
        permission: 'DOCUMENT_MGMT#DOCUMENT_EDIT',
        object: {
          label: this.translatedData['GENERAL.EDIT'],
          icon: 'pi pi-pencil',
          command: () => {
            const id = this.selectedDocument.id;
            this.selectedDocument = undefined;
            this.router.navigate(['../detail/edit/', id], {
              relativeTo: this.route,
            });
          },
        },
      },
      {
        object: {
          label: this.translatedData['GENERAL.DELETE'],
          icon: 'pi pi-trash',
          command: (event) => {
            this.deleteDialogVisible = true;
          },
        },
      },
    ];
    this.addAccessableItems(itemList);
  }
  /**
   * Add accessacle actions to item list
   */
  addAccessableItems(items: any) {
    for (const entry of items) {
      if (
        entry.permission
          ? this.authService.hasPermission(entry.permission)
          : true
      ) {
        this.items.push(entry.object);
      }
    }
  }

  /**
   * Add the sort type
   */
  onSortOrderChange(sortOrder: boolean) {
    this.sortOrderType =
      sortOrder === true ? SortOrder.ASCENDING : SortOrder.DESCENDING;
    this.updateSorting();
  }
  /**
   * Add sort field
   */
  onSortFieldChange(sortField: string) {
    this.sortField = sortField;
    this.updateSorting();
  }
  /**
   * Sorting the field as per field names
   */
  updateSorting() {
    if (this.sortField === 'modificationDate') {
      this.sortOrder = this.sortOrderType === SortOrder.ASCENDING ? -1 : 1;
    } else {
      this.sortOrder = this.sortOrderType === SortOrder.ASCENDING ? 1 : -1;
    }
  }
  /**
   * Function to handle coulmn change in table view
   * @Param Active columns Id
   */
  handleColumnChange(activeColumnIds: string[]) {
    const { columns, filteredColumns } = generateFilteredColumns(
      activeColumnIds,
      this.columns
    );

    this.columns = columns;
    this.filteredColumns = filteredColumns;
  }

  ngOnChanges() {
    if (this.isSearchClicked) {
      this.first = 0;
    }
  }

  onPageChange(event) {
    if (this.totalElements == this.results.length) {
      this.isLoadMoreDisableEvent.emit(true);
    } else if (event.first >= this.results?.length - event.rows) {
      this.isLoadMoreDisableEvent.emit(false);
    } else if (this.results?.length <= event.rows) {
      this.isLoadMoreDisableEvent.emit(false);
    } else {
      this.isLoadMoreDisableEvent.emit(true);
    }
  }
}
