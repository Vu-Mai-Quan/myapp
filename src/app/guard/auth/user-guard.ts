import { PLATFORM_ID, inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, retry, tap } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService), toast = inject(ToastrService), router = inject(Router), BR = inject<Object>(PLATFORM_ID), user = auth.userState();

  let info: string | null = null;
  let token: string | null = null;
  if (BR === 'browser') {
    info = localStorage?.getItem(auth.LOCAL_USER_INFO);
    token = sessionStorage?.getItem(auth.SESSION_ACCESS_TOKEN);
  }

  if ((user.userInfo || info?.trim() !== '') && (user.token || token)) {
    return true;
  }

  return auth.refreshTokensWhenTheyExpire().pipe(
    map((success) => success || router.createUrlTree(["home", "login"]))
  );
};
