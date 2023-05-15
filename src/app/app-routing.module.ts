import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { DocumentSearchModule } from './modules/document-search/document-search.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    loadChildren: () => DocumentSearchModule,
  },
  {
    path: 'detail',
    loadChildren: () =>
      import('src/app/modules/document-detail/document-detail.module').then(
        (m) => m.DocumentDetailModule
      ),
  },
  {
    path: 'more',
    loadChildren: () =>
      import('src/app/modules/document-more/document-more.module').then(
        (m) => m.DocumentMoreModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
