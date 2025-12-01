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

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order_id?: number;
  user_id?: number;
  total?: number;
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
            console.log('Orders loaded from API:', response.orders);
            this.ordersSubject.next(response.orders);
          }
        }),
        catchError(error => {
          console.error('Error fetching orders from API:', error);
          return this.getOrdersFromLocalStorage(userId);
        })
      );
  }
  private getOrdersFromLocalStorage(userId: number): Observable<OrdersResponse> {
    try {
      const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      const userOrders = localOrders.filter((order: Order) => order.user_id === userId);
      
      console.log('Orders loaded from localStorage:', userOrders);
      
      return of({
        success: true,
        orders: userOrders
      });
    } catch (error) {
      console.error('Error getting orders from local storage:', error);
      return of({
        success: false,
        orders: [],
        message: 'Failed to load orders'
      });
    }
  }
  private saveOrdersToLocalStorage(orders: Order[]): void {
    try {
      localStorage.setItem('user_orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders to local storage:', error);
    }
  }
  getOrderById(orderId: number, userId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.apiUrl}/get-order.php?id=${orderId}&user_id=${userId}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching order from API:', error);
          return this.getOrderFromLocalStorage(orderId, userId);
        })
      );
  }
  private getOrderFromLocalStorage(orderId: number, userId: number): Observable<OrderResponse> {
    try {
      const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      const order = localOrders.find((order: Order) => 
        order.id === orderId && order.user_id === userId
      );
      
      if (order) {
        return of({
          success: true,
          order: order
        });
      } else {
        return of({
          success: false,
          order: {} as Order,
          message: 'Order not found'
        });
      }
    } catch (error) {
      console.error('Error getting order from local storage:', error);
      return of({
        success: false,
        order: {} as Order,
        message: 'Failed to load order details'
      });
    }
  }
  createOrder(orderData: CreateOrderRequest): Observable<CreateOrderResponse> {
    console.log('Sending order to API:', orderData);
    
    return this.http.post<CreateOrderResponse>(`${this.apiUrl}/orders.php`, orderData)
      .pipe(
        tap(response => {
          console.log('Order API response:', response);
          if (response.success && response.order_id) {
            this.addOrderToLocalStorage(orderData, response.order_id);
          }
        }),
        catchError(error => {
          console.error('Error creating order:', error);
          return of({
            success: false,
            message: 'Failed to create order. Please try again.'
          });
        })
      );
  }
  private addOrderToLocalStorage(orderData: CreateOrderRequest, orderId: number): void {
    try {
      const newOrder: Order = {
        id: orderId,
        user_id: orderData.user_id,
        total_amount: orderData.total,
        status: 'pending',
        shipping_address: orderData.shipping_info.address,
        shipping_city: orderData.shipping_info.city,
        shipping_zip: orderData.shipping_info.zipCode,
        created_at: new Date().toISOString().split('T')[0],
        items: orderData.items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.image
        }))
      };

      const currentOrders = this.ordersSubject.value;
      const updatedOrders = [newOrder, ...currentOrders];
      this.ordersSubject.next(updatedOrders);
      this.saveOrdersToLocalStorage(updatedOrders);
      
    } catch (error) {
      console.error('Error adding order to local storage:', error);
    }
  }
  getOrdersObservable(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }
}