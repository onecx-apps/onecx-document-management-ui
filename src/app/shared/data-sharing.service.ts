// Core imports
import { Injectable } from '@angular/core';

// Application imports
import { DocumentDetailDTO } from '../generated';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  searchResults: DocumentDetailDTO[];
  selectedModification = '';
  selectUpdated = [];
  /**
   * set the search results
   * @param results
   */
  setSearchResults(results) {
    this.searchResults = results;
  }
  /**
   * @returns search results
   */
  getSearchResults() {
    return this.searchResults;
  }
  /**
   * @returns selected choose documents from bulk changes
   */
  getModification() {
    return this.selectedModification;
  }
  /**
   * sets the selected documents from bulk changes
   * @param val
   */
  setModification(val) {
    this.selectedModification = val;
  }
  /**
   * sets updated checked field for bulk update edit checkboxes
   * @param updatedValue
   */
  setUpdateModification(updatedValue) {
    this.selectUpdated = updatedValue;
  }
  /**
   *
   * @returns selected checkbox field to show in bulk update edit form
   */
  getUpdateModification() {
    return this.selectUpdated;
  }
}
