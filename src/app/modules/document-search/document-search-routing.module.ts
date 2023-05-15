import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateGuard } from 'src/app/shared/can-active-guard.service';
import { DocumentSearchComponent } from './document-search.component';

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
