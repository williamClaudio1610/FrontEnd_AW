import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { dminRoleGuard } from './admin-role.guard';

describe('adminRoleGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminRoleGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
