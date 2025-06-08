import { CanActivateFn } from '@angular/router';

export const utenteGuard: CanActivateFn = (route, state) => {
  return true;
};
