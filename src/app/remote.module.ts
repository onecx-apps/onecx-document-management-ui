import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import {
  createTranslateLoader,
  AppStateService,
  ConfigurationService,
  PortalCoreModule,
  PortalDialogService,
  PortalMessageService,
  PortalApiConfiguration,
} from '@onecx/portal-integration-angular';
import {
  addInitializeModuleGuard,
  InitializeModuleGuard,
} from '@onecx/angular-integration-interface';
import { DialogService } from 'primeng/dynamicdialog';
import { Configuration } from './generated';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';
import { routes } from './app-routing.module';

export function apiConfigProvider(
  configService: ConfigurationService,
  appStateService: AppStateService
) {
  return new PortalApiConfiguration(
    Configuration,
    environment.API_BASE_PATH,
    configService,
    appStateService
  );
}
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
        deps: [HttpClient, AppStateService],
      },
    }),
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
  ],
  exports: [],
  providers: [
    InitializeModuleGuard,
    { provide: DialogService, useClass: PortalDialogService },
    {
      provide: Configuration,
      useFactory: apiConfigProvider,
      deps: [ConfigurationService, AppStateService],
    },
  ],
})
export class DocumentRemoteModule {}
