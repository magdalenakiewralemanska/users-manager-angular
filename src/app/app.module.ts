import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthenticationService} from "./services/authentication.service";
import {UserService} from "./services/user.service";
import {AuthenticationRequestInterceptor} from "./interceptor/authentication-request.interceptor";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthenticationService, UserService, {provide: HTTP_INTERCEPTORS, useClass: AuthenticationRequestInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
