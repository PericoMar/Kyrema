import { TestBed } from '@angular/core/testing';

import { PlizasService } from './plizas.service';

describe('PlizasService', () => {
  let service: PlizasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlizasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
