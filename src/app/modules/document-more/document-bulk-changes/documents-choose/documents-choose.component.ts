import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DocumentDetailDTO } from 'src/app/generated';
import { DataSharingService } from 'src/app/shared/data-sharing.service';

@Component({
  selector: 'app-documents-choose',
  templateUrl: './documents-choose.component.html',
  styleUrls: ['./documents-choose.component.scss'],
})
export class DocumentsChooseComponent implements OnInit {
  results: DocumentDetailDTO[];
  translatedData: object;
  isHeaderChecked = false;
  @Output() isCheckEvent = new EventEmitter<any>();
  constructor(
    private translateService: TranslateService,
    private dataSharing: DataSharingService
  ) {
    this.results = this.dataSharing.getSearchResults();
    this.onRowClick();
  }
  ngOnInit(): void {
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
    this.dataSharing.setSearchResults(results);
    this.isCheckEvent.emit(isDisabled);
  }
}
