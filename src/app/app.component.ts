
import { Component, OnInit, inject } from '@angular/core';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatInput } from '@angular/material/input';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  animations: [

  ]
})
export class AppComponent implements OnInit {
  title = 'To Do App Angular';
  Title: Title = inject(Title);
  ngOnInit(): void {
    console.log();

    this.Title.setTitle(this.title);

  }
}
