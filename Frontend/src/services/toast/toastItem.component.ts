import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from './toast.service';

@Component({
  selector: 'app-toast-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [class]="getToastClasses()"
      [style.animation]="slideIn() ? 'slideInRight 0.3s ease-out' : 'slideOutRight 0.3s ease-in'">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          @switch (toast.type) {
            @case ('success') {
              <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            }
            @case ('error') {
              <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
            }
            @case ('warning') {
              <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            }
            @case ('info') {
              <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
              </svg>
            }
          }
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900">{{ toast.message }}</p>
        </div>

        @if (!toast.autoDismiss) {
          <button
            type="button"
            (click)="onDismiss()"
            class="flex-shrink-0 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600">
            <span class="sr-only">Close</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        }
      </div>
    </div>

    <style>
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    </style>
  `
})
export class ToastItemComponent {
  @Input({ required: true }) toast!: Toast;
  @Output() dismiss = new EventEmitter<string>();
  
  slideIn = signal(true);


  onDismiss(): void {
    this.slideIn.set(false);
    setTimeout(() => {
      this.dismiss.emit(this.toast.id);
    }, 300);
  }

  getToastClasses(): string {
    const baseClasses = 'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto overflow-hidden';
    
    const typeClasses: Record<string, string> = {
      success: 'bg-white border-l-4 border-green-500',
      error: 'bg-white border-l-4 border-red-500',
      warning: 'bg-white border-l-4 border-yellow-500',
      info: 'bg-white border-l-4 border-blue-500'
    };

    return `${baseClasses} ${typeClasses[this.toast.type]} p-4`;
  }
}
