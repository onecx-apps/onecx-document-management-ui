import { TestBed } from '@angular/core/testing';
import { ApiModule } from '../generated/api.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Configuration } from './configuration';

describe('ApiModule', () => {
  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ApiModule],
    });
    httpClient = TestBed.inject(HttpClient);
  });

  it('should return the correct module with configuration factory', () => {
    const configurationFactory = () => new Configuration();
    const result = ApiModule.forRoot(configurationFactory);
    expect(result.ngModule).toBe(ApiModule);
    expect(result.providers).toEqual([
      { provide: Configuration, useFactory: configurationFactory },
    ]);
  });

  it('should throw an error if ApiModule is already loaded', () => {
    const parentModule = new ApiModule(null, httpClient);
    expect(() => new ApiModule(parentModule, httpClient)).toThrowError(
      'ApiModule is already loaded. Import in your base AppModule only.'
    );
  });

  it('should throw an error if HttpClientModule is not imported', () => {
    expect(() => new ApiModule(null, null)).toThrowError(
      'You need to import the HttpClientModule in your AppModule! \n' +
        'See also https://github.com/angular/angular/issues/20575'
    );
  });
});
