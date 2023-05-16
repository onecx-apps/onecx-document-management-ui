import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEditComponent } from './document-edit/document-edit.component';

import { DocumentCreateComponent } from './document-create/document-create.component';

import { DocumentDetailRoutingModule } from './document-detail-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { GenericFormArrayComponent } from './generic-form-components/generic-form-array/generic-form-array.component';

import { DocumentDescriptionComponent } from './document-create/document-description/document-description.component';
import { DocumentAttachmentComponent } from './document-create/document-attachment/document-attachment.component';
import { DocumentCharacteristicsComponent } from './document-create/document-characteristics/document-characteristics.component';
import { DocumentEditDetailsComponent } from './document-edit/document-edit-details/document-edit-details.component';
import { DocumentEditRelatedObjectsComponent } from './document-edit/document-edit-related-objects/document-edit-related-objects.component';
import { DocumentEditAttachmentComponent } from './document-edit/document-edit-attachment/document-edit-attachment.component';
import { DocumentEditLifecycleComponent } from './document-edit/document-edit-lifecycle/document-edit-lifecycle.component';
import { DocumentEditCharacteristicsComponent } from './document-edit/document-edit-characteristics/document-edit-characteristics.component';
import { DocumentQuickUploadComponent } from './document-quick-upload/document-quick-upload.component';
import { PortalCoreModule } from '@onecx/portal-integration-angular';
import { DocumentQuickUploadFormComponent } from './document-quick-upload/document-quick-upload-form/document-quick-upload-form.component';
@NgModule({
  declarations: [
    DocumentEditComponent,
    DocumentCreateComponent,
    GenericFormArrayComponent,
    DocumentDescriptionComponent,
    DocumentAttachmentComponent,
    DocumentCharacteristicsComponent,
    DocumentEditDetailsComponent,
    DocumentEditRelatedObjectsComponent,
    DocumentEditAttachmentComponent,
    DocumentEditLifecycleComponent,
    DocumentEditCharacteristicsComponent,
    DocumentQuickUploadComponent,
    DocumentQuickUploadFormComponent,
  ],
  imports: [
    CommonModule,
    DocumentDetailRoutingModule,
    SharedModule,
    PortalCoreModule.forMicroFrontend(),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DocumentDetailModule {}
