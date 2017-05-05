import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { PAGES } from './pages';
import { AppRouting } from './app.routes';
import { SimpleMonitorApp } from './app';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CommonModule,
    AppRouting
  ],
  declarations: [
    SimpleMonitorApp,
    ...PAGES
  ],
  bootstrap: [
    SimpleMonitorApp
  ]
})
export class AppModule { }