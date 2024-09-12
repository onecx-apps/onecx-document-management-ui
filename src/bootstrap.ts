import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapModule } from '@onecx/angular-webcomponents';
import { DocumentRemoteModule } from './app/remote.module';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

bootstrapModule(DocumentRemoteModule, 'microfrontend', environment.production);
