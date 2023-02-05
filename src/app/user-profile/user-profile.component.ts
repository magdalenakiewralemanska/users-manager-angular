import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../model/user";
import {UserService} from "../services/user.service";
import {Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {NotifierTypes} from "../model/notifier-types.enum";
import {HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {Role} from "../model/role.enum";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy{

  public user: User;
  private subscriptions: Subscription[] = [];
  public currentUsername: string;
  constructor(private authenticationService: AuthenticationService, private userService: UserService, private notificationService: NotificationService,
              private router:Router) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUserFromCache();
  }

  public updateProfile(user: User): void {
    this.currentUsername = this.authenticationService.getUserFromCache().username;
    const formData = this.userService.createFormDataForUpdate(this.currentUsername, user);
    this.subscriptions.push(
      this.userService.updateUser(formData).subscribe(
        (response: User) => {
          this.authenticationService.addUserToCache(response);
          this.userService.getAllUsers();
          this.sendNotification(NotifierTypes.SUCCESS, `${response.firstName}  ${response.firstName} user changed successfully`);
        },
        (error: HttpErrorResponse) => {
          this.sendNotification(NotifierTypes.ERROR, error.error.message);
        }
      ));
  }

  public onLogOut(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    this.sendNotification(NotifierTypes.SUCCESS, `You've been logged out successfully`);
  }

  public get isAdmin(): boolean {
    return this.getUserRole() === Role.ADMIN;
  }

  public get isModerator(): boolean {
    return this.getUserRole() === Role.MODERATOR || this.getUserRole() === Role.ADMIN;
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

}
