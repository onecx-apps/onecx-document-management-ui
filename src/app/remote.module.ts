import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  createTranslateLoader,
  MFE_INFO,
  PortalCoreModule,
  PortalDialogService,
  PortalMessageService,
} from '@onecx/portal-integration-angular';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { BASE_PATH } from './generated';
import { DocumentSearchModule } from './modules/document-search/document-search.module';
import { CanActivateGuard } from './shared/can-active-guard.service';
import { SharedModule } from './shared/shared.module';
import { basePathProvider } from './utils';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search',
    pathMatch: 'full',
  },
  {
    path: 'search',
    canActivate: [CanActivateGuard],
    loadChildren: () => DocumentSearchModule,
  },
  {
    path: 'detail',
    canActivate: [CanActivateGuard],
    loadChildren: () =>
      import('src/app/modules/document-detail/document-detail.module').then(
        (m) => m.DocumentDetailModule
      ),
  },
  {
    path: 'more',
    canActivate: [CanActivateGuard],
    loadChildren: () =>
      import('src/app/modules/document-more/document-more.module').then(
        (m) => m.DocumentMoreModule
      ),
  },
];
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forRoot({
      extend: true,
      isolate: false,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, MFE_INFO],
      },
    }),
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(routes),
  ],
  exports: [],
  providers: [
    { provide: MessageService, useExisting: PortalMessageService },
    { provide: DialogService, useClass: PortalDialogService },
    {
      provide: BASE_PATH,
      useFactory: basePathProvider,
      deps: [MFE_INFO],
    },
  ],
})
export class DocumentRemoteModule {}
