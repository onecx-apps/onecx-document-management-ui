import { Injectable } from '@angular/core';

@Injectable()
export class IAuthMockService {
  public hasPermission() {
    return true;
  }
}
