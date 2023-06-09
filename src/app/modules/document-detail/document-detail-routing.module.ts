// Core imports
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Application imports
import { DocumentCreateComponent } from './document-create/document-create.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { DocumentQuickUploadComponent } from './document-quick-upload/document-quick-upload.component';
import { CanActivateGuard } from 'src/app/shared/can-active-guard.service';

const routes: Routes = [
  {
    path: 'create',
    component: DocumentCreateComponent,
    canActivate: [CanActivateGuard],
  },
  {
    path: 'edit/:id',
    component: DocumentEditComponent,
    canActivate: [CanActivateGuard],
  },
  {
    path: 'quickupload',
    component: DocumentQuickUploadComponent,
    canActivate: [CanActivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentDetailRoutingModule {}
