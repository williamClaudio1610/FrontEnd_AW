import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { utenteGuard } from './utente.guard';

describe('utenteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => utenteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
