// Core imports
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

// Application imports
import { DataSharingService } from 'src/app/shared/data-sharing.service';

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

  constructor(private readonly dataSharingService: DataSharingService) {}

  ngOnInit(): void {
    this.selectedOperation = this.dataSharingService.getModification();
    this.selectedValue = this.chooseModification.find(
      (element) => element.key == this.selectedOperation
    );
    this.isCheckEvent.emit(this.selectedValue);
  }
  /**
   * function to emit radio check event and set the selected key
   */
  onItemChange() {
    this.isCheckEvent.emit(true);
    this.dataSharingService.setModification(this.selectedValue.key);
  }
}
