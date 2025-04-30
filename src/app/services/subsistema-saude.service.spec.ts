import { TestBed } from '@angular/core/testing';

import { SubsistemaSaudeService } from './subsistema-saude.service';

describe('SubsistemaSaudeService', () => {
  let service: SubsistemaSaudeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubsistemaSaudeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
