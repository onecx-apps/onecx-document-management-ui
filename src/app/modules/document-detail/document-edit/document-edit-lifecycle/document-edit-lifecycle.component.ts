import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  DocumentControllerV1APIService,
  LifeCycleState,
} from 'src/app/generated';

@Component({
  selector: 'app-document-edit-lifecycle',
  templateUrl: './document-edit-lifecycle.component.html',
  styleUrls: ['./document-edit-lifecycle.component.scss'],
})
export class DocumentEditLifecycleComponent implements OnInit {
  @Input() public documentId: string;
  timeLineEntries;
  translatedData: Record<string, string>;
  documentStatus: any;
  documentStatusList: { label: any; value: string }[];

  constructor(
    private readonly documentAPI: DocumentControllerV1APIService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.refreshTimeline();
    this.loadDocumentStatus();
  }

  public refreshTimeline(): void {
    this.documentAPI.getDocumentById({ id: this.documentId }).subscribe({
      next: (data) => {
        this.timeLineEntries = data;
        this.documentStatus = data.lifeCycleState;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary:
            this.translatedData['DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_ERROR'],
        });
      },
    });
  }

  private loadDocumentStatus(): void {
    this.documentStatusList = Object.keys(LifeCycleState).map((key) => ({
      label: LifeCycleState[key],
      value: key,
    }));
  }
}
