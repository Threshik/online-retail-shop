import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  http = inject(HttpClient)
  router = inject(Router)
  cartItemList: any[] = [];

  ngOnInit(): void {
    this.showCartItems();
  }

  showCartItems() {
    this.http.get("http://localhost:8080/api/cart").subscribe({
      next: (res: any) => {
        this.cartItemList = res;
      },
      error: (err) => {
        console.log("Cart Items couldnt fetch");

      }
    })
  }

  updateQuantity(cartItemId: number, newQuantity: number) {
    this.http.put(`http://localhost:8080/api/cart/update`, {
      cartItemId,
      quantity: newQuantity
    }).subscribe({
      next: () => alert('Quantity updated!'),
      error: (err) => console.error('Failed to update quantity', err)
    });
  }

  deleteCartItem(id: number) {
    this.http.delete(`http://localhost:8080/api/cart/${id}`).subscribe({
      next: (response: any) => {
        alert('Cart Item deleted!')
        this.showCartItems();
      },
      error: (err) => console.error('Failed to remove item', err)

    })
  }

  clearCart() {
    this.http.delete("http://localhost:8080/api/cart/clear").subscribe({
      next: (res: any) => {
        alert("Cart cleared Successfully")
        this.showCartItems();
      },
      error: (err) => {
        console.error('Failed to clear cart ', err)
      }
    })
  }

  navigate() {

    this.router.navigate(['order'])


  }

  get totalItems() {
    return this.cartItemList.length;
  }

  get totalQuantity() {
    return this.cartItemList.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.cartItemList.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  }
}
