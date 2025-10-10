import { NgClass, NgStyle } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';
import { CartItem } from '../../models/cart-item.model';
import { AuthHttpService } from '../../services/auth-http';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, NgClass, NgStyle, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductList implements OnInit {
  private authHttp = inject(AuthHttpService);
  private router = inject(Router);

  cartItems: CartItem[] = [];
  products: Product[] = [];

  loading = true;
  isEditing = false;

  selectedProduct: Product = {
    name: '',
    price: 0,
    description: '',
    image: ''
  };

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {

    this.authHttp.get<Product[]>(`${environment.apiBaseUrl}/products`).subscribe({
      next: (result) => {
        this.products = result;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching products', err);
        this.loading = false;
      }
    });
  }

  deleteProduct(id: number) {
    const del = confirm('Are you sure to delete the product?');
    if (del) {
      this.authHttp.delete(`${environment.apiBaseUrl}/products/${id}`).subscribe({
        next: () => {
          alert('The Product is deleted successfully');
          this.getProducts();
        },
        error: (err) => {
          console.log('Failed to delete the product', err);
        }
      });
    }
  }

  selectProductForEdit(product: Product) {
    this.selectedProduct = { ...product };
    this.isEditing = true;
  }

  updateProduct() {
    if (!this.selectedProduct.id) {
      alert('Invalid product ID.');
      return;
    }

    this.authHttp.put(`${environment.apiBaseUrl}/products/${this.selectedProduct.id}`, this.selectedProduct)
      .subscribe({
        next: () => {
          alert('The product updated successfully');
          this.isEditing = false;
          this.getProducts();
        },
        error: (err) => {
          console.log('Updation of product failed', err);
        }
      });
  }

  closeDialog() {
    this.isEditing = false;
    this.selectedProduct = {
      name: '',
      price: 0,
      description: '',
      image: ''
    };
  }

  addToCart(id: number) {
    const quantity = 1;
    this.authHttp.post<{ message: string }>(
      `${environment.apiBaseUrl}/cart/add?productId=${id}&quantity=${quantity}`,
      null
    ).subscribe({
      next: (res) => {
        alert(res.message);
      },
      error: (err) => {
        console.log('Failed to add cart item', err);
      }
    });
  }

  getAllCartItems() {
    this.authHttp.get<CartItem[]>(`${environment.apiBaseUrl}/cart`).subscribe({
      next: (res) => {
        this.cartItems = res;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching cart items', err);
        this.loading = false;
      }
    });
  }
}
