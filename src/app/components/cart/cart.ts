import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../models/cart-item.model';
import { AuthHttpService } from '../../services/auth-http';

@Component({
  selector: 'app-cart',
  imports: [FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class Cart implements OnInit {
  private authHttp = inject(AuthHttpService);
  private router = inject(Router);

  cartItems: CartItem[] = [];

  ngOnInit(): void {
    this.showCartItems();
  }

  showCartItems() {
    this.authHttp.get<CartItem[]>(`${environment.apiBaseUrl}/cart`).subscribe({
      next: (res) => {
        this.cartItems = res;
      },
      error: (err) => {
        console.log("Cart Items couldn't fetch", err);
      }
    });
  }

  updateQuantity(cartItemId: number, newQuantity: number) {
    this.authHttp.put(`${environment.apiBaseUrl}/cart/update`, { cartItemId, quantity: newQuantity }).subscribe({
      next: () => alert('Quantity updated!'),
      error: (err) => console.error('Failed to update quantity', err)
    });
  }

  deleteCartItem(id: number) {
    this.authHttp.delete(`${environment.apiBaseUrl}/cart/${id}`).subscribe({
      next: () => {
        alert('Cart Item deleted!');
        this.showCartItems();
      },
      error: (err) => console.error('Failed to remove item', err)
    });
  }

  clearCart() {
    this.authHttp.delete(`${environment.apiBaseUrl}/cart/clear`).subscribe({
      next: () => {
        alert('Cart cleared Successfully');
        this.showCartItems();
      },
      error: (err) => console.error('Failed to clear cart', err)
    });
  }

  navigate() {
    this.router.navigate(['order']);
  }

  //getters
  get totalItems() {
    return this.cartItems.length;
  }

  get totalQuantity() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.cartItems.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  }
}
