import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocietyNotificationService {

  private changesOnSocieties = new BehaviorSubject<void>(undefined);
  societyNotification$ = this.changesOnSocieties.asObservable();

  notifyChangesOnSocieties() {
    this.changesOnSocieties.next();
  }
}
