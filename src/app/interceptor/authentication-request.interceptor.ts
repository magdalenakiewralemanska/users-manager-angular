import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from "../services/authentication.service";

@Injectable()
export class AuthenticationRequestInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, httpHandler :HttpHandler): Observable<HttpEvent<any>> {
    if(request.url.includes(`${this.authenticationService.localhost}/user/login`)){
      return httpHandler.handle(request);
    }
    if(request.url.includes(`${this.authenticationService.localhost}/user/register`)){
      return httpHandler.handle(request);
    }
    this.authenticationService.loadTokenFromLocalStorage();
    const token = this.authenticationService.getToken();
    const currentRequest = request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
    return httpHandler.handle(currentRequest);
  }


}
