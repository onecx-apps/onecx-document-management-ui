// Core imports
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

// Third party imports
import { PortalCoreModule } from '@onecx/portal-integration-angular';

// Application imports
import { CriteriaComponent } from './criteria/criteria.component';
import { DocumentCriteriaAdvancedComponent } from './document-criteria-advanced/document-criteria-advanced.component';
import { DocumentSearchComponent } from './document-search.component';
import { DocumentSearchRoutingModule } from './document-search-routing.module';
import { ResultsComponent } from './results/results.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SplitButtonModule } from 'primeng/splitbutton';

@NgModule({
  declarations: [
    DocumentSearchComponent,
    CriteriaComponent,
    ResultsComponent,
    DocumentCriteriaAdvancedComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    SplitButtonModule,
    DocumentSearchRoutingModule,
    PortalCoreModule.forMicroFrontend(),
  ],
  exports: [DocumentSearchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DatePipe],
})
export class DocumentSearchModule {}
