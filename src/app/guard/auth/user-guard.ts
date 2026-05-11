import { PLATFORM_ID, inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of, retry, tap } from 'rxjs';

export const userGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService), toast = inject(ToastrService), router = inject(Router), BR = inject<Object>(PLATFORM_ID), user = auth.userState();

  let info: string | null = null;
  if (BR === 'browser') {
    info = localStorage?.getItem(auth.LOCAL_USER_INFO);

  }

  if ((user.userInfo || info?.trim() !== '') && user.token) {
    return true;
  }


  return auth.refreshTokensWhenTheyExpire().pipe(
    retry({ count: 2, delay: 300 }),
    tap(({ token }) => auth.userState.update(val => ({ ...val, token }))),
    map(() => true),
    catchError((e) => {
      if (BR === 'browser') toast.error('Phiên đăng nhập đã hết hạn vui lòng đăng nhập lại', '')
      return of(router.createUrlTree(['home', 'login']))
    }),

  );
};
