// product-notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductNotificationService {
  private changesOnProducts = new BehaviorSubject<void>(undefined);
  productNotification$ = this.changesOnProducts.asObservable();

  notifyChangesOnProducts() {
    this.changesOnProducts.next();
  }
}