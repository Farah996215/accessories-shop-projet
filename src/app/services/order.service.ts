import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CartItem } from './cart.service';

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_zip: string;
  created_at: string;
  items: OrderItem[];
  item_count?: number;
  total_items?: number;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image: string;
  description?: string;
}

export interface CreateOrderRequest {
  user_id: number;
  items: CartItem[];
  total: number;
  shipping_info: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
  };
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;
  private ordersSubject = new BehaviorSubject<Order[]>([]);

  constructor(private http: HttpClient) {}
  
  getUserOrders(userId: number): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.apiUrl}/get-orders.php?user_id=${userId}`)
      .pipe(
        tap(response => {
          if (response.success) {
            this.ordersSubject.next(response.orders);
          }
        }),
        catchError(error => {
          console.error('Error fetching orders:', error);
          return of({
            success: false,
            orders: [],
            message: 'Failed to load orders'
          });
        })
      );
  }
  getOrderById(orderId: number, userId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/get-order.php?id=${orderId}&user_id=${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching order:', error);
          return of({
            success: false,
            order: {} as Order,
            message: 'Failed to load order details'
          });
        })
      );
  }
  createOrder(orderData: CreateOrderRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders.php`, orderData);
  }
  getOrdersObservable(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }
  getMockOrders(userId: number): Order[] {
    return [
      {
        id: 1001,
        user_id: userId,
        total_amount: 168.00,
        status: 'pending',
        shipping_address: '123 Avenue Habib Bourguiba',
        shipping_city: 'Tunis',
        shipping_zip: '1001',
        created_at: '2024-01-15',
        item_count: 3,
        total_items: 155,
        items: [
          {
            product_id: 1,
            product_name: 'Silver Diamond Necklace',
            quantity: 1,
            price: 45.00,
            image: 'assets/necklace.jpg'
          },
          {
            product_id: 2,
            product_name: 'Gold Plated Bracelet',
            quantity: 1,
            price: 75.00,
            image: 'assets/bracelet.jpg'
          },
          {
            product_id: 3,
            product_name: 'Pearl Stud Earrings',
            quantity: 1,
            price: 35.00,
            image: 'assets/earrings.jpg'
          }
        ]
      }
    ];
  }
}