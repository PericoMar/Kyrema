import { TestBed } from '@angular/core/testing';

import { SocietyNotificationService } from './society-notification.service';

describe('SocietyNotificationService', () => {
  let service: SocietyNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocietyNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
