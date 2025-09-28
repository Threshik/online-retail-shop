import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cart } from './cart';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('Cart', () => {
    let component: Cart;
    let fixture: ComponentFixture<Cart>;
    let httpMock: HttpTestingController;

    const mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Cart, FormsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: Router, useValue: mockRouter }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(Cart);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load cart items from the API', () => {
        const mockItems = [
            {
                id: 17,
                product: {
                    id: 2,
                    name: "Mens Casual Premium Slim Fit T-Shirts ",
                    description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
                    price: 22.3,
                    image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png"
                },
                quantity: 1
            }
        ];


        const req = httpMock.expectOne(`${environment.apiBaseUrl}/cart`);
        expect(req.request.method).toBe('GET');

        req.flush(mockItems);

        expect(component.cartItems.length).toBe(1);
        expect(component.cartItems[0].product.name).toBe("Mens Casual Premium Slim Fit T-Shirts ");
        expect(component.cartItems[0].quantity).toBe(1);
    });
});
