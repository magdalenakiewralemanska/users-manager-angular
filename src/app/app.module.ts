import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthenticationService} from "./services/authentication.service";
import {UserService} from "./services/user.service";
import {AuthenticationRequestInterceptor} from "./interceptor/authentication-request.interceptor";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import {FormsModule} from "@angular/forms";
import {NotificationModule} from "./notification.module";
import {NotificationService} from "./services/notification.service";
import {AuthenticationGuard} from "./guard/authentication.guard";
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotificationModule
  ],

  providers: [AuthenticationGuard, NotificationService, AuthenticationService, UserService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationRequestInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
