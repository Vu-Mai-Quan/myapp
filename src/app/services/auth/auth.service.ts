import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ENVIROMENT } from 'angular.dev';
import { ToastrService } from 'ngx-toastr';
import { Observable, finalize, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit{
  private readonly authURL = `${ENVIROMENT.baseUrl}auth/`;
   readonly LOCAL_USER_INFO: string = 'x-userInfo';
  private readonly _router = inject(Router)


  readonly userState = signal<UserState>({
    isLoading: false,
    userInfo: null
  })
  constructor(private readonly http: HttpClient, private readonly toastSv: ToastrService) { }

  ngOnInit() {
    console.log("auth lên");

  }

  login(loginDto: Login) {
    this.startLoading()
    this.http.post<LoginSuccess>(`${this.authURL}sign-in`, loginDto).subscribe(
      {
        next: val => { localStorage.setItem(this.LOCAL_USER_INFO, JSON.stringify(val.userInfo)); this.userState.set(({ isLoading: false, ...val })) },
        complete: () => {
          this.toastSv.success('Đăng nhập thành công', 'Success')
          this._router.navigate(['home', 'main-chat'])
        },
        error: ({ error: {title}}) => {
          console.error(title);
          this.stopLoading()
          this._router.navigate(['home', 'login'])
          this.toastSv.error(title, 'Error')
        }
      }
    );
  }

  startLoading() {
    this.userState.update(val => ({ ...val, isLoading: true }));
  }

  stopLoading() {
    this.userState.update(val => ({ ...val, isLoading: false }));
  }

  register(registerDto: SignUp) {
    this.startLoading();
    return this.http.post(`${this.authURL}sign-up`, registerDto);
  }

  refreshTokensWhenTheyExpire(): Observable<{
    token: string;
  }> {
    this.startLoading();
    return this.http.get<{ token: string }>(`${this.authURL}refresh-token`).pipe(
      shareReplay(1),
      finalize(()=>{
        this.stopLoading()
      })
    )
  }

  logout() {
   return this.http.patch(`${this.authURL}sign-out`, null).pipe(tap(val => {
      this.resetState()
    }));
  }

  resetState() {
    this.userState.set({ isLoading: false, userInfo: null, token: undefined })
    localStorage.removeItem(this.LOCAL_USER_INFO)
  }
}
