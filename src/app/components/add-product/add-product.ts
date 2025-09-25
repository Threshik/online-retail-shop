import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  imports: [FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {
  http = inject(HttpClient)
  router = inject(Router)
  userList: any[] = [];
  productObj: any = {
    "name": "",
    "price": '',
    "description": "",
    "image": ""
  }
  loading = true;

  ngOnInit(): void {
    this.loading = false;
  }



  addProducts() {
    this.http.post("http://localhost:8080/api/products", this.productObj).subscribe({
      next: (res: any) => {
        alert("The product added successfully");
        this.productObj = {
          "name": "",
          "price": 0,
          "description": "",
          "image": ""
        }

        //like when we add a product after adding it we get a alert and then it navigates to the product list page
        this.router.navigate(['product-list'])

      },
      error: (err) => {
        console.log("Creation of product failed")
      }
    })
  }

  onReset() {
    this.productObj = {
      "name": "",
      "price": 0,
      "description": "",
      "image": ""
    }
  }



}
