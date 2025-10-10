import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CartItem } from '../../models/cart-item.model';
import { AuthHttpService } from '../../services/auth-http';

@Component({
    selector: 'app-order',
    imports: [CommonModule],
    templateUrl: './order.html',
    styleUrls: ['./order.css']
})
export class Order implements OnInit {
    private authHttp = inject(AuthHttpService);
    private router = inject(Router);

    loading: boolean = true;
    cartItems: CartItem[] = [];
    totalQuantity: number = 0;
    totalPrice: number = 0;

    ngOnInit(): void {
        this.loadCartItems();
    }

    loadCartItems() {
        this.authHttp.get<CartItem[]>(`${environment.apiBaseUrl}/cart`).subscribe({
            next: (res) => {
                this.cartItems = res;
                this.calculateTotals();
                this.loading = false;
            },
            error: (err) => {
                console.log("Failed to load cart items.", err);
                this.loading = false;
            }
        });
    }

    calculateTotals() {
        this.totalQuantity = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    placeOrder() {
        this.authHttp.post(`${environment.apiBaseUrl}/order/place`, {}).subscribe({
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
        this.router.navigate(['/product-list']);
    }
}
