import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";
import {NotificationService} from "../services/notification.service";
import {NotifierTypes} from "../model/notifier-types.enum";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router, private notificationService: NotificationService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.isLoggedIn();
  }

  private isLoggedIn(): boolean {
    if (this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.notify(NotifierTypes.ERROR, `You have to be logged in to access this page`);
    return false;
  }
}
