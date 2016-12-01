import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CustomHttpService, GlobalLoadingService, GroupService, PanelService } from './services';
import { COMPONENTS } from './components';
import { DIRECTIVES } from './directives';
import { PAGES } from './pages';
import { AppRouts } from './app.routes';
import { MonitorApp } from './app';

let useHash = true;
if (process.env.ENV === 'production') {
  useHash = false;
}

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRouts, { useHash: useHash })
  ],
  declarations: [
    ...PAGES,
    ...COMPONENTS,
    ...DIRECTIVES,
    MonitorApp
  ],
  providers: [
    CustomHttpService,
    GlobalLoadingService,
    GroupService,
    PanelService
  ],
  bootstrap: [MonitorApp]
})
export class AppModule { }
