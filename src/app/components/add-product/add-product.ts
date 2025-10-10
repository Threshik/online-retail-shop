import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { AuthHttpService } from '../../services/auth-http';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css']
})
export class AddProduct implements OnInit {
  private authHttp = inject(AuthHttpService);
  private router = inject(Router);

  productAddForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    description: new FormControl('', [Validators.required]),
    image: new FormControl('', [Validators.required])
  });

  loading = true;

  ngOnInit(): void {
    this.loading = false;
  }

  async addProducts() {
    if (this.productAddForm.invalid) {
      this.productAddForm.markAllAsTouched();
      return;
    }

    const formValue = this.productAddForm.value;

    this.authHttp.post(`${environment.apiBaseUrl}/products`, formValue).subscribe({
      next: () => {
        alert('The product added successfully');
        this.router.navigate(['product-list']);
      },
      error: (err) => {
        console.error('Creation of product failed', err);
        if (err.status === 401) {
          alert('Unauthorized: Your session may have expired. Please login again.');
        }
      }
    });
  }

  onReset() {
    this.productAddForm.reset();
  }
}
