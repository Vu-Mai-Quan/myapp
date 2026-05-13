import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {
  constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.userState().token;
    const clonedReq = token ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }) : req;

    return next.handle(clonedReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.authService.refreshTokensWhenTheyExpire().pipe(
            switchMap((success) => {
              if (success) {
                const newToken = this.authService.userState().token;
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(retryReq);
              } else {
                return throwError(() => error);
              }
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
