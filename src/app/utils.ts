import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Column, MfeInfo } from '@onecx/portal-integration-angular';
import { Table } from 'primeng/table';

export function toSafeUrl(url: string) {
  return url.replace(/(?<!:)\/\/+/g, '/');
}

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
  console.log(`Base path provider ${mfeInfo?.remoteBaseUrl}`);
  return mfeInfo
    ? mfeInfo.remoteBaseUrl + 'tkit-document-management-api'
    : '.tkit-document-management-api';
};
export interface FilteredColumns {
  columns: Column[];
  filteredColumns: Column[];
}

export function initFilteredColumns(columns: Column[]): Column[] {
  const temp = [];
  columns.forEach((column) => {
    if (column.active) {
      temp.push(column);
    }
  });
  return temp;
}

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

  if (obj.length > 1) {
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
