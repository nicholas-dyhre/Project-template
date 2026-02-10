import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiClient, BasketItem } from '../../api/generated-api-client';
import { BasketStateService } from '../../../services/BasketStateService';

// TODO: Replace with your actual Order model from API client
interface Order {
  id: string;
  orderNumber: string;
  date: Date;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
  private authService = inject(AuthService);
  private basketStateService = inject(BasketStateService);
  orders: Order[] = [];
  isLoading = true;
  isAuthenticated = false;

  constructor(private apiClient: ApiClient) {}


  ngOnInit(): void {
    // Check if user is authenticated
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      
      if (isAuth) {
        this.loadOrders();
      } else {
        this.isLoading = false;
      }
    });
  }

  loadOrders(): void {
    // TODO: Replace with actual API call
    // this.apiClient.get_orders().subscribe({
    //   next: (basket) => {
    //     this.basketItems = basket.items || [];
    //     this.isLoading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading orders', error);
    //     this.isLoading = false;
    //   }
    // });

    // Mock data for demonstration
    setTimeout(() => {
      this.orders = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          date: new Date('2024-01-15'),
          total: 70.00,
          status: 'delivered',
          items: [
            { productName: 'Ceramic Coffee Mug', quantity: 2, price: 25.00 },
            { productName: 'Handcrafted Wooden Bowl', quantity: 1, price: 45.00 }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          date: new Date('2024-02-01'),
          total: 35.00,
          status: 'shipped',
          items: [
            { productName: 'Woven Basket', quantity: 1, price: 35.00 }
          ]
        }
      ];
      this.isLoading = false;
    }, 500);
  }

  getStatusColor(status: Order['status']): string {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: Order['status']): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
