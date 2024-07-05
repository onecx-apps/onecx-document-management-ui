// Core imports
import { Component, Input, OnInit } from '@angular/core';

// Third party imports
import { PortalMessageService } from '@onecx/portal-integration-angular';

// Application imports
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
  @Input() documentId: string;

  documentStatusList: { label: any; value: string }[];
  documentStatus: any;
  timeLineEntries;
  translatedData: Record<string, string>;

  constructor(
    private readonly documentV1Service: DocumentControllerV1APIService,
    private readonly portalMessageService: PortalMessageService
  ) {}

  ngOnInit(): void {
    this.refreshTimeline();
    this.loadDocumentStatus();
  }
  /**
   * function to refresh timeline to show dropdown values in document status
   */
  public refreshTimeline(): void {
    this.documentV1Service.getDocumentById({ id: this.documentId }).subscribe({
      next: (data) => {
        this.timeLineEntries = data;
        this.documentStatus = data.lifeCycleState;
      },
      error: () => {
        this.portalMessageService.error({
          summaryKey: 'DOCUMENT_MENU.DOCUMENT_EDIT.UPDATE_ERROR',
        });
      },
    });
  }

  /**
   * Wrapper method for loadDocumentStatus() to write Unit Test for this private method
   */
  public loadDocumentStatusWrapper() {
    this.loadDocumentStatus();
  }

  private loadDocumentStatus(): void {
    this.documentStatusList = Object.keys(LifeCycleState).map((key) => ({
      label: LifeCycleState[key],
      value: key,
    }));
  }
}
