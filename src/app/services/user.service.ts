import { Injectable } from '@angular/core';
import { environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {HttpResponseData} from "../model/http-response-data";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private localhost = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public saveUser(user: User): Observable<User | HttpErrorResponse>{
    return this.http.post<User>(`${this.localhost}/user/add`, user);
  }

  public updateUser(user: User): Observable<User | HttpErrorResponse>{
    return this.http.post<User>(`${this.localhost}/user/update`, user);
  }

  public getAllUsers(): Observable<User[] | HttpErrorResponse>{
    return this.http.get<User[]>(`${this.localhost}/user/list`);
  }

  public deleteUser(id: number): Observable<HttpResponseData | HttpErrorResponse>{
    return this.http.delete<HttpResponseData>(`${this.localhost}/user/delete/${id}`);
  }

  public addUsersToCache(users: User[]): void{
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromCache(): User[]{
    if(localStorage.getItem('users')){
      return JSON.parse(localStorage.getItem('users'));
    }
    return null;
  }

}
