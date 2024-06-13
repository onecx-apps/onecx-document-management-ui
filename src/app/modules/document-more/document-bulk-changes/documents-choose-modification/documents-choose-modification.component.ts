// Core imports
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Third party imports
import { UserService } from '@onecx/portal-integration-angular';

// Application imports
import { DataSharingService } from 'src/app/shared/data-sharing.service';
import { getBestMatchLanguage } from 'src/app/utils';

@Component({
  selector: 'app-documents-choose-modification',
  templateUrl: './documents-choose-modification.component.html',
  styleUrls: ['./documents-choose-modification.component.scss'],
})
export class DocumentsChooseModificationComponent implements OnInit {
  @Output() isCheckEvent = new EventEmitter<any>();

  chooseModification: any[] = [
    {
      name: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.EDIT_DOCUMENTS',
      key: 'A',
      desc: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.EDIT_DOCUMENTS_DESC',
    },
    {
      name: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DELETE_DOCUMENTS',
      key: 'B',
      desc: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DELETE_DOCUMENTS_DESC',
    },
  ];
  selectedValue: any;
  selectedOperation: any;
  translatedData: object;

  constructor(
    private readonly translateService: TranslateService,
    private userService: UserService,
    private readonly dataSharingService: DataSharingService
  ) {}

  ngOnInit(): void {
    this.translateService.use(getBestMatchLanguage(this.userService));
    this.getTranslatedData();
    this.selectedOperation = this.dataSharingService.getModification();
    this.selectedValue = this.chooseModification.find(
      (element) => element.key == this.selectedOperation
    );
    this.isCheckEvent.emit(this.selectedValue);
  }
  /**
   * function to get translatedData from translateService
   */
  getTranslatedData(): void {
    this.translateService
      .get([
        'DOCUMENT_SEARCH.TABLE.HEADER.MODIFICATION_TYPE',
        'DOCUMENT_SEARCH.TABLE.HEADER.DESCRIPTION',
      ])
      .subscribe((text: object) => {
        this.translatedData = text;
      });
  }
  /**
   * function to emit radio check event and set the selected key
   */
  onItemChange() {
    this.isCheckEvent.emit(true);
    this.dataSharingService.setModification(this.selectedValue.key);
  }
}
