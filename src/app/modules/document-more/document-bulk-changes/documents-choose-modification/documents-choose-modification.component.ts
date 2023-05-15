import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataSharingService } from 'src/app/shared/data-sharing.service';

@Component({
  selector: 'app-documents-choose-modification',
  templateUrl: './documents-choose-modification.component.html',
  styleUrls: ['./documents-choose-modification.component.scss'],
})
export class DocumentsChooseModificationComponent implements OnInit {
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
    // {
    //   name: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.ADD_ATTACHMENTS',
    //   key: 'C',
    //   desc: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.ADD_ATTACHMENTS_DESC',
    // },
    // {
    //   name: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DELETE_ATTACHMENTS',
    //   key: 'D',
    //   desc: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DELETE_ATTACHMENTS_DESC',
    // },
    // {
    //   name: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DOWNLOAD_ATTACHMENTS',
    //   key: 'E',
    //   desc: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DOWNLOAD_ATTACHMENTS_DESC',
    // },
    // {
    //   name: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.ADD_CHARACTERISTICS',
    //   key: 'F',
    //   desc: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.ADD_CHARACTERISTICS_DESC',
    // },
    // {
    //   name: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DELETE_CHARACTERISTICS',
    //   key: 'G',
    //   desc: 'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_MODIFICATION.DELETE_CHARACTERISTICS_DESC',
    // },
  ];
  selectedValue: any;
  selectedOperation: any;
  @Output() isCheckEvent = new EventEmitter<any>();

  constructor(private service: DataSharingService) {}

  ngOnInit(): void {
    this.selectedOperation = this.service.getModification();
    this.selectedValue = this.chooseModification.find(
      (element) => element.key == this.selectedOperation
    );
    this.isCheckEvent.emit(this.selectedValue);
  }
  onItemChange() {
    this.isCheckEvent.emit(true);
    this.service.setModification(this.selectedValue.key);
  }
}
