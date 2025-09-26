import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.css'
})
export class AddProduct implements OnInit {
  http = inject(HttpClient)
  router = inject(Router)
  

  productAddForm: FormGroup = new FormGroup({
    name: new FormControl("", [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    description: new FormControl("", [Validators.required]),
    image: new FormControl("", [Validators.required])
  })

  loading = true;

  ngOnInit(): void {
    this.loading = false;
  }

  addProducts() {
    if (this.productAddForm.invalid) {
      this.productAddForm.markAllAsTouched();
      return;
    }
    const formValue = this.productAddForm.value;
    this.http.post(`${environment.apiBaseUrl}/products`, formValue).subscribe({
      next: (res: any) => {
        alert("The product added successfully");
        //like when we add a product after adding it we get a alert and then it navigates to the product list page
        this.router.navigate(['product-list'])

      },
      error: (err) => {
        console.log("Creation of product failed")
      }
    })
  }

  onReset() {
    this.productAddForm.reset();
  }



}
