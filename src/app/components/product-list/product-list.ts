import { NgClass, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink, NgClass, NgStyle, FormsModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit {
  http = inject(HttpClient);
  productList: any[] = [];
  cartItemList: any[] = [];
  loading = true;
  isEditing = false;
  router = inject(Router)
  productObj: any = {

    "name": "",
    "price": 0,
    "description": "",
    "image": ""
  }

  ngOnInit(): void {

    this.getProducts();
  }

  getProducts() {
    this.http.get("http://localhost:8080/api/products").subscribe({
      next: (result: any) => {
        this.productList = result;
        this.loading = false;
      },
      error: (err) => {
        console.log('Error fetching products', err);
        this.loading = false;
      }
    })
  }

  getAllCartItems() {
    this.http.get("http://localhost:8080/api/cart").subscribe({
      next: (res: any) => {
        this.cartItemList = res;
        this.loading = false;

      },
      error: (err) => {
        console.log('Error fetching cart items', err);
        this.loading = false;
      }

    })
  }

  deleteProduct(id: number) {
    const del = confirm("Are you sure to delete the product")
    if (del) {
      this.http.delete(`http://localhost:8080/api/products/${id}`).subscribe({
        next: () => {
          alert("The Product is deleted successfully");
          this.getProducts();
        },
        error: (err) => {
          console.log("Failed to delete the product", err);
        }
      });
    }


  }

  selectProductForEdit(product: any) {
    this.productObj = { ...product };
    this.isEditing = true;
  }

  updateProduct() {
    if (!this.productObj.id) {
      alert("Invalid product ID.");
      return;
    }

    this.http.put(`http://localhost:8080/api/products/${this.productObj.id}`, this.productObj).subscribe({
      next: (res: any) => {
        alert("The product updated successfully");
        this.isEditing = false;
        this.getProducts();
      },
      error: (err) => {
        console.log("Updation of product failed", err);
      }
    });



  }

  closeDialog() {
    this.isEditing = false;
    this.productObj = {
      "name": "",
      "price": 0,
      "description": "",
      "image": ""
    };
  }

  addToCart(id: number) {
    const quantity = 1;
    this.http.post(`http://localhost:8080/api/cart/add?productId=${id}&quantity=${quantity}`, null).subscribe({
      next: (res: any) => {
        alert(res.message);

      },
      error: (err) => {
        console.log("Failed to add cart item", err);
      }
    });





  }
}

