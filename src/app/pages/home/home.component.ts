import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.featuredProducts = [
      {
        id: 1,
        name: 'Silver Necklace',
        price: 450,
        description: 'Elegant silver necklace with gemstone',
        image: 'pictures/necklace.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 2,
        name: 'Gold Bracelet',
        price: 750,
        description: 'Beautiful gold plated bracelet',
        image: 'pictures/braclet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 3,
        name: 'Pearl Earrings',
        price: 200,
        description: 'Classic pearl stud earrings',
        image: 'pictures/earings.jpeg',
        category: 'earrings',
        inStock: true
      }
    ];
  }
}