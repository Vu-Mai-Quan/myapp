import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


@NgModule({
  
  imports: [
    CommonModule, FormsModule,
    HttpClientModule,
    NgOptimizedImage,
  ],
  exports: [CommonModule, FormsModule,
    HttpClientModule, NgOptimizedImage]
})
export class CommonModuleShare { }
