import { Injectable } from '@angular/core';
import {NotifierService} from "angular-notifier";
import {NotifierTypes} from "../model/notifier-types.enum";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private notifier: NotifierService) { }

  public notify(type: NotifierTypes, message: string){
    this.notifier.notify(type, message);
  }
}
