// Core imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Third party imports
import {
  PortalCoreModule,
  APP_CONFIG,
  PortalMessageService,
  AppStateService,
  UserService,
  TranslateCombinedLoader,
  createTranslateLoader,
  translateServiceInitializer,
} from '@onecx/portal-integration-angular';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { KeycloakAuthModule } from '@onecx/keycloak-auth';
import { Observable } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

// Application imports
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { BASE_PATH } from './generated/index';
import { CommonModule } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

function initializer(
  translateService: TranslateService
): () => Observable<any> {
  return () => {
    translateService.addLangs(['en', 'de']);
    const browserLang = translateService.getBrowserLang();
    if (browserLang) {
      return translateService.use(
        browserLang.match(/en|de/) ? browserLang : 'en'
      );
    } else {
      return translateService.use('en');
    }
  };
}

export const commonImports = [CommonModule];
@NgModule({
  declarations: [AppComponent],
  imports: [
    ...commonImports,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    PortalCoreModule.forRoot('document-mgmt'),
    KeycloakAuthModule,
    HttpClientModule,
    TranslateModule.forRoot({
      extend: true,
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient, AppStateService],
      },
    }),
    TooltipModule,
  ],
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    {
      provide: APP_INITIALIZER,
      useFactory: translateServiceInitializer,
      multi: true,
      deps: [UserService, TranslateService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
