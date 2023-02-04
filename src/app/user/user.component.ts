import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../services/user.service";
import {Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {NotifierTypes} from "../model/notifier-types.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {HttpResponseData} from "../model/http-response-data";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  public users: User[];
  public selectedUser: User;
  private subscriptions: Subscription[] = [];

  public editUser = new User();
  public currentUsername: string;

  constructor(private userService: UserService, private notificationService: NotificationService) {
  }
  ngOnInit(): void {
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

  public saveNewUser(userForm: NgForm): void {
    const formData = this.userService.createFormData(null, userForm.value);
    this.subscriptions.push(
      this.userService.saveUser(formData).subscribe(
        (response: User) => {
          document.getElementById('closeModal').click();
          this.getUsers(false);
          userForm.reset();
          this.sendNotification(NotifierTypes.SUCCESS, `${response.firstName}  ${response.firstName} user added successfully`);
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
  public updateCurrentUser(): void {
    const updatedData = this.userService.createFormData(this.currentUsername, this.editUser);
    this.subscriptions.push(
      this.userService.updateUser(updatedData).subscribe(
        (response: User) => {
          document.getElementById('closeUpdateModal').click();
          this.getUsers(false);
          this.sendNotification(NotifierTypes.SUCCESS, `${response.firstName}  ${response.firstName} user changed successfully`);
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

  private sendNotification(noteType: NotifierTypes, message: string): void{
    if(message) {
      this.notificationService.notify(noteType, message);
    } else {
      this.notificationService.notify(noteType, 'Something went wrong, try again.');
    }
  }


}
