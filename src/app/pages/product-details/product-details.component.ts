import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';
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
        price: 450,
        description: 'Elegant silver necklace with genuine diamond pendant. Perfect for special occasions and evening wear.',
        image: 'pictures/necklace.jpeg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 2,
        name: 'Gold Plated Bracelet',
        price: 750,
        description: 'Beautiful gold plated bracelet with intricate design. Features delicate patterns and secure clasp.',
        image: 'pictures/braclet.jpeg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 3,
        name: 'Pearl Stud Earrings',
        price: 200,
        description: 'Classic pearl stud earrings for everyday wear. Hypoallergenic and comfortable for sensitive ears.',
        image: 'pictures/earings.jpeg',
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
        image: 'assets/necklace2.jpg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 6,
        name: 'Rose Gold Ring',
        price: 55,
        description: 'Delicate rose gold ring with crystal accent. Adjustable sizing for perfect fit.',
        image: 'assets/ring.jpg',
        category: 'rings',
        inStock: true
      },
         {
      id: 7,
      name: 'Sports Watch',
      price: 95,
      description: 'Durable sports watch built for active lifestyles, featuring multiple functions and a comfortable strap.',
      image: 'pictures/sport watch.jpeg',
      category: 'watches',
      inStock: true
    },
    {
      id: 8,
      name: 'Gold Hoop Earrings',
      price: 60,
      description: 'Stylish gold hoop earrings available in multiple sizes—lightweight, trendy, and perfect for everyday wear.',
      image: 'pictures/hoop earing.jpeg',
      category: 'earrings',
      inStock: true
    },
        {
      id: 9,
      name: 'Elegant Black Leather Watch',
      price: 120,
      description: 'Sophisticated watch featuring a black leather strap and minimalist design suited for both casual and formal outfits.',
      image: 'pictures/blck watch.jpg',
      category: 'watches',
      inStock: true
    },
    {
      id: 10,
      name: 'Crystal Charm Bracelet',
      price: 55,
      description: 'Beautiful bracelet adorned with multiple crystal charms that add sparkle and elegance to your look.',
      image: 'pictures/crystal.jpeg',
      category: 'bracelets',
      inStock: true
    },
      {
      id: 11,
      name: 'Men’s Steel Chain',
      price: 140,
      description: 'Thick stainless-steel chain designed for men, delivering strength, durability, and bold style.',
      image: 'pictures/men.jpeg',
      category: 'necklaces',
      inStock: true
    },
    {
      id: 12,
      name: 'Blue Quartz Ring',
      price: 95,
      description: 'Stunning ring crafted with natural blue quartz stone, perfect for adding a touch of elegance and color.',
      image: 'pictures/blue.jpeg',
      category: 'rings',
      inStock: true
    },
       {
      id: 13,
      name: 'Sapphire Drop Earrings',
      price: 130,
      description: 'Elegant drop earrings featuring sapphire-inspired stones that bring sophistication and charm to any look.',
      image: 'pictures/green crystal.jpg',
      category: 'earrings',
      inStock: true
    },
    {
      id: 14,
      name: 'Luxury Chrono Watch',
      price: 300,
      description: 'High-end chronograph watch with a genuine leather strap, offering precise performance and luxurious details.',
      image: 'pictures/leather_strap.jpeg',
      category: 'watches',
      inStock: true
    },
       {
      id: 15,
      name: 'Thin Silver Bracelet',
      price: 40,
      description: 'Minimalist thin silver bracelet crafted for simplicity and elegance—perfect for daily wear.',
      image: 'pictures/daily.jpeg',
      category: 'bracelets',
      inStock: true
    },
    {
      id: 16,
      name: 'Diamond Cut Chain',
      price: 210,
      description: 'Shiny diamond-cut gold chain that reflects light beautifully, adding glamour to any outfit.',
      image: 'pictures/gold.jpeg',
      category: 'necklaces',
      inStock: true
    },
        {
      id: 17,
      name: 'Emerald Band Ring',
      price: 170,
      description: 'Stunning gold band ring with embedded emerald stones, crafted for beauty and timeless charm.',
      image: 'pictures/emerald_ring.jpeg',
      category: 'rings',
      inStock: true
    },
    {
      id: 18,
      name: 'Pearl Drop Earrings',
      price: 85,
      description: 'Elegant pearl drop earrings perfect for weddings, formal events, or elegant everyday fashion.',
      image: 'pictures/pearl_drop.jpeg',
      category: 'earrings',
      inStock: true
    },
        {
      id: 19,
      name: 'Digital Sports Watch',
      price: 110,
      description: 'Water-resistant digital sports watch with an LED display, designed for performance and reliability.',
      image: 'pictures/digital_sport.jpeg',
      category: 'watches',
      inStock: true
    },
    {
      id: 20,
      name: 'Braided Leather Bracelet',
      price: 35,
      description: 'Casual braided leather bracelet for men, offering rugged style and versatility for everyday outfits.',
      image: 'pictures/braided_bracelet.jpeg',
      category: 'bracelets',
      inStock: true
    },
        {
      id: 21,
      name: 'Gold Heart Necklace',
      price: 160,
      description: 'Romantic gold necklace featuring a heart-shaped pendant—perfect as a meaningful gift.',
      image: 'pictures/my_lovely_one.jpeg',
      category: 'necklaces',
      inStock: true
    },
    {
      id: 22,
      name: 'Opal Spark Ring',
      price: 125,
      description: 'Opal gemstone ring with a shimmering finish that changes beautifully under different lighting.',
      image: 'pictures/opal_ring.jpeg',
      category: 'rings',
      inStock: true
    },
       {
      id: 23,
      name: 'Military Style Watch',
      price: 150,
      description: 'Tactical military-style watch built for durability, featuring a rugged design ideal for outdoor use.',
      image: 'pictures/military_watch.jpeg',
      category: 'watches',
      inStock: true
    },
    {
      id: 24,
      name: 'Gold Bead Bracelet',
      price: 70,
      description: 'Simple and elegant bracelet made with small gold beads, perfect for stacking or wearing alone.',
      image: 'pictures/gold_bead.jpeg',
      category: 'bracelets',
      inStock: true
    },
       {
      id: 25,
      name: 'Silver Double Layer Chain',
      price: 95,
      description: 'Trendy two-layer silver chain designed to add depth, shine, and modern elegance to your outfit.',
      image: 'pictures/double_chain.png',
      category: 'necklaces',
      inStock: true
    },
    {
      id: 26,
      name: 'Crown Ring',
      price: 60,
      description: 'Charming crown-shaped ring crafted for a cute, stylish, and royal-inspired look.',
      image: 'pictures/crown_ring.jpeg',
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
        price: 45,
        description: 'Elegant silver necklace with diamond pendant',
        image: 'assets/necklace.jpg',
        category: 'necklaces',
        inStock: true
      },
      {
        id: 2,
        name: 'Gold Plated Bracelet',
        price: 75,
        description: 'Beautiful gold plated bracelet',
        image: 'assets/bracelet.jpg',
        category: 'bracelets',
        inStock: true
      },
      {
        id: 5,
        name: 'Silver Chain Necklace',
        price: 28,
        description: 'Simple silver chain necklace',
        image: 'assets/necklace2.jpg',
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