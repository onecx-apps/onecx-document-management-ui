// Core imports
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentTabStateService {
  private activeCurrentTab: number;
  private editMode: boolean;

  public saveactiveCurrentTab(activeCurrentTab: number): void {
    this.activeCurrentTab = activeCurrentTab;
  }
}
