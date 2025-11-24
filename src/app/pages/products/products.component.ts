import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = ['all', 'necklaces', 'bracelets', 'earrings', 'watches', 'rings'];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  priceRange: number = 200;
  sortBy: string = 'name';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'] || 'all';
      this.loadProducts();
    });
  }

  loadProducts() {
    this.products = [
      {
        id: 1,
        name: 'Silver Diamond Necklace',
        price: 450,
        description: 'Elegant silver necklace with diamond pendant',
        image: 'pictures/necklace.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 2,
        name: 'Gold Plated Bracelet',
        price: 750,
        description: 'Beautiful gold plated bracelet with intricate design',
        image: 'pictures/braclet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 3,
        name: 'Pearl Stud Earrings',
        price: 200,
        description: 'Classic pearl stud earrings for everyday wear',
        image: 'pictures/earings.jpeg',
        category: 'earrings',
        inStock: true
      },
      {
        id: 4,
        name: 'Leather Strap Watch',
        price: 90,
        description: 'Premium leather strap watch   ',
        image: 'pictures/watch.jpeg',
        category: 'watches',
        inStock: true
      },
      {
        id: 5,
        name: 'Silver Chain Necklace',
        price: 280,
        description: 'Simple and elegant silver chain necklace',
        image: 'pictures/simple chain.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 6,
        name: 'Rose Gold Ring',
        price: 180,
        description: 'Delicate rose gold ring with crystal',
        image: 'pictures/ring.jpeg',
        category: 'rings',
        inStock: true
      },
      {
        id: 7,
        name: 'Sports Watch',
        price: 95,
        description: 'Durable sports watch with multiple features',
        image: 'pictures/sport watch.jpeg',
        category: 'watches',
        inStock: true
      },
      {
        id: 8,
        name: 'Gold Hoop Earrings',
        price: 60,
        description: 'Stylish gold hoop earrings in various sizes',
        image: 'pictures/hoop earing.jpeg',
        category: 'earrings',
        inStock: true
      }
    ];
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesCategory = this.selectedCategory === 'all' || product.category === this.selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesPrice = product.price <= this.priceRange;
      
      return matchesCategory && matchesSearch && matchesPrice;
    });

    this.sortProducts();
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      switch (this.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onPriceRangeChange() {
    this.applyFilters();
  }

  onSortChange() {
    this.applyFilters();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}