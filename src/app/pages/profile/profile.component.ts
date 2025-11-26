import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatListModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  recentOrders: any[] = [];
  completedOrdersCount: number=0;

  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.router.navigate(['/login']);
       if (!this.user) {
      this.router.navigate(['/login']);
      return;
  }
    this.loadRecentOrders();
  }
  
  loadRecentOrders() {
    this.recentOrders = [
      {
        id: 1001,
        date: '2024-01-15',
        total: 168.00,
        status: 'delivered',
        items: 3
      },
      {
        id: 1002,
        date: '2024-01-10',
        total: 75.00,
        status: 'shipped',
        items: 1
      },
      {
        id: 1003,
        date: '2024-01-05',
        total: 45.00,
        status: 'pending',
        items: 1
      }
    ];
    this.calculateCompletedOrders();
  }
  calculateCompletedOrders() {
    this.completedOrdersCount = this.recentOrders.filter(order => order.status === 'delivered').length;
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

  viewAllOrders() {
    this.router.navigate(['/orders']);
  }
}
