import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@service/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-main-chat',
  standalone: true,
  imports: [],
  templateUrl: './main-chat.component.html',
  styleUrl: './main-chat.component.css'
})
export class MainChatComponent {
private readonly AUTH= inject(AuthService)

private readonly ROUTER = inject(Router)

private readonly http = inject(HttpClient)

signOut(){
  this.AUTH.logout().subscribe({
    next:()=>{
      this.ROUTER.navigate(['home','login'])
    },error:(e)=>{
      console.log(e.error);
      this.ROUTER.navigate(['home', 'login'])
    }
  });
}

ngOnInit(): void {
  this.http.get('http://localhost:8080/api/auth/refresh-token').pipe(
    finalize(() => console.log('Request completed'))
  ).subscribe({
    next: (res) => console.log(res),
    error: (e) => console.log(e.error)
  });
}
}
