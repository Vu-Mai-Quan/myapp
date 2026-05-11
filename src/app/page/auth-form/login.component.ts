import { NgIf } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatError, MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";
import { AuthService } from '@service/auth/auth.service';
import { error } from 'console';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

type validatorError = 'email' | 'required' | 'mismatch' | 'maxlength' | 'minlength'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, NgIf, MatFormField, MatIconModule, MatInput, MatLabel, MatButtonModule, ReactiveFormsModule, MatSuffix, MatError],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class AuthFormComponent {
  private readonly AUTH = inject(AuthService)
  private readonly fb = inject(FormBuilder);
  private readonly _TOAST = inject(ToastrService)
  isLogin = true;

  showPassword = signal({
    password: false,
    retype: false
  })

  changeShowPassword(type: 'password' | 'retype') {
    this.showPassword.update(val => {
      return type == 'password' ? { ...val, password: !val.password } : { ...val, retype: !val.retype };
    })
  }

  retypePassword = (form: AbstractControl): ValidationErrors | null => {
    const password = form.get('password')?.value;
    const retype = form.get('retypePassword')?.value;
    if (password === retype && (password && retype)) return null
    form.get('retypePassword')?.setErrors({
      mismatch: "Mật khẩu không trùng khớp"
    })
    return { mismatch: "Mật khẩu không trùng khớp" };
  };
  loginForm = {
    'email': ['', Validators.compose([
      Validators.email,
      Validators.required
    ])],
    'password': ['123456', Validators.compose([
      Validators.minLength(6),
      Validators.maxLength(10),
      Validators.required
    ])]
  };
  registerForm = {
    "email": this.loginForm.email,
    firstName: ['', Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(5),
      Validators.required
    ])],
    lastName: ['', Validators.compose([
      Validators.minLength(3),
      Validators.maxLength(10),
      Validators.required
    ])],
    retypePasswordGr: this.fb.group({
      password: this.loginForm.password,
      retypePassword: ['123456']
    }, {
      validators: this.retypePassword
    }),

  }

  messageError = {
    email: {
      notNull: 'Email không được để trống',
      error: 'Email không hợp lệ'
    },
    password: {
      notNull: 'Password không được để trống',
      error: 'Password phải từ 6-10 kí tự'
    },
    firstName: {
      notNull: 'FirstName không được để trống',
      error: 'FirstName không hợp lệ'
    },
    lastName: {
      notNull: 'LastName không được để trống',
      error: 'LastName không hợp lệ'
    }
  }

  login = this.fb.group(this.loginForm)

  register = this.fb.group(this.registerForm)

  ngOnInit() {

  }

  getPopularError(field: AbstractControl | null) {
    if (!field || !field.touched || !field.dirty) return null;
    return true
  }

  getErrorValidator(field: AbstractControl | null | undefined, hasE: validatorError) {
    const cond = (!field || field.touched || field.dirty) && field?.hasError(hasE)
    if (cond) {
      return field?.hasError(hasE);
    }
    return null;
  }
  submitLogin(event: Event) {
    event.preventDefault()
    if (this.login.valid) {
      debugger
      this.AUTH.login(this.login.value as Login)
    } else {
      console.log('Form is invalid');
    }
  }

  submitRegister(event: MouseEvent) {

    if (this.register.valid) {

      const { firstName, lastName, email, retypePasswordGr: { password } = { password: null } } = this.register.value,
        data = ({ email, password, firstName, lastName,});

      this.AUTH.register((data as SignUp)).pipe(finalize(()=>{
        this.AUTH.stopLoading()
      })).subscribe({
        next:(val)=>{
          this.isLogin = true
          this._TOAST.success('Đăng kí thành công')
        },
        error:({error})=>{
          console.log(error);
          if(error.errors){
            for (let key in error.errors){
              this._TOAST.error(error.errors[key]);
            }
          }else
          this._TOAST.error(error.title);
        }
      })
    }


  }
}
