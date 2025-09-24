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
  isEditing = false;
  productObj: any = {
    "id": 0,
    "title": "",
    "price": 0,
    "description": "",
    "category": "",
    "image": ""
  }

  ngOnInit(): void {

    this.getProducts();
  }

  getProducts() {
    this.http.get("http://localhost:4000/products").subscribe({
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

  deleteProduct(id: number) {
    this.http.delete(`http://localhost:4000/products/${id}`).subscribe({
      next: () => {
        alert("The Product is deleted successfully");
        this.getProducts(); // optionally refresh list
      },
      error: (err) => {
        console.log("Failed to delete the product", err);
      }
    });

  }

  selectProductForEdit(product: any) {
    this.productObj = { ...product };
    this.isEditing = true;
  }

  updateProduct(product: any) {
    if (!this.productObj.id) {
      alert("Invalid product ID.");
      return;
    }

    this.http.put(`http://localhost:4000/products/${this.productObj.id}`, this.productObj).subscribe({
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
      id: 0,
      title: "",
      price: 0,
      description: "",
      category: "",
      image: ""
    };
  }
}

