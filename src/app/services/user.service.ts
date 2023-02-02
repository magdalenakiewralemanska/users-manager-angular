import { Injectable } from '@angular/core';
import { environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private localhost = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public saveUser(formData: FormData): Observable<User | HttpErrorResponse>{
    return this.http.post<User>(`${this.localhost}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse>{
    return this.http.post<User>(`${this.localhost}/user/update`, formData);
  }

  public getAllUsers(): Observable<User[] | HttpErrorResponse>{
    return this.http.get<User[]>(`${this.localhost}/user/list`);
  }

  public deleteUser(id: number): Observable<any | HttpErrorResponse>{
    return this.http.delete<any>(`${this.localhost}/user/delete/${id}`);
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
