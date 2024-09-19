import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { DocumentSearchModule } from './modules/document-search/document-search.module';
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface';
import { startsWith } from '@onecx/angular-webcomponents';

export const routes: Routes = [
  {
    matcher: startsWith('search'),
    loadChildren: () => DocumentSearchModule,
  },
  {
    matcher: startsWith('detail'),
    loadChildren: () =>
      import('src/app/modules/document-detail/document-detail.module').then(
        (m) => m.DocumentDetailModule
      ),
  },
  {
    matcher: startsWith('more'),
    loadChildren: () =>
      import('src/app/modules/document-more/document-more.module').then(
        (m) => m.DocumentMoreModule
      ),
  },
  {
    matcher: startsWith(''),
    redirectTo: 'search',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
