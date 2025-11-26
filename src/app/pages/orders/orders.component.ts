import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';

export interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = ['id', 'date', 'items', 'total', 'status', 'actions'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadOrders();
  }

  loadOrders() {
    this.orders = [
      {
        id: 1001,
        date: '2024-01-15',
        total: 168.00,
        status: 'delivered',
        shippingAddress: '123 Main St, Tunis, 1001',
        items: [
          {
            productId: 1,
            productName: 'Silver Diamond Necklace',
            quantity: 1,
            price: 45.00,
            image: 'assets/necklace.jpg'
          },
          {
            productId: 2,
            productName: 'Gold Plated Bracelet',
            quantity: 1,
            price: 75.00,
            image: 'assets/bracelet.jpg'
          },
          {
            productId: 3,
            productName: 'Pearl Stud Earrings',
            quantity: 1,
            price: 35.00,
            image: 'assets/earrings.jpg'
          }
        ]
      },
      {
        id: 1002,
        date: '2024-01-10',
        total: 75.00,
        status: 'shipped',
        shippingAddress: '123 Main St, Tunis, 1001',
        items: [
          {
            productId: 2,
            productName: 'Gold Plated Bracelet',
            quantity: 1,
            price: 75.00,
            image: 'assets/bracelet.jpg'
          }
        ]
      },
      {
        id: 1003,
        date: '2024-01-05',
        total: 45.00,
        status: 'pending',
        shippingAddress: '123 Main St, Tunis, 1001',
        items: [
          {
            productId: 1,
            productName: 'Silver Diamond Necklace',
            quantity: 1,
            price: 45.00,
            image: 'assets/necklace.jpg'
          }
        ]
      }
    ];
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'pending': return 'warn';
      default: return 'default';
    }
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/orders', orderId]);
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  }
}