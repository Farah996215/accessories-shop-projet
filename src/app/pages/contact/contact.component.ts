import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AIService, AIResponse } from '../../services/ai.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  aiForm: FormGroup;
  contactForm: FormGroup;
  isAILoading = false;
  aiResponse: AIResponse | null = null;
  suggestedProducts: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private aiService: AIService,
    private snackBar: MatSnackBar
  ) {
    this.aiForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onAIQuery() {
    if (this.aiForm.valid) {
      this.isAILoading = true;
      this.aiResponse = null;
      this.suggestedProducts = [];

      const query = this.aiForm.value.query.toLowerCase();

      setTimeout(() => {
        this.isAILoading = false;
        
        const mockProducts: Product[] = [
          {
            id: 1,
            name: 'Silver Diamond Necklace',
            price: 45,
            description: 'Elegant silver necklace with diamond pendant',
            image: 'assets/necklace.jpg',
            category: 'necklaces',
            inStock: true
          },
          {
            id: 5,
            name: 'Silver Chain Necklace',
            price: 28,
            description: 'Simple and elegant silver chain necklace',
            image: 'assets/necklace2.jpg',
            category: 'necklaces',
            inStock: true
          },
          {
            id: 6,
            name: 'Rose Gold Ring',
            price: 55,
            description: 'Delicate rose gold ring with crystal',
            image: 'assets/ring.jpg',
            category: 'rings',
            inStock: true
          }
        ];

        const filteredProducts = mockProducts.filter(product => {
          if (query.includes('necklace') && product.category === 'necklaces') return true;
          if (query.includes('ring') && product.category === 'rings') return true;
          if (query.includes('under') && query.includes('50')) {
            return product.price < 50;
          }
          if (query.includes('silver')) {
            return product.name.toLowerCase().includes('silver');
          }
          return false;
        });

        this.aiResponse = {
          products: filteredProducts,
          message: `I found ${filteredProducts.length} products matching your request: "${query}"`
        };

        this.suggestedProducts = filteredProducts;

        if (filteredProducts.length === 0) {
          this.snackBar.open('No products found matching your criteria. Try being more specific!', 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        }
      }, 2000);
    }
  }

  onContactSubmit() {
    if (this.contactForm.valid) {
      this.snackBar.open('Message sent successfully! We will get back to you soon.', 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      
      this.contactForm.reset();
    }
  }

  getAIError(): string {
    const control = this.aiForm.get('query');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Please describe what you are looking for';
      if (control.errors['minlength']) return 'Please provide more details (at least 5 characters)';
    }
    return '';
  }

  getContactError(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email';
      if (control.errors['minlength']) {
        if (controlName === 'name') return 'Name must be at least 2 characters';
        if (controlName === 'message') return 'Message must be at least 10 characters';
      }
    }
    return '';
  }

  clearAIResponse() {
    this.aiResponse = null;
    this.suggestedProducts = [];
    this.aiForm.reset();
  }
}