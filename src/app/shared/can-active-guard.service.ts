import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from '@onecx/portal-integration-angular';
import { filter, Observable, of, switchMap, tap } from 'rxjs';

@Injectable()
export class CanActivateGuard implements CanActivate {
  private SUPPORTED_LANGS = ['en', 'de'];
  private DEFAULT_LANG = 'en';
  constructor(
    private txService: TranslateService,
    private config: ConfigurationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.loadTranslations(route).pipe(
      tap((res) =>
        console.log(`Translation guard done ${this.txService.currentLang}`)
      )
    );
  }

  getBestMatchLanguage(lang: string) {
    if (this.SUPPORTED_LANGS.includes(lang)) {
      return lang;
    } else {
      console.log(
        `${lang} is not supported. Using ${this.DEFAULT_LANG} as a fallback.`
      );
    }
    return this.DEFAULT_LANG;
  }

  loadTranslations(route: ActivatedRouteSnapshot): Observable<boolean> {
    console.log(`Start Translation guard`);

    return this.config.lang$.pipe(
      filter((v) => v !== undefined),
      switchMap((lang) => this.txService.use(this.getBestMatchLanguage(lang))),
      switchMap(() => of(true))
    );
  }
}
