import { TestBed } from '@angular/core/testing';

import { CanceledService } from './canceled.service';

describe('CanceledService', () => {
  let service: CanceledService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CanceledService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
