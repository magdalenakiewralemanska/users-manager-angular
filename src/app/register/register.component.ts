import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../model/user";
import {Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {NotifierTypes} from "../model/notifier-types.enum";
import {NotificationService} from "../services/notification.service";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy{
  private subscriptions: Subscription[] = [];
  constructor(private  router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl("/user/management");
    }
  }

  public startRegister(user: User): void {
    this.subscriptions.push(
      this.authenticationService.register(user).subscribe(
        (response: User) => {
          this.sendNotification(NotifierTypes.SUCCESS, `Account for ${response.username} created successfully`);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
