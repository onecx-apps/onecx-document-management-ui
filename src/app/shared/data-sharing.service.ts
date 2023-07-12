// Core imports
import { Injectable } from '@angular/core';

// Application imports
import { DocumentDetailDTO } from '../generated';

@Injectable({
  providedIn: 'root',
})
export class DataSharingService {
  specialChar = ' \\ / : * ? " < > |';
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
  /**
   *
   * @returns filtered results for current logged in user
   */
  getCreatedByMe(loggedUserName: any) {
    const searchedResults = this.getSearchResults();
    const results = searchedResults.filter((item) => {
      if (item.creationUser == loggedUserName) {
        return item;
      }
    });
    return results;
  }
  /**
   *
   * @returns filtered results for recently updated based on time(24 hours)
   */
  getRecentlyUpdated() {
    const searchedResults = this.getSearchResults();
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
    const results = searchedResults.filter((item) => {
      const itemDate = new Date(item.modificationDate);
      return itemDate >= twentyFourHoursAgo;
    });
    return results;
  }
}
