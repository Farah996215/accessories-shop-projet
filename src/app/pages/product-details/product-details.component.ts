import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router ,RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.loadProduct(productId);
    });
  }

  loadProduct(id: number) {
    const allProducts = [
      {
        id: 1,
        name: 'Silver Diamond Necklace',
        price: 45,
        description: 'Elegant silver necklace with genuine diamond pendant. Perfect for special occasions and evening wear.',
        image: 'pictures/necklace.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 2,
        name: 'Gold Plated Bracelet',
        price: 75,
        description: 'Beautiful gold plated bracelet with intricate design. Features delicate patterns and secure clasp.',
        image: 'pictures/braclet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 3,
        name: 'Pearl Stud Earrings',
        price: 35,
        description: 'Classic pearl stud earrings for everyday wear. Hypoallergenic and comfortable for sensitive ears.',
        image: 'pictures/earings.jpg',
        category: 'earrings',
        inStock: true
      },
      {
        id: 4,
        name: 'Leather Strap Watch',
        price: 120,
        description: 'Premium leather strap watch with silver dial. Water resistant and featuring precise quartz movement.',
        image: 'pictures/watch.jpeg',
        category: 'watches',
        inStock: true
      },
      {
        id: 5,
        name: 'Silver Chain Necklace',
        price: 28,
        description: 'Simple and elegant silver chain necklace. Versatile piece that complements any outfit.',
        image: 'pictures/simple chain.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 6,
        name: 'Rose Gold Ring',
        price: 55,
        description: 'Delicate rose gold ring with crystal accent. Adjustable sizing for perfect fit.',
        image: 'pictures/ring.jpeg',
        category: 'rings',
        inStock: true
      }
    ];

    this.product = allProducts.find(p => p.id === id) || null;
    
    if (this.product) {
      this.loadRelatedProducts(this.product.category, id);
    }
  }

  loadRelatedProducts(category: string, currentProductId: number) {
    const allProducts = [
      {
        id: 1,
        name: 'Silver Diamond Necklace',
        price: 450,
        description: 'Elegant silver necklace with diamond pendant',
        image: 'pctures/necklace.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 2,
        name: 'Gold Plated Bracelet',
        price: 750,
        description: 'Beautiful gold plated bracelet',
        image: 'pictures/braclet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 5,
        name: 'Silver Chain Necklace',
        price: 28,
        description: 'Simple silver chain necklace',
        image: 'pictures/simple chain.jpeg',
        category: 'necklaces',
        inStock: true
      }
    ];

    this.relatedProducts = allProducts
      .filter(p => p.category === category && p.id !== currentProductId)
      .slice(0, 3);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.snackBar.open('Product added to cart!', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    }
  }

  buyNow() {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.router.navigate(['/cart']);
    }
  }
}