import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  http = inject(HttpClient);
  productList: any[] = [];
  loading = true;

  ngOnInit(): void {
    debugger;
    this.getProducts();
  }

  getProducts() {
    this.http.get("https://fakestoreapi.com/products").subscribe({
      next: (result: any) => {
        this.productList = result;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products', err);
        this.loading = false;
      }
    });
  }
}
