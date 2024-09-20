import { Injectable } from '@angular/core';
import { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AppConfig } from '../../config/app-config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  stripe: Stripe | null = null;
  elements!: StripeElements;
  card!: StripeCardElement;

  constructor(private http: HttpClient) {}

  async initStripe() {
    this.stripe = await loadStripe(AppConfig.STRIPE_PUBLIC_KEY);
    this.elements = this.stripe?.elements()!;
  }

  async createPaymentMethod(cardElement: StripeCardElement, billingDetails: any) {
    return this.stripe?.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: billingDetails,
    });
  }


  pay(paymentMethodId: string, amount: number): Observable<any> {
    return this.http.post(`${AppConfig.API_URL}/payment`, {
      paymentMethodId,
      amount
    });
  }
}