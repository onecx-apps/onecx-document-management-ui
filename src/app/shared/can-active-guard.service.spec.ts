import { TestBed } from '@angular/core/testing';
import { CanActivateGuard } from './can-active-guard.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from '@onecx/portal-integration-angular';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('CanActivateGuard', () => {
  let guard: CanActivateGuard;

  beforeEach(async () => {
    const translateSpy = jasmine.createSpyObj('TranslateService', ['use']);
    const configSpy = jasmine.createSpyObj('ConfigurationService', ['lang$']);
    await TestBed.configureTestingModule({
      providers: [
        CanActivateGuard,
        { provide: TranslateService, useValue: translateSpy },
        { provide: ConfigurationService, useValue: configSpy },
      ],
    }).compileComponents();
    guard = TestBed.inject(CanActivateGuard);
  });

  it('should return the provided language if it is supported', () => {
    const supportedLang = 'en';
    const result = guard.getBestMatchLanguage(supportedLang);
    expect(result).toBe(supportedLang);
  });

  it('should return the default language and log a message if the provided language is not supported', () => {
    const unsupportedLang = 'fr';
    const consoleSpy = spyOn(console, 'log');
    const result = guard.getBestMatchLanguage(unsupportedLang);
    expect(result).toBe(guard['DEFAULT_LANG']);
    expect(consoleSpy).toHaveBeenCalledWith(
      `${unsupportedLang} is not supported. Using ${guard['DEFAULT_LANG']} as a fallback.`
    );
  });

  it('should return true when translations are loaded', (done: DoneFn) => {
    spyOn(guard, 'loadTranslations').and.returnValue(of(true));
    const mockActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
    const mockRouterStateSnapshot = {} as RouterStateSnapshot;
    const result = guard.canActivate(
      mockActivatedRouteSnapshot,
      mockRouterStateSnapshot
    );
    if (result instanceof Observable) {
      result.subscribe((value) => {
        expect(value).toBe(true);
        expect(guard.loadTranslations).toHaveBeenCalled();
        done();
      });
    } else {
      expect(result).toBe(true);
      expect(guard.loadTranslations).toHaveBeenCalled();
      done();
    }
  });
});
