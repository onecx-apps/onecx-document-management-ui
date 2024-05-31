// Core imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Application imports
import { DocumentBulkChangesComponent } from './document-bulk-changes/document-bulk-changes.component';

const routes: Routes = [
  {
    path: 'bulkchanges',
    component: DocumentBulkChangesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentMoreRoutingModule {}
