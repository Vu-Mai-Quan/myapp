import { HttpEvent, HttpHandlerFn, HttpRequest, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, PLATFORM_ID, inject } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { provideToastr } from 'ngx-toastr';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { routes } from './app.routes';
import { ENVIROMENT } from 'angular.dev';
const ignoreUrls = [`${ENVIROMENT.baseUrl}auth/refresh`, `${ENVIROMENT.baseUrl}auth/sign-in`, `${ENVIROMENT.baseUrl}auth/register`];

const bearerInteceptor = (rq: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(AuthService), id = inject(PLATFORM_ID);
  let token: string | null | undefined = tokenService.userState()?.token;
  if(id === 'browser' && !token) {
   token= sessionStorage?.getItem(tokenService.SESSION_ACCESS_TOKEN);
  }
  const headers = token ? rq.headers.append('Authorization', `Bearer ${token}`) : rq.headers;
  const clonedReq = rq.clone({
    headers,
    withCredentials: true
  });
  if(ignoreUrls.some(url => rq.url.includes(url))) {
    return next(rq.clone({
      withCredentials: true
    }));
  }
  return next(clonedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        return tokenService.refreshTokensWhenTheyExpire().pipe(
          switchMap((success) => {
            if (success) {
              const newToken = tokenService.userState().token;
              const retryReq = rq.clone({
                headers: rq.headers.append('Authorization', `Bearer ${newToken}`),
                withCredentials: true
              });
              return next(retryReq);
            } else {
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimations(), provideToastr({
    closeButton: true,
    timeOut: 3000,
    maxOpened: 5,
    positionClass: 'toast-top-right',
    tapToDismiss: true
  }), provideHttpClient(withFetch(), withInterceptors([bearerInteceptor])),
  provideAnimationsAsync(),]
};

// function refreshTokenInteceptor(): HttpInterceptorFn {

//   return (rq: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
//     const authService = inject(AuthService);
//     const _toast = inject(ToastrService);
//     const _router = inject(Router);

//     return next(rq).pipe(
//       catchError((e) => {
//         if (e instanceof HttpErrorResponse && e.status == 401) {
//           debugger
//           authService.refreshTokensWhenTheyExpire().pipe(retry({
//             count: 3,
//             delay: 1000,
//           }),).subscribe({
//             next(resp) {
//               authService.userState.update(val => ({ ...val, resp }))
//             }, error(e) {
//               _toast.error('Hết phiên đăng nhập vui lòng đăng nhập lại', 'Error');
//               _router.navigate(['home', 'login'])
//             }
//           })
//           return next(rq);
//         }
//         return throwError(() => e);
//       }),

//     );
//   };
// }

