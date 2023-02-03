import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";
import {User} from "../model/user";
import {Subscription} from "rxjs";
import {HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {HeaderType} from "../model/header-type.enum";
import {NotifierTypes} from "../model/notifier-types.enum";
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  private subscriptions: Subscription[] = [];
  constructor(private  router: Router, private authenticationService: AuthenticationService, private notificationService: NotificationService) {
  }
  ngOnInit(): void {
    if(this.authenticationService.isUserLoggedIn()){
      this.router.navigateByUrl("/user/management");
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  public startLogin(user: User): void {
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.TOKEN);
          this.authenticationService.saveToken(token);
          this.authenticationService.addUserToCache(response.body);
          this.router.navigateByUrl('user/management');
        },
        (error: HttpErrorResponse) => {
          this.sendErrorNotification(NotifierTypes.ERROR, error.error.message);
        }
      )
    )
  }

  private sendErrorNotification(noteType: NotifierTypes, message: string): void{
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
