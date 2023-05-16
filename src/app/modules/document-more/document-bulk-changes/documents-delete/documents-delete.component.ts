import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DocumentDetailDTO } from 'src/app/generated';

@Component({
  selector: 'app-documents-delete',
  templateUrl: './documents-delete.component.html',
  styleUrls: ['./documents-delete.component.scss'],
})
export class DocumentsDeleteComponent implements OnInit {
  @Input() checkedResults: DocumentDetailDTO[] = [];

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.translateService
      .get([
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.MODIFICATION_CONFIRMATION',
        'DOCUMENT_MENU.DOCUMENT_MORE.DOCUMENT_BULK.DELETE_DOCUMENT_NOTIFICATION',
        'RESULTS.NAME',
        'RESULTS.DOCUMENT_TYPE',
        'RESULTS.STATUS',
        'RESULTS.VERSION',
      ])
      .subscribe(() => {});
  }
}
