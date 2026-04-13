import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormField, MatLabel, MatPrefix, MatSuffix } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInput } from "@angular/material/input";



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, NgIf, MatFormField, MatIconModule, MatInput, MatLabel, MatButtonModule, ReactiveFormsModule, MatSuffix, MatPrefix],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ]
})
export class AuthFormComponent {
  isLogin = true;
  showPassword = false;
  showRetypePassword = false;
  retypePassword: ValidationErrors = (ab: FormGroup) => {
    console.log(ab);
    
    if (ab.get('password')?.value != ab.get('retypePassword')?.value) {
      console.log(ab.get('password')?.value, ab.get('retypePassword')?.value);
      return {
        error: true
      }
    }
    return null;
  }
  loginForm = {
    'email': ['kjasdka', Validators.compose([
      Validators.email
    ])],
    'password': ['kadska', Validators.compose([
      Validators.minLength(6),
      Validators.maxLength(10)
    ])]
  };
  regsterForm = {
   ...this.loginForm,
   fistName:['', Validators.compose([
     Validators.minLength(3),
     Validators.minLength(5),

   ])],
    lastName: ['', Validators.compose([
      Validators.minLength(3),
      Validators.minLength(10),
    ])],
    retypePassword:['',this.retypePassword],
    
  }

  messageError= {
    email:'Email không hợp lệ',
    password:'',
    fistName:'',
    lastName:''
  }
  private readonly fb = inject(FormBuilder);
  login = this.fb.group(this.loginForm)
  register = this.fb.group(this.regsterForm,{
    validators: this.retypePassword
  })
  ngOnInit() {

  }
  

  submitLogin() {
    if (this.login.valid) {
      console.log('Login values:', this.login.value);
      // TODO: Call API service to login
    } else {
      console.log('Form is invalid');
    }
  }

  submitRegister() {
    if (this.register.valid) {
      console.log('Register values:', this.register.value);
      // TODO: Call API service to register
    } else {
      console.log('Form is invalid');
    }
  }
}
