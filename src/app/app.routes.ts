import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home',loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'products',loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent) },
  { path: 'product/:id',loadComponent: () => import('./pages/product-details/product-details.component').then(m => m.ProductDetailsComponent) },
  { path: 'cart',loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent) },
  { path: 'checkout',loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'login',loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent) },
  { path: 'contact',loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent) }
];