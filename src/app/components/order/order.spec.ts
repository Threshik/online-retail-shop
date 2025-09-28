import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Order } from './order';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('Order', () => {
    let component: Order;
    let fixture: ComponentFixture<Order>;
    let httpMock: HttpTestingController;
    let mockRouter: any;

    const mockCartItems = [
        {
            id: 1,
            product: {
                id: 101,
                name: 'Test Product',
                price: 50,
                description: 'A product',
                image: 'http://image.url',
            },
            quantity: 2,
        },
        {
            id: 2,
            product: {
                id: 102,
                name: 'Another Product',
                price: 30,
                description: 'Another product',
                image: 'http://image2.url',
            },
            quantity: 1,
        },
    ];

    beforeEach(async () => {
        mockRouter = {
            navigate: jasmine.createSpy('navigate')
        };
        await TestBed.configureTestingModule({
            imports: [Order,],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: Router, useValue: mockRouter }
            ],
        })
            .compileComponents();

        fixture = TestBed.createComponent(Order);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    it('should create', () => {
        const req = httpMock.expectOne(`${environment.apiBaseUrl}/cart`);
        req.flush([]);
        expect(component).toBeTruthy();
    });

    it('should load cart items and calculate totals', () => {
        const req = httpMock.expectOne(`${environment.apiBaseUrl}/cart`);
        expect(req.request.method).toBe('GET');

        req.flush(mockCartItems);

        expect(component.cartItems.length).toBe(2);
        expect(component.totalQuantity).toBe(3);
        expect(component.totalPrice).toBe(130);
        expect(component.loading).toBeFalse();
    });

    it('should place order and navigate on success', () => {
        // flush initial cart GET request
        httpMock.expectOne(`${environment.apiBaseUrl}/cart`).flush([]);

        component.placeOrder();

        const req = httpMock.expectOne(`${environment.apiBaseUrl}/orders/place`);
        expect(req.request.method).toBe('POST');

        req.flush({}); // simulate success response

        expect(mockRouter.navigate).toHaveBeenCalledWith(['product-list']);
    });

    afterEach(() => {
        httpMock.verify();
    });
});
