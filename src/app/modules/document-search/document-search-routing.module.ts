// Core imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Application imports
import { DocumentSearchComponent } from './document-search.component';
import { CanActivateGuard } from 'src/app/shared/can-active-guard.service';

const routes: Routes = [
  {
    path: '',
    component: DocumentSearchComponent,
    canActivate: [CanActivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentSearchRoutingModule {}
