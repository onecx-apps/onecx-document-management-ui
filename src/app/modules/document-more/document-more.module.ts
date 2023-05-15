import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentMoreRoutingModule } from './document-more-routing.module';
import { DocumentExportComponent } from './document-export/document-export.component';
import { DocumentBulkChangesComponent } from './document-bulk-changes/document-bulk-changes.component';
import { DocumentsChooseComponent } from './document-bulk-changes/documents-choose/documents-choose.component';
import { DocumentsChooseModificationComponent } from './document-bulk-changes/documents-choose-modification/documents-choose-modification.component';
import { DocumentsDeleteComponent } from './document-bulk-changes/documents-delete/documents-delete.component';
import { DocumentsUpdateComponent } from './document-bulk-changes/documents-update/documents-update.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PortalCoreModule } from '@onecx/portal-integration-angular';

@NgModule({
  declarations: [
    DocumentExportComponent,
    DocumentBulkChangesComponent,
    DocumentsChooseComponent,
    DocumentsChooseModificationComponent,
    DocumentsDeleteComponent,
    DocumentsUpdateComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DocumentMoreRoutingModule,
    PortalCoreModule.forMicroFrontend(),
  ],
})
export class DocumentMoreModule {}
