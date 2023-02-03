import { Injectable } from '@angular/core';
import { environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../model/user";
import {HttpResponse} from "../model/http-response";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private localhost = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public createFormData(loggedInUsername: string, user: User): FormData {
    const formData = new FormData();
    formData.append('currentUserName', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNonLocked', JSON.stringify(user.isNonLocked));
    formData.append('role', user.rolePermissions);
    return formData;
  }

  public saveUser(formData: FormData): Observable<User | HttpErrorResponse>{
    return this.http.post<User>(`${this.localhost}/user/add`, formData);
  }

  public updateUser(formData: FormData): Observable<User | HttpErrorResponse>{
    return this.http.post<User>(`${this.localhost}/user/update`, formData);
  }

  public getAllUsers(): Observable<User[] | HttpErrorResponse>{
    return this.http.get<User[]>(`${this.localhost}/user/list`);
  }

  public deleteUser(id: number): Observable<HttpResponse | HttpErrorResponse>{
    return this.http.delete<HttpResponse>(`${this.localhost}/user/delete/${id}`);
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
