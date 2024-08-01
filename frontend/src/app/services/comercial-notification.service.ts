import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComercialNotificationService {

  private changesOnComerciales = new BehaviorSubject<void>(undefined);
  comercialNotification$ = this.changesOnComerciales.asObservable();

  notifyChangesOnSocieties() {
    this.changesOnComerciales.next();
  }
}
