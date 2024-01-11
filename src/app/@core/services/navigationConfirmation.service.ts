// checkout-exit-confirmation.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckoutExitConfirmationService {
  private isConfirmed: boolean = false;

  setConfirmationStatus(status: boolean): void {
    this.isConfirmed = status;
  }

  getConfirmationStatus(): boolean {
    return this.isConfirmed;
  }

  resetConfirmationStatus(): void {
    this.isConfirmed = false;
  }
}
