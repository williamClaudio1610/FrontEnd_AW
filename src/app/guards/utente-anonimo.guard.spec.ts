import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { utenteAnonimoGuard } from './utente-anonimo.guard';

describe('utenteAnonimoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => utenteAnonimoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
