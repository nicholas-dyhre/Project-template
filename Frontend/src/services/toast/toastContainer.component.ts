import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ToastService, Toast } from './toast.service';
import { ToastItemComponent } from './toastItem.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastItemComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      @for (toast of toasts; track toast.id) {
        <app-toast-item 
          [toast]="toast"
          (dismiss)="removeToast($event)"
          class="pointer-events-auto">
        </app-toast-item>
      }
    </div>
  `
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private destroy$ = new Subject<void>();
  private toastService = inject(ToastService);

  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toast => {
        this.toasts.push(toast);
        
        if (toast.autoDismiss && toast.duration) {
          setTimeout(() => {
            this.removeToast(toast.id);
          }, toast.duration);
        }
      });
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
