import {Component, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../services/user.service";
import {Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {NotifierTypes} from "../model/notifier-types.enum";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  public users: User[];
  private subscriptions: Subscription[] = [];
  public selectedUser: User;
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

  private sendNotification(noteType: NotifierTypes, message: string): void{
    if(message) {
      this.notificationService.notify(noteType, message);
    } else {
      this.notificationService.notify(noteType, 'Something went wrong, try again.');
    }
  }

  public selectUser(selectedUser: User): void {
    this.selectedUser = selectedUser;
    document.getElementById('openUserInfo').click();
  }


}
