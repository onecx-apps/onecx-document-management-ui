// Core imports
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Third party imports
import { PortalCoreModule } from '@onecx/portal-integration-angular';

// Application imports
import { DocumentBulkChangesComponent } from './document-bulk-changes/document-bulk-changes.component';
import { DocumentsChooseComponent } from './document-bulk-changes/documents-choose/documents-choose.component';
import { DocumentsChooseModificationComponent } from './document-bulk-changes/documents-choose-modification/documents-choose-modification.component';
import { DocumentsDeleteComponent } from './document-bulk-changes/documents-delete/documents-delete.component';
import { DocumentsUpdateComponent } from './document-bulk-changes/documents-update/documents-update.component';
import { DocumentMoreRoutingModule } from './document-more-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
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
    FormsModule,
    PortalCoreModule.forMicroFrontend(),
  ],
})
export class DocumentMoreModule {}
