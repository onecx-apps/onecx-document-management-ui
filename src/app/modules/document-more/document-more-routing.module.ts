// Core imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Third party imports
import {  addInitializeModuleGuard } from '@onecx/angular-integration-interface'

// Application imports
import { DocumentBulkChangesComponent } from './document-bulk-changes/document-bulk-changes.component';

const routes: Routes = [
  {
    path: 'bulkchanges',
    component: DocumentBulkChangesComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(addInitializeModuleGuard(routes))],
  exports: [RouterModule],
})
export class DocumentMoreRoutingModule {}
