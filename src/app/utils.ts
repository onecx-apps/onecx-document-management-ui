// Core imports
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ValidationErrors } from '@angular/forms';

// Third party imports
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {
  Column,
  MfeInfo,
  UserService,
} from '@onecx/portal-integration-angular';
import { environment } from 'src/environments/environment';

/**
 * @param url
 * @returns standard format of url
 */
export function toSafeUrl(url: string) {
  return url.replace(/(?<!:)\/\/+/g, '/');
}
/**
 * @param http
 * @param mfeInfo
 * @returns translated json
 */
export function createTranslateLoader(http: HttpClient, mfeInfo: MfeInfo) {
  console.log(
    `******************** cofiguring translate loader ${mfeInfo?.remoteBaseUrl}`
  );
  //TODO notes: this way you can load the data from remote server
  if (mfeInfo && mfeInfo.remoteBaseUrl) {
    return new TranslateHttpLoader(
      http,
      toSafeUrl(`${mfeInfo.remoteBaseUrl}/assets/i18n/`),
      '.json'
    );
  } else {
    return new TranslateHttpLoader(http, `./assets/i18n/`, '.json');
  }
}

export const basePathProvider = (mfeInfo: MfeInfo) => {
  console.log(`Base path provider ${environment?.API_BASE_PATH}`);
  return mfeInfo
    ? mfeInfo.remoteBaseUrl + 'onecx-document-management-api'
    : '.onecx-document-management-api';
};
/**
 * filter columns for table view
 */
export interface FilteredColumns {
  columns: Column[];
  filteredColumns: Column[];
}
/**
 * @param columns
 * @returns initialize temp column on toggle functionality for table view
 */
export function initFilteredColumns(columns: Column[]): Column[] {
  const temp = [];
  columns.forEach((column) => {
    if (column.active) {
      temp.push(column);
    }
  });
  return temp;
}
/**
 * @param activeColumnIds
 * @param columns
 * @returns filtered columns for table view for toogle functionality
 */
export function generateFilteredColumns(
  activeColumnIds: string[],
  columns: Column[]
): FilteredColumns {
  const filteredColumns = [];

  // Iterate over activeColumnIds
  for (const colId of activeColumnIds) {
    console.log('Active ', colId);
    // Find column with activeId, set it to active, overwrite the old column and push the column to temp
    const matchingCols = columns.filter((column) => column.field === colId);
    if (matchingCols.length > 0) {
      const matchingCol = matchingCols[0];
      const matchingColIndex = columns.indexOf(matchingCol);
      matchingCol.active = true;
      columns[matchingColIndex].active = true;
      filteredColumns.push(matchingCol);
    }
  }
  // Iterate over columns
  for (const column of columns) {
    // Deactivate every column that is not marked active in activeColumnIds
    if (!activeColumnIds.includes(column.field)) {
      column.active = false;
    }
  }

  // Return an object containing all the columns with their correct active state assigned to them (columns) and only the filtered/currently active columns (filteredColumns)
  return {
    columns,
    filteredColumns,
  };
}
/**
 * @param obj
 * @param headerList
 * @returns csv format object to store data in csv file
 */
export function convertToCSV(obj, headerList) {
  let array = [];
  let str = '';
  let row = '';

  for (let index in headerList) {
    let result = headerList[index].replace(/([A-Z])/g, ' $1');
    let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    row += finalResult + ',';
  }
  row = row.slice(0, -1);
  str += row + '\r\n';

  if (obj.length >= 1) {
    for (let i = 0; i < obj.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];
        if (typeof obj[i][head] === 'string') {
          if (obj[i][head].includes('\n'))
            obj[i][head] = obj[i][head].replaceAll('\n', ' ');
          if (obj[i][head].includes('"'))
            obj[i][head] = obj[i][head].replaceAll('"', "'");
          obj[i][head] = JSON.stringify(obj[i][head]);
        }
        line += obj[i][head] + ',';
      }
      str += line + '\r\n';
    }
    return str;
  } else {
    array.push(obj);
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];

        if (typeof array[i][head] === 'string') {
          if (array[i][head].includes('\n'))
            array[i][head] = array[i][head].replaceAll('\n', ' ');
          if (array[i][head].includes('"'))
            array[i][head] = array[i][head].replaceAll('"', "'");
          array[i][head] = JSON.stringify(array[i][head]);
        }
        line += array[i][head] + ',';
      }
      str += line + '\r\n';
    }
    return str;
  }
}
/**
 * @param event
 * @param controlName
 * @param form
 * @param maxlength
 * @returns trim value which removes empty space from starting position
 */
export function trimSpaces(
  event: ClipboardEvent,
  controlName: string,
  form: any,
  maxlength?: number
) {
  let fieldVal = form.controls[controlName].value;
  if (fieldVal == '' || fieldVal == null) fieldVal = '';
  if (event.clipboardData.getData('text').startsWith(' ')) {
    let pasteVal = event.clipboardData.getData('text').trim();
    let value = fieldVal + pasteVal.split('\n').join('');
    event.preventDefault();
    if (maxlength) {
      value = value.substring(0, maxlength);
    }
    form.controls[controlName].setValue(value);
  }
  return form;
}
/**
 * @param control
 * validate special characters : / \ : * ? < > | "  in the form filed
 */
export function noSpecialCharacters(
  control: AbstractControl
): ValidationErrors | null {
  const pattern = /[\\/:*?<>|"]/;
  if (pattern.test(control.value)) return { hasSpecialChars: true };
}

/**
 * @param userService - The `UserService` instance that provides the user's language preference observable (`lang$`).
 * @returns A promise that resolves to the best matching language as a string, which will be either 'en', 'de', or the default 'en'.
 */
export function getBestMatchLanguage(userService: UserService): string {
  let langMatched: string;
  userService.lang$.subscribe((lang) => {
    if (lang === 'en' || lang === 'de') {
      langMatched = lang;
    } else {
      langMatched = 'en';
    }
  });
  return langMatched;
}
