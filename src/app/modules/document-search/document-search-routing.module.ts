// Core imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Application imports
import { DocumentSearchComponent } from './document-search.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentSearchComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentSearchRoutingModule {}
