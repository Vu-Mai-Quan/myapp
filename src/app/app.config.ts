import { HttpEvent, HttpHandlerFn, HttpRequest, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { AuthService } from 'app/services/auth/auth.service';
import { Observable } from 'rxjs';
import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';


const bearerInteceptor = (rq: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(AuthService);
  if (tokenService.userState()?.token) {
    const headers = rq.headers.append('Authorization', `Bearer ${tokenService.userState().token}`);
    return next(rq.clone({
      headers,
      withCredentials: true
    }));
  } else return next(rq.clone({
    withCredentials: true
  }));

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

