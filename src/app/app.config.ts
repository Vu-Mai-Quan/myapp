import { HttpClient, HttpInterceptor, HttpInterceptorFn, HttpResponse, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { map, tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { routes } from './app.routes';
import { enviroment } from 'angular.prod';



const bearerInteceptor: HttpInterceptorFn = (rq, next)=> {
  // 🔵 XỬ LÝ REQUEST
  
  const http = inject(HttpClient);
  let token = localStorage.getItem('token');
  if(token) {
    rq = rq.clone({
      headers: rq.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  // 🟢 XỬ LÝ RESPONSE
  return next(rq).pipe(
    tap(event => {
      if (event instanceof HttpResponse && event.status == 404) {
        http.get(`${enviroment.baseUrl}auth/refresh-token`, { withCredentials: true }).pipe(
          tap(val=>{
            
          })
        ).subscribe({
          next:(val)=>{
            
          },
          complete:()=>{}
        })
      }
    }),
    map(event => {
      if (event instanceof HttpResponse) {
        // Transform dữ liệu response nếu cần
        return event;
      }
      return event;
    }),
    catchError(error => {
      console.error('✗ Lỗi response:', error);
      return throwError(() => error);
    })
  );
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimations(), provideHttpClient(withFetch(), withInterceptors([bearerInteceptor])), provideAnimationsAsync()]
};

