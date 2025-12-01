import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService, User } from '../../services/auth.service';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  recentOrders: Order[] = [];
  completedOrdersCount = 0;
  isLoading = true;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Profile component initialized');
    
    this.user = this.authService.getCurrentUser();
    console.log('Current user:', this.user);
    
    if (!this.user) {
      console.log('No user found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.loadRecentOrders();
  }

  loadRecentOrders() {
    if (!this.user) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    console.log('Loading orders for user ID:', this.user.id);
    
    this.orderService.getUserOrders(this.user.id).subscribe({
      next: (response) => {
        console.log('Orders API response:', response);
        
        if (response.success) {
          this.recentOrders = response.orders.slice(0, 5);
          console.log('Orders loaded:', this.recentOrders);
        } else {
          this.errorMessage = response.message || 'Failed to load orders';
          console.error('API error:', this.errorMessage);
          this.recentOrders = [];
        }
        this.calculateCompletedOrders();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Connection error. Please check your API server.';
        this.recentOrders = [];
        this.calculateCompletedOrders();
        this.isLoading = false;
      }
    });
  }

  calculateCompletedOrders() {
    this.completedOrdersCount = this.recentOrders.filter(order => 
      order.status === 'delivered' || order.status === 'shipped'
    ).length;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'pending': return 'warn';
      case 'confirmed': return 'accent';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/order', orderId]);
  }

  viewAllOrders() {
    this.router.navigate(['/orders']);
  }

  getTotalItems(order: Order): number {
    if (order.items) {
      return order.items.reduce((total, item) => total + item.quantity, 0);
    }
    return order.item_count || 0;
  }

  getOrderTotal(order: Order): number {
    if (order.total_items) {
      return order.total_items;
    }
    return order.total_amount;
  }
}