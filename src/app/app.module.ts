import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  PortalCoreModule,
  APP_CONFIG,
  MockAuthModule,
  PortalMessageService,
} from '@onecx/portal-integration-angular';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BASE_PATH } from './generated';
//TODO verify why this does not work

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { KeycloakAuthModule } from '@onecx/keycloak-auth';
import { Observable } from 'rxjs';
import { TooltipModule } from 'primeng/tooltip';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// function initializer(translate: TranslateService): () => Observable<any> {
//   return () => {
//     translate.addLangs(['en', 'de']);
//     const browserLang = translate.getBrowserLang();

//     // const lang = document.createAttribute('lang');
//     // lang.value = translate.currentLang;
//     // document.documentElement.attributes.setNamedItem(lang);
//     return translate.use(browserLang.match(/en|de/) ? browserLang : 'en');
//   };
// }

// const authModule = KeycloakAuthModule;

function initializer(translate: TranslateService): () => Observable<any> {
  return () => {
    translate.addLangs(['en', 'de']);
    const browserLang = translate.getBrowserLang();
    if (browserLang) {
      return translate.use(browserLang.match(/en|de/) ? browserLang : 'en');
    } else {
      return translate.use('en');
    }
  };
}
@NgModule({
  declarations: [AppComponent],
  imports: [
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
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    TooltipModule,
  ],
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    { provide: BASE_PATH, useValue: 'tkit-document-management-api' },
    { provide: MessageService, useExisting: PortalMessageService },
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [TranslateService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
