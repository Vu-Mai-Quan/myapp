
import { AfterViewInit, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { AuthService } from '@service/auth/auth.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBar, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [

  ],
  providers: [

  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    // this.AUTH.startLoading()
    // var idTimeOut = setTimeout(() => { this.AUTH.stopLoading() }, 5000)
    // this.destroy.onDestroy(() => {
    //   clearTimeout(idTimeOut);
    // })
  }
  title = 'To Do App Angular';
  Title: Title = inject(Title);
  protected readonly AUTH = inject(AuthService)
  private readonly destroy = inject(DestroyRef)
  ngOnInit(): void {


    this.Title.setTitle(this.title);
    
   

  }
}
