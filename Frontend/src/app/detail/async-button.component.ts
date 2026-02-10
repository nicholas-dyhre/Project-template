import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-async-button',
  templateUrl: './async-button.component.html',
  imports: [CommonModule],
})
export class AsyncButtonComponent {
  label = input<string>('Add to cart');
  action = input<() => Promise<void>>();

  state = signal<ButtonState>('idle');

  onClick() {
    if (this.state() !== 'idle') return;

    this.state.set('loading');

    const runAnimation = new Promise<void>((resolve) => {
      setTimeout(resolve, 600);
    });

    const apiCall = this.action ? this.action() : Promise.resolve();

    Promise.all([runAnimation, apiCall])
      .then(() => this.state.set('success'))
      .catch(() => this.state.set('error'))
      .finally(() => setTimeout(() => this.state.set('idle'), 1200));
  }
}
