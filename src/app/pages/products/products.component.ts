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
      },
      { 
        id: 9,
        name: 'Elegant Black Leather Watch',
        price: 120,
        description: 'Stylish black leather watch with minimalist design',
        image: 'pictures/black-watch.jpeg',
        category: 'watches',
        inStock: true
      },
      {
        id: 10,
        name: 'Crystal Charm Bracelet',
        price: 55,
        description: 'Bracelet with multiple crystal charms',
        image: 'pictures/charm-bracelet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 11,
        name: 'Men’s Steel Chain',
        price: 140,
        description: 'Thick stainless steel chain for men',
        image: 'pictures/steel-chain.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 12,
        name: 'Rose Quartz Ring',
        price: 95,
        description: 'Beautiful ring with natural rose quartz stone',
        image: 'pictures/rose-quartz.jpeg',
        category: 'rings',
        inStock: true
      },
      {
        id: 13,
        name: 'Sapphire Drop Earrings',
        price: 130,
        description: 'Elegant sapphire stone drop earrings',
        image: 'pictures/sapphire-earrings.jpeg',
        category: 'earrings',
        inStock: true
      },
      {
        id: 14,
        name: 'Luxury Chrono Watch',
        price: 300,
        description: 'Premium chronograph watch with leather strap',
        image: 'pictures/chrono-watch.jpeg',
        category: 'watches',
        inStock: true
      },
      {
        id: 15,
        name: 'Thin Silver Bracelet',
        price: 40,
        description: 'Minimalist thin silver bracelet for daily wear',
        image: 'pictures/thin-bracelet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 16,
        name: 'Diamond Cut Chain',
        price: 210,
        description: 'Shiny diamond-cut gold chain',
        image: 'pictures/diamond-chain.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 17,
        name: 'Emerald Band Ring',
        price: 170,
        description: 'Gold ring with embedded emerald stones',
        image: 'pictures/emerald-ring.jpeg',
        category: 'rings',
        inStock: true
      },
      {
        id: 18,
        name: 'Pearl Drop Earrings',
        price: 85,
        description: 'Elegant pearl drop earrings for special occasions',
        image: 'pictures/pearl-drop.jpeg',
        category: 'earrings',
        inStock: true
      },
      {
        id: 19,
        name: 'Digital Sports Watch',
        price: 110,
        description: 'Water-resistant digital sports watch with LED display',
        image: 'pictures/digital-sport.jpeg',
        category: 'watches',
        inStock: true
      },
      {
        id: 20,
        name: 'Braided Leather Bracelet',
        price: 35,
        description: 'Casual braided leather bracelet for men',
        image: 'pictures/braided-bracelet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 21,
        name: 'Gold Heart Necklace',
        price: 160,
        description: 'Romantic gold heart pendant necklace',
        image: 'pictures/heart-necklace.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 22,
        name: 'Opal Spark Ring',
        price: 125,
        description: 'Opal gemstone ring with sparkly finish',
        image: 'pictures/opal-ring.jpeg',
        category: 'rings',
        inStock: true
      },
      {
        id: 23,
        name: 'Tiny Stud Earrings Set',
        price: 45,
        description: 'Set of 6 tiny stud earrings in different shapes',
        image: 'pictures/stud-set.jpeg',
        category: 'earrings',
        inStock: true
      },
      {
        id: 24,
        name: 'Military Style Watch',
        price: 150,
        description: 'Tactical military watch with rugged design',
        image: 'pictures/military-watch.jpeg',
        category: 'watches',
        inStock: true
      },
      {
        id: 25,
        name: 'Gold Bead Bracelet',
        price: 70,
        description: 'Simple bracelet with small gold beads',
        image: 'pictures/gold-bead.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 26,
        name: 'Silver Double Layer Chain',
        price: 95,
        description: 'Trendy double-layer silver chain',
        image: 'pictures/double-chain.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 27,
        name: 'Crown Ring',
        price: 60,
        description: 'Cute crown-shaped ring for a stylish look',
        image: 'pictures/crown-ring.jpeg',
        category: 'rings',
        inStock: true
      },
      {
        id: 28,
        name: 'Mini Shoulder Bag',
        price: 180,
        description: 'Trendy mini shoulder bag for accessories',
        image: 'pictures/mini-bag.jpeg',
        category: 'bags',
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