import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DocumentDetailDTO } from '../generated';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  searchResults: DocumentDetailDTO[];
  selectedModification = '';
  constructor() {}

  setSearchResults(results) {
    this.searchResults = results;
  }

  getSearchResults() {
    return this.searchResults;
  }

  getModification() {
    return this.selectedModification;
  }

  setModification(val) {
    this.selectedModification = val;
  }
}
