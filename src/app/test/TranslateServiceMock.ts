import { Observable, of } from 'rxjs';
import { EventEmitter } from '@angular/core';

export class TranslateServiceMock {
  public onLangChange: EventEmitter<any> = new EventEmitter();
  public onTranslationChange: EventEmitter<any> = new EventEmitter();
  public onDefaultLangChange: EventEmitter<any> = new EventEmitter();

  public get(value: any): Observable<string | any> {
    return of(value);
  }
  public instant(value: string) {
    return value;
  }
}
