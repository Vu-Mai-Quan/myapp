import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { ENVIROMENT } from "angular.dev";
import { ToastrService } from "ngx-toastr";
import {
  Observable,
  catchError,
  finalize,
  map,
  of,
  retry,
  shareReplay,
  tap,
  throwError,
  timer,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService implements OnInit {
  private readonly authURL = `${ENVIROMENT.baseUrl}auth/`;
  readonly LOCAL_USER_INFO: string = "x-userInfo";
  readonly SESSION_ACCESS_TOKEN: string = "x-accessToken";
  private readonly _router = inject(Router);

  readonly userState = signal<UserState>({
    isLoading: false,
    userInfo: null,
    token: undefined,
  });
  constructor(
    private readonly http: HttpClient,
    private readonly toastSv: ToastrService,
  ) {
    // Không khôi phục token khi start để tăng bảo mật
  }

  ngOnInit() {
    console.log("auth lên");
  }

  login(loginDto: Login) {
    this.startLoading();
    this.http.post<LoginSuccess>(`${this.authURL}sign-in`, loginDto).subscribe({
      next: (val) => {
        localStorage.setItem(
          this.LOCAL_USER_INFO,
          JSON.stringify(val.userInfo),
        );
        sessionStorage.setItem(this.SESSION_ACCESS_TOKEN, val.token);
        this.userState.set({ isLoading: false, userInfo: val.userInfo, token: val.token });
      },
      complete: () => {
        this.toastSv.success("Đăng nhập thành công", "Success");
        this._router.navigate(["home", "main-chat"]);
      },
      error: ({ error: { title } }) => {
        console.error(title);
        this.stopLoading();
        this._router.navigate(["home", "login"]);
        this.toastSv.error(title, "Error");
      },
    });
  }

  startLoading() {
    this.userState.update((val) => ({ ...val, isLoading: true }));
  }

  stopLoading() {
    this.userState.update((val) => ({ ...val, isLoading: false }));
  }

  register(registerDto: SignUp) {
    this.startLoading();
    return this.http.post(`${this.authURL}sign-up`, registerDto);
  }

  refreshTokensWhenTheyExpire(): Observable<boolean> {
    this.startLoading();
    return this.http
      .get<{ token: string }>(`${this.authURL}refresh-token`)
      .pipe(
        retry({
          count: 2,
          delay(error, retryCount) {
            console.log(retryCount);
            if (error.status === 401) return timer(300);
            return throwError(() => error);
          },
        }),
        shareReplay(1),
        tap((data) => {
          sessionStorage.setItem(this.SESSION_ACCESS_TOKEN, data.token);
          this.userState.update((pre) => ({ ...pre, token: data.token }));
        }),
        map(() => true),
        catchError((e) => {
          console.error('Refresh token failed', e);
          return of(false);
        }),
        finalize(() => {
          this.stopLoading();
        }),
      );
  }

  logout() {
    return this.http.patch(`${this.authURL}sign-out`, null).pipe(
      tap((val) => {
        debugger;
        this.resetState();
      }),
    );
  }

  resetState() {
    this.userState.set({ isLoading: false, userInfo: null, token: undefined });
    localStorage.removeItem(this.LOCAL_USER_INFO);
    sessionStorage.removeItem(this.SESSION_ACCESS_TOKEN);
  }
}
