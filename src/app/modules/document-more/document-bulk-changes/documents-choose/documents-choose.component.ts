// Core imports
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Third party imports
import { TranslateService } from '@ngx-translate/core';

// Application imports
import { DocumentDetailDTO } from 'src/app/generated';
import { DataSharingService } from 'src/app/shared/data-sharing.service';

@Component({
  selector: 'app-documents-choose',
  templateUrl: './documents-choose.component.html',
  styleUrls: ['./documents-choose.component.scss'],
})
export class DocumentsChooseComponent implements OnInit {
  @Output() isCheckEvent = new EventEmitter<any>();

  isHeaderChecked = false;

  results: DocumentDetailDTO[];
  translatedData: object;

  constructor(
    private readonly translateService: TranslateService,
    private readonly dataSharingService: DataSharingService
  ) {
    this.results = this.dataSharingService.getSearchResults();
    this.onRowClick();
  }
  ngOnInit(): void {
    this.getTranslatedData();
  }
  /**
   * function to get translatedData from translateService
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.CHOOSE_DOCUMENT',
        'RESULTS.NAME',
        'RESULTS.DOCUMENT_TYPE',
        'RESULTS.STATUS',
        'RESULTS.VERSION',
      ])
      .subscribe((text: object) => {
        this.translatedData = text;
      });
  }
  /**
   * function to check header check box if all the rows have selected
   */
  onRowClick() {
    this.isHeaderChecked = this.results?.every(
      (item: DocumentDetailDTO) => item['isChecked']
    );

    this.isResultsChecked(this.results);
  }

  /**
   * function to check/de-select all the rows depends on header check value
   */
  onHeaderClick() {
    this.results = this.results.map((item) => {
      return {
        ...item,
        isChecked: this.isHeaderChecked,
      };
    });

    this.isResultsChecked(this.results);
  }

  /**
   *
   * @param results
   * @returns truthy/falsy depends on results selection
   */
  isResultsChecked(results: DocumentDetailDTO[]) {
    const isDisabled = results?.filter(
      (result: DocumentDetailDTO) => result['isChecked']
    ).length;
    this.dataSharingService.setSearchResults(results);
    this.isCheckEvent.emit(isDisabled);
  }
}
