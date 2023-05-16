import { Injectable } from '@angular/core';

@Injectable()
export class IAuthMockService {
  constructor() {}
  public hasPermission() {
    return true;
  }
}
