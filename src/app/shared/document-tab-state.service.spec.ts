import { TestBed } from '@angular/core/testing';

import { DocumentTabStateService } from './document-tab-state.service';

describe('DocumentTabStateService', () => {
  let service: DocumentTabStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentTabStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
