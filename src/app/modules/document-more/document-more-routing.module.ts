import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from 'src/app/shared/can-active-guard.service';
import { DocumentBulkChangesComponent } from './document-bulk-changes/document-bulk-changes.component';

const routes: Routes = [
  {
    path: 'bulkchanges',
    component: DocumentBulkChangesComponent,
    canActivate: [CanActivateGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentMoreRoutingModule {}
