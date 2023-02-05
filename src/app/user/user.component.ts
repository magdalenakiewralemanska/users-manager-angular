import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../services/user.service";
import {Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {NotifierTypes} from "../model/notifier-types.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {HttpResponseData} from "../model/http-response-data";
import {AuthenticationService} from "../services/authentication.service";
import {Role} from "../model/role.enum";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy{

  public users: User[];
  public selectedUser: User;
  public user: User;
  private subscriptions: Subscription[] = [];

  public editUser = new User();
  public currentUsername: string;


  constructor(private userService: UserService, private notificationService: NotificationService, private authenticationService: AuthenticationService) {
  }
  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromCache();
    this.getUsers(true);
  }

  public getUsers(showNotification: boolean): void {
    this.subscriptions.push(
      this.userService.getAllUsers().subscribe(
        (response: User[])=> {
          this.userService.addUsersToCache(response);
          this.users = response;
          if(showNotification){
            this.sendNotification(NotifierTypes.SUCCESS, `${response.length} user(s) loaded successfully`);
          }
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotifierTypes.ERROR, error.error.message);
        }
      )
    );
  }

  public selectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    document.getElementById('openUserInfo').click();
  }

  public saveNewUser(userForm: NgForm, user: User): void {
    this.subscriptions.push(
      this.userService.saveUser(user).subscribe(
        (response: User) => {
          document.getElementById('closeModal').click();
          this.getUsers(false);
          userForm.reset();
          this.sendNotification(NotifierTypes.SUCCESS, `${response.firstName}  ${response.lastName} user added successfully`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotifierTypes.ERROR, error.error.message);
        }
      ));
  }

  public searchUsers(attributes: string): void{
    const results: User[] = [];
    for(const user of this.userService.getUsersFromCache()){
      if(user.firstName.toLowerCase().indexOf(attributes.toLowerCase()) !== -1 ||
         user.lastName.toLowerCase().indexOf(attributes.toLowerCase()) !== -1 ||
         user.username.toLowerCase().indexOf(attributes.toLowerCase()) !== -1 ||
         user.email.toLowerCase().indexOf(attributes.toLowerCase()) !== -1){
        results.push(user);
      }
    }
    this.users = results;
    if(results.length == 0 || !attributes){
      this.users = this.userService.getUsersFromCache();
    }
  }

  public onUpdateUser(editUser: User):void {
    this.editUser = editUser;
    this.currentUsername = editUser.username;
    document.getElementById('openUserUpdate').click();
  }
  public updateCurrentUser(user: User): void {
    user = this.editUser;
    this.subscriptions.push(
      this.userService.updateUser(user).subscribe(
        (response: User) => {
          document.getElementById('closeUpdateModal').click();
          this.getUsers(false);
          this.sendNotification(NotifierTypes.SUCCESS, `${response.firstName}  ${response.lastName} user changed successfully`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotifierTypes.ERROR, error.error.message);
        }
      ));
  }

  public onDeleteUser(userId: number): void{
    this.subscriptions.push(
      this.userService.deleteUser(userId).subscribe(
        (response: HttpResponseData) => {
          this.sendNotification(NotifierTypes.SUCCESS, response.message);
          this.getUsers(false);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotifierTypes.ERROR, error.error.message);
        }
      )
    )
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN;
  }

  public get isModerator(): boolean {
    return this.getUserRole() === Role.MODERATOR;
  }

  public get isUser(): boolean {
    return this.getUserRole() === Role.USER;
  }
  private getUserRole(): string {
    return this.authenticationService.getUserFromCache().rolePermissions;
  }

  private sendNotification(noteType: NotifierTypes, message: string): void{
    if(message) {
      this.notificationService.notify(noteType, message);
    } else {
      this.notificationService.notify(noteType, 'Something went wrong, try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getReport(): void {
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('users');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:' + dataType + ', ' + tableHtml;
    downloadLink.download = 'users-report.xls';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  printReport(): void {
    window.print();
  }


}
