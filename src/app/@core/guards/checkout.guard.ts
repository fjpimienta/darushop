import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { CheckoutExitConfirmationService } from '@core/services/navigationConfirmation.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CheckoutGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private confirmationService: CheckoutExitConfirmationService) {}

  canDeactivate(
    component: CanComponentDeactivate
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.confirmationService.getConfirmationStatus()) {
      const confirmation = confirm('¿Seguro que quieres salir de la página de checkout?');
      if (confirmation) {
        // Lógica adicional antes de salir
        component.canDeactivate();
      }
      this.confirmationService.setConfirmationStatus(confirmation);
      return confirmation;
    }
    return true;
  }
}
