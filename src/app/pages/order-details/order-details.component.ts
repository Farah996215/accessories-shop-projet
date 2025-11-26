import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../services/auth.service';

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: number;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  shippingAddress: string;
  shippingCity: string;
  shippingZip: string;
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  orderId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.params.subscribe(params => {
      this.orderId = +params['id'];
      this.loadOrderDetails();
    });
  }

  loadOrderDetails() {
    // Mock data - in real app, you'd fetch from API based on orderId
    const mockOrders: { [key: number]: Order } = {
      1001: {
        id: 1001,
        date: '2024-01-15',
        total: 168.00,
        status: 'delivered',
        shippingAddress: '123 Avenue Habib Bourguiba',
        shippingCity: 'Tunis',
        shippingZip: '1001',
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
      1002: {
        id: 1002,
        date: '2024-01-10',
        total: 75.00,
        status: 'shipped',
        shippingAddress: '123 Avenue Habib Bourguiba',
        shippingCity: 'Tunis',
        shippingZip: '1001',
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
      1003: {
        id: 1003,
        date: '2024-01-05',
        total: 45.00,
        status: 'pending',
        shippingAddress: '123 Avenue Habib Bourguiba',
        shippingCity: 'Tunis',
        shippingZip: '1001',
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
    };

    this.order = mockOrders[this.orderId] || null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'delivered': return 'success';
      case 'shipped': return 'primary';
      case 'pending': return 'warn';
      default: return 'default';
    }
  }

  getSubtotal(): number {
    if (!this.order) return 0;
    return this.order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.19;
  }

  getShippingCost(): number {
    return 0;
  }
}