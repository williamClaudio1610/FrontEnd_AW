import { TestBed } from '@angular/core/testing';

import { ActoClinicoServiceService } from './acto-clinico-service.service';

describe('ActoClinicoServiceService', () => {
  let service: ActoClinicoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActoClinicoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
