import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DocumentSearchRoutingModule } from './document-search-routing.module';
import { CriteriaComponent } from './criteria/criteria.component';
import { ResultsComponent } from './results/results.component';
import { DocumentSearchComponent } from './document-search.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentCriteriaAdvancedComponent } from './document-criteria-advanced/document-criteria-advanced.component';
import { DocumentViewModeComponent } from './document-view-mode/document-view-mode.component';
import { PortalCoreModule } from '@onecx/portal-integration-angular';

@NgModule({
  declarations: [
    DocumentSearchComponent,
    CriteriaComponent,
    ResultsComponent,
    DocumentCriteriaAdvancedComponent,
    DocumentViewModeComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    DocumentSearchRoutingModule,
    PortalCoreModule.forMicroFrontend(),
  ],
  exports: [DocumentSearchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
})
export class DocumentSearchModule {}
