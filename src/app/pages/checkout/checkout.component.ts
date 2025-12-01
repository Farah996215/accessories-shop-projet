import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { CartService, CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService, CreateOrderRequest } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLinear = true;
  isSubmitting = false;
  
  shippingForm: FormGroup;
  paymentForm: FormGroup;
  
  paymentMethods = [
    { value: 'credit', label: 'Credit Card', icon: 'credit_card' },
    { value: 'paypal', label: 'PayPal', icon: 'account_balance_wallet' },
    { value: 'cod', label: 'Cash on Delivery', icon: 'payments' }
  ];

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.shippingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['credit', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      cardHolder: ['']
    });
  }

  ngOnInit() {
    this.cartItems = this.cartService.getCartItems();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }

    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please login to complete your purchase', 'Login', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }).onAction().subscribe(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      });
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.shippingForm.patchValue({
        email: currentUser.email
      });
    }

    this.paymentForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      this.updatePaymentValidators(method);
    });

    this.updatePaymentValidators('credit');
  }

  getPaymentMethodLabel(): string {
    const method = this.paymentForm.get('paymentMethod')?.value;
    const paymentMethod = this.paymentMethods.find(m => m.value === method);
    return paymentMethod ? paymentMethod.label : 'Unknown';
  }

  updatePaymentValidators(method: string) {
    const cardNumber = this.paymentForm.get('cardNumber');
    const expiryDate = this.paymentForm.get('expiryDate');
    const cvv = this.paymentForm.get('cvv');
    const cardHolder = this.paymentForm.get('cardHolder');

    if (method === 'credit') {
      cardNumber?.setValidators([Validators.required, Validators.pattern(/^[0-9]{16}$/)]);
      expiryDate?.setValidators([Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/[0-9]{2}$/)]);
      cvv?.setValidators([Validators.required, Validators.pattern(/^[0-9]{3,4}$/)]);
      cardHolder?.setValidators([Validators.required]);
    } else {
      cardNumber?.clearValidators();
      expiryDate?.clearValidators();
      cvv?.clearValidators();
      cardHolder?.clearValidators();
    }

    cardNumber?.updateValueAndValidity();
    expiryDate?.updateValueAndValidity();
    cvv?.updateValueAndValidity();
    cardHolder?.updateValueAndValidity();
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  getTax(): number {
    return this.getTotalPrice() * 0.19;
  }

  getFinalTotal(): number {
    return this.getTotalPrice() + this.getTax();
  }

  async placeOrder() {
    if (this.shippingForm.valid && this.paymentForm.valid && this.authService.isLoggedIn()) {
      this.isSubmitting = true;

      const userId = this.authService.getUserId();
      if (!userId) {
        this.snackBar.open('User not found. Please login again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.isSubmitting = false;
        return;
      }

      const orderData: CreateOrderRequest = {
        user_id: userId,
        items: this.cartItems,
        total: this.getFinalTotal(),
        shipping_info: this.shippingForm.value
      };

      try {
        const response = await this.orderService.createOrder(orderData).toPromise();
        
        if (response && response.success) {
          this.completeOrder(response.order_id);
        } else {
          this.createLocalOrderInStorage(orderData);
        }
      } catch (error) {
        this.createLocalOrderInStorage(orderData);
      }
    }
  }

  private createLocalOrderInStorage(orderData: CreateOrderRequest) {
    const orderId = Math.floor(Math.random() * 90000) + 10000;
    const localOrders = JSON.parse(localStorage.getItem('local_orders') || '[]');
    const newOrder = {
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
    
    localOrders.push(newOrder);
    localStorage.setItem('local_orders', JSON.stringify(localOrders));
    
    this.completeOrder(orderId);
  }

  private completeOrder(orderId: number) {
    this.cartService.clearCart();
    
    this.snackBar.open(`Order placed successfully! Order ID: ${orderId}`, 'View Order', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    }).onAction().subscribe(() => {
      this.router.navigate(['/order', orderId]);
    });

    this.router.navigate(['/order', orderId]);
  }

  getShippingFormErrors(controlName: string): string {
    const control = this.shippingForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email';
      if (control.errors['minlength']) return 'Too short';
      if (control.errors['pattern']) {
        if (controlName === 'phone') return 'Please enter a valid 8-digit phone number';
        if (controlName === 'zipCode') return 'Please enter a valid 4-digit ZIP code';
      }
    }
    return '';
  }

  getPaymentFormErrors(controlName: string): string {
    const control = this.paymentForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['pattern']) {
        if (controlName === 'cardNumber') return 'Please enter a valid 16-digit card number';
        if (controlName === 'expiryDate') return 'Please use MM/YY format';
        if (controlName === 'cvv') return 'Please enter a valid CVV';
      }
    }
    return '';
  }
}