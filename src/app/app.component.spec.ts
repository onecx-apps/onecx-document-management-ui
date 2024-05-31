/* eslint-disable @typescript-eslint/no-floating-promises */
import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { basePathProvider, convertToCSV, createTranslateLoader } from './utils';
import { HttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let httpMock: HttpClient;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();
    httpMock = jasmine.createSpyObj('HttpClient', ['get']);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have as title 'onecx-document-management-ui'", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('onecx-document-management-ui');
  });
  it('should return a TranslateHttpLoader with remote base URL when mfeInfo is provided', () => {
    const mfeInfo = null;
    const expectedUrl = './assets/i18n/';

    const result = createTranslateLoader(httpMock, mfeInfo);

    expect(result).toBeDefined();
    expect(result['prefix']).toBe(expectedUrl);
    expect(result['suffix']).toBe('.json');
  });

  it('should return a TranslateHttpLoader with default base URL when mfeInfo is not provided', () => {
    const mfeInfo = null;
    const expectedUrl = './assets/i18n/';

    const result = createTranslateLoader(httpMock, mfeInfo);

    expect(result).toBeDefined();
    expect(result['prefix']).toBe(expectedUrl);
    expect(result['suffix']).toBe('.json');
  });

  describe('basePathProvider', () => {
    it('should return the base path with remote base URL when mfeInfo is provided', () => {
      const mfeInfo = null;
      const expectedPath = '.onecx-document-management-api';

      const result = basePathProvider(mfeInfo);

      expect(result).toBe(expectedPath);
    });
  });

  describe('convertToCSV', () => {
    it('should convert the object array to CSV format with proper headers and values', () => {
      const obj = [
        { id: 1, name: 'John Doe', age: 25 },
        { id: 2, name: 'Jane Smith', age: 30 },
      ];
      const headerList = ['id', 'name', 'age'];
      const expectedCSV =
        'Id,Name,Age\r\n' + '1,"John Doe",25,\r\n' + '2,"Jane Smith",30,\r\n';

      const result = convertToCSV(obj, headerList);

      expect(result).toBe(expectedCSV);
    });
  });

  it('should convert the single object to CSV format with proper headers and values', () => {
    const obj = { id: 1, name: 'John Doe', age: 25 };
    const headerList = ['id', 'name', 'age'];
    const expectedCSV = 'Id,Name,Age\r\n' + '1,"John Doe",25,\r\n';

    const result = convertToCSV(obj, headerList);

    expect(result).toBe(expectedCSV);
  });

  it('should handle string values with newline and double quotes correctly', () => {
    const obj = [
      { id: 1, name: 'John\nDoe', description: 'Multi-line\nvalue' },
      { id: 2, name: 'Jane\nSmith', description: 'Contains "quotes"' },
    ];
    const headerList = ['id', 'name', 'description'];
    const expectedCSV =
      'Id,Name,Description\r\n' +
      '1,"John Doe","Multi-line value",\r\n' +
      '2,"Jane Smith","Contains \'quotes\'",\r\n';

    const result = convertToCSV(obj, headerList);

    expect(result).toBe(expectedCSV);
  });
});
