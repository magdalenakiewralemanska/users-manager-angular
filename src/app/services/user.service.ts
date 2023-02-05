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

  public createFormDataForAddition(user: User): FormData {
    const formData = new FormData();
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('username', user.username);
    formData.append('role', user.rolePermissions);
    formData.append('isActive', JSON.stringify(user.isActive));
    formData.append('isNonLocked', JSON.stringify(user.isNonLocked));
    return formData;
  }

  public createFormDataForUpdate(currentUsername: string, userDto: User): FormData {
    const formData = new FormData();
    formData.append('currentUsername', currentUsername);
    formData.append('firstName', userDto.firstName);
    formData.append('lastName', userDto.lastName);
    formData.append('email', userDto.email);
    formData.append('username', userDto.username);
    formData.append('role', userDto.rolePermissions);
    formData.append('isActive', JSON.stringify(userDto.isActive));
    formData.append('isNonLocked', JSON.stringify(userDto.isNonLocked));
    return formData;
  }

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
