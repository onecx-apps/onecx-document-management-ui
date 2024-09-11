import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  APP_INITIALIZER,
  DoBootstrap,
  Injector,
  isDevMode,
  NgModule,
} from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createCustomElement } from '@angular/elements';
import {
  AppStateService,
  ConfigurationService,
  PortalCoreModule,
  PortalDialogService,
  PortalMessageService,
  PortalApiConfiguration,
  createTranslateLoader,
} from '@onecx/portal-integration-angular';
import {
  addInitializeModuleGuard,
  InitializeModuleGuard,
} from '@onecx/angular-integration-interface';
import { AngularAuthModule } from '@onecx/angular-auth';
import { DialogService } from 'primeng/dynamicdialog';
import { Configuration } from './generated';
import { SharedModule } from './shared/shared.module';
import { environment } from 'src/environments/environment';
import { routes } from './app-routing.module';
import { AppEntrypointComponent } from './app-entrypoint.component';
import {
  createAppEntrypoint,
  initializeRouter,
} from '@onecx/angular-webcomponents';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { commonImports } from './app.module';

export function withModuleFederationPlugin(arg0: { exposes: any }) {
  throw new Error('Function not implemented.');
}
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
  declarations: [AppEntrypointComponent],
  imports: [
    ...commonImports,
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularAuthModule,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forRoot(addInitializeModuleGuard(routes)),
    TranslateModule.forRoot({
      extend: true,
      isolate: false,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService],
      },
    }),
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
    {
      provide: APP_INITIALIZER,
      useFactory: initializeRouter,
      multi: true,
      deps: [Router, AppStateService],
    },
  ],
})
export class DocumentRemoteModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    createAppEntrypoint(
      AppEntrypointComponent,
      'onecx-document-management-component',
      this.injector
    );
  }
}
