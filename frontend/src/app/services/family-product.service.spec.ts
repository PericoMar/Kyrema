import { TestBed } from '@angular/core/testing';

import { FamilyProductService } from './family-product.service';

describe('FamilyProductService', () => {
  let service: FamilyProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
