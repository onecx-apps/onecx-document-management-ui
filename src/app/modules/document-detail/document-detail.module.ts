// Core imports
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

// Third party imports
import { PortalCoreModule } from '@onecx/portal-integration-angular';

// Application imports
import { DocumentAttachmentComponent } from './document-create/document-attachment/document-attachment.component';
import { DocumentCharacteristicsComponent } from './document-create/document-characteristics/document-characteristics.component';
import { DocumentCreateComponent } from './document-create/document-create.component';
import { DocumentDescriptionComponent } from './document-create/document-description/document-description.component';
import { DocumentDetailRoutingModule } from './document-detail-routing.module';
import { DocumentEditAttachmentComponent } from './document-edit/document-edit-attachment/document-edit-attachment.component';
import { DocumentEditCharacteristicsComponent } from './document-edit/document-edit-characteristics/document-edit-characteristics.component';
import { DocumentEditComponent } from './document-edit/document-edit.component';
import { DocumentEditDetailsComponent } from './document-edit/document-edit-details/document-edit-details.component';
import { DocumentEditLifecycleComponent } from './document-edit/document-edit-lifecycle/document-edit-lifecycle.component';
import { DocumentEditRelatedObjectsComponent } from './document-edit/document-edit-related-objects/document-edit-related-objects.component';
import { DocumentQuickUploadFormComponent } from './document-quick-upload/document-quick-upload-form/document-quick-upload-form.component';
import { DocumentQuickUploadComponent } from './document-quick-upload/document-quick-upload.component';
import { GenericFormArrayComponent } from './generic-form-components/generic-form-array/generic-form-array.component';
import { SharedModule } from 'src/app/shared/shared.module';
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
