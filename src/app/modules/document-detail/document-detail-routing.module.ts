// Core imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Application imports
import { DocumentCreateComponent } from './document-create/document-create.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { DocumentQuickUploadComponent } from './document-quick-upload/document-quick-upload.component';

const routes: Routes = [
  {
    path: 'create',
    component: DocumentCreateComponent,
  },
  {
    path: 'edit/:id',
    component: DocumentEditComponent,
  },
  {
    path: 'quickupload',
    component: DocumentQuickUploadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentDetailRoutingModule {}
