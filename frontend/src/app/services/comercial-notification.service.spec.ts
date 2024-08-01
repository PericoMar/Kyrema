import { TestBed } from '@angular/core/testing';

import { ComercialNotificationService } from './comercial-notification.service';

describe('ComercialNotificationService', () => {
  let service: ComercialNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComercialNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
