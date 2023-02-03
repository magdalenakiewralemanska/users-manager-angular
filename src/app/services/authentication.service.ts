import { Injectable } from '@angular/core';
import { environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {JwtHelperService} from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public localhost = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private tokenHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<HttpResponse<any> | HttpErrorResponse>{
    return this.http.post<HttpResponse<any> | HttpErrorResponse>
    (`${this.localhost}/user/login`, user, {observe: 'response'});
  }

  public register(user: User): Observable<User | HttpErrorResponse>{
    return this.http.post<User | HttpErrorResponse>(`${this.localhost}/user/register`, user);
  }

  public logout(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public addUserToCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUserFromCache(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  public loadTokenFromLocalStorage(): void {
    this.token = localStorage.getItem('token');
  }

  public getToken(): string {
    return this.token;
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  public isUserLoggedIn(): boolean {
    this.loadTokenFromLocalStorage();
    if(this.token != null && this.token !== ''){
      if(this.tokenHelper.decodeToken(this.token).sub != null || ''){
        if(this.tokenHelper.isTokenExpired(this.token)){
          this.loggedInUsername = this.tokenHelper.decodeToken(this.token).sub;
        }
      }
    } else {
      this.logout();
      return  false;
    }
    return true;
  }
}
