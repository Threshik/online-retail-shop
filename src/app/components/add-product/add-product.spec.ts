//this is used to write the test files for the components 
// testbed is used to create the component and test them  - angular test environemnt
//testing tools: jasmine(testing framework), karma(test runner)
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProduct } from './add-product';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('AddProduct', () => {
  let component: AddProduct;
  let fixture: ComponentFixture<AddProduct>;
  let httpMock: HttpTestingController;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [AddProduct], // standalone component
      providers: [
        importProvidersFrom(ReactiveFormsModule),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProduct);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });
  //testing whether the component is created
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // when the form is empty it is meant to be invalid all the details are req to be filled
  it('should have an invalid form when empty', () => {
    expect(component.productAddForm.valid).toBeFalse();
  });
  //the form is valid when they filla all the values correctly
  it('should have a valid form when correctly filled', () => {
    component.productAddForm.setValue({
      name: 'Phone',
      price: 1000,
      description: 'Smartphone',
      image: 'https://image.url'
    });
    expect(component.productAddForm.valid).toBeTrue();
  });
  //test it calls the api when it is submitted
  it('should call API and navigate after successful product add', () => {
    component.productAddForm.setValue({
      name: 'Phone',
      price: 1000,
      description: 'Smartphone',
      image: 'https://image.url'
    });

    component.addProducts();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/products`);
    expect(req.request.method).toBe('POST');
    req.flush({}); // mock successful response

    expect(mockRouter.navigate).toHaveBeenCalledWith(['product-list']);
  });
  //test case for testing whether the form is resetting thr values
  it('should reset the form', () => {
    component.productAddForm.setValue({
      name: 'Test product',
      price: 50,
      description: 'Test description',
      image: 'http://image.url'
    });

    component.onReset();

    expect(component.productAddForm.value).toEqual({
      name: null,
      price: null,
      description: null,
      image: null
    });
  });
});
