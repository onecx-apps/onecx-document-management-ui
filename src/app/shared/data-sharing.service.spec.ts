import { TestBed } from '@angular/core/testing';
import { DataSharingService } from './data-sharing.service';

describe('DataSharingService', () => {
  let service: DataSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get updated modification correctly', () => {
    const updatedValue = [1, 2, 3];
    service.setUpdateModification(updatedValue);
    const retrievedUpdatedValue = service.getUpdateModification();
    expect(retrievedUpdatedValue).toEqual(updatedValue);
  });
});
