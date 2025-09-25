import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-order',
    imports: [CommonModule],
    templateUrl: './order.html',
    styleUrl: './order.css'
})
export class Order implements OnInit {
    http = inject(HttpClient)
    router = inject(Router)
    loading: boolean = true;

    cartItems: any[] = [];
    totalQuantity: number = 0;
    totalPrice: number = 0;


    ngOnInit(): void {
        this.loadCartItems()

    }


    loadCartItems() {
        this.http.get("http://localhost:8080/api/cart").subscribe({
            next: (res: any) => {
                this.cartItems = res;
                this.calculateTotals();
                this.loading = false;
            },
            error: (err) => {
                console.log("Failed to load cart items.");
                this.loading = false;

            }
        })
    }

    calculateTotals() {
        this.totalQuantity = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    placeOrder() {
        this.http.post('http://localhost:8080/api/orders/place', {}).subscribe({
            next: () => {
                alert('Order placed successfully!');
                this.router.navigate(['product-list']);
            },
            error: (err) => {
                alert(err.error || 'Failed to place order.');
            }
        });
    }

    goToProductList() {
        this.router.navigate(['/product-list'])
    }

}
