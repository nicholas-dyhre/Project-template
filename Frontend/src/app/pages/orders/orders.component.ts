import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiClient, Order, OrderStatus, UserDto } from '../../api/generated-api-client';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private apiClient = inject(ApiClient);
  private authService = inject(AuthService);
  orders: Order[] = [];
  isLoading = true;
  isAuthenticated = false;
  currentUser: UserDto | null = null;

  ngOnInit(): void {
    combineLatest([
      this.authService.currentUser$,
      this.authService.isAuthenticated$
    ]).subscribe(([user, isAuth]) => {

      this.currentUser = user;
      this.isAuthenticated = isAuth;

      if (!isAuth || !user) {
        this.isLoading = false;
        return;
      }

      if(user.identityUserId != null){
        this.loadOrders(user.identityUserId);
      }
    });
  }

  loadOrders(userId: string): void {
    this.apiClient.users_GetOrdersForUser(userId).subscribe({
      next: (orders) => {
        this.orders = orders || [];
        // this.basketItems = basket.items ;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders', error);
        this.isLoading = false;
      }
    });
  }

  // getStatusColor(status: Order['status']): OrderStatus {
  //   switch (status) {
  //     case OrderStatus.Delivered:
  //       return 'bg-green-100 text-green-800';
  //     case OrderStatus.Shipped:
  //       return 'bg-blue-100 text-blue-800';
  //     case OrderStatus.Processing:
  //       return 'bg-yellow-100 text-yellow-800';
  //     case OrderStatus.Pending:
  //       return 'bg-gray-100 text-gray-800';
  //     case OrderStatus.Cancelled:
  //       return 'bg-red-100 text-red-800';
  //     default:
  //       return 'bg-gray-100 text-gray-800';
  //   }
  // }

  readonly statusClasses: Record<OrderStatus, string> = {
  [OrderStatus.Delivered]: 'bg-green-100 text-green-800',
  [OrderStatus.Shipped]: 'bg-blue-100 text-blue-800',
  [OrderStatus.Processing]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.Pending]: 'bg-gray-100 text-gray-800',
  [OrderStatus.Cancelled]: 'bg-red-100 text-red-800'
};

  // getStatusText(status: Order['status']): string {
  //   return status.charAt(0).toUpperCase() + status.slice(1);
  // }
}
