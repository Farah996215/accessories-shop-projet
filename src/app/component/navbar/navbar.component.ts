import { Component, OnInit } from '@angular/core';
import { Router,RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [ CommonModule,RouterLink,RouterLinkActive,MatToolbarModule,MatButtonModule,MatIconModule,MatBadgeModule,MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartItemsCount = 0;
  isLoggedIn = false;
  userName = '';

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateCartCount();
    this.updateAuthState();
    
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user?.name || '';
    });
  }

  updateCartCount() {
    this.cartItemsCount = this.cartService.getTotalItems();
  }

  updateAuthState() {
    this.isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getCurrentUser();
    this.userName = user?.name || '';
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';

    this.router.navigate(['/home']);
    console.log('User logged out successfully.');
  }
}