// Core imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Third party imports
import {  addInitializeModuleGuard } from '@onecx/angular-integration-interface';

// Application imports
import { DocumentSearchComponent } from './document-search.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentSearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(addInitializeModuleGuard(routes))],
  exports: [RouterModule],
})
export class DocumentSearchRoutingModule {}
