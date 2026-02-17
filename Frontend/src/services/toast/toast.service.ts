import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  autoDismiss: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toasts$ = this.toastSubject.asObservable();
  
  private toastCounter = 0;

  show(type: ToastType, message: string, autoDismiss = true, duration = 5000): void {
    const toast: Toast = {
      id: `toast-${++this.toastCounter}-${Date.now()}`,
      type,
      message,
      autoDismiss,
      duration: autoDismiss ? duration : undefined
    };
    
    this.toastSubject.next(toast);
  }

  success(message: string, autoDismiss = true, duration = 5000): void {
    this.show('success', message, autoDismiss, duration);
  }

  error(message: string, autoDismiss = true, duration = 5000): void {
    this.show('error', message, autoDismiss, duration);
  }

  warning(message: string, autoDismiss = true, duration = 5000): void {
    this.show('warning', message, autoDismiss, duration);
  }

  info(message: string, autoDismiss = true, duration = 5000): void {
    this.show('info', message, autoDismiss, duration);
  }
}
