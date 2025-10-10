import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ProductList } from './product-list';
import { provideHttpClient } from '@angular/common/http';

describe('ProductList', () => {
    let fixture: ComponentFixture<ProductList>;
    let component: ProductList;
    let httpTestingController: HttpTestingController;

    const mockRouter = {
        navigate: jasmine.createSpy('navigate')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProductList],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: Router, useValue: mockRouter }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductList);
        component = fixture.componentInstance;
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should create', () => {
        fixture.detectChanges();

        const req = httpTestingController.expectOne(`${environment.apiBaseUrl}/products`);
        req.flush([]);

        expect(component).toBeTruthy();
    });

    it('should load products and set loading to false', () => {
        fixture.detectChanges();

        const mockProducts = [
            { id: 1, name: 'Test Product', price: 10, description: '', image: '' }
        ];

        const req = httpTestingController.expectOne(`${environment.apiBaseUrl}/products`);
        req.flush(mockProducts);

        expect(component.products.length).toBe(1);
        expect(component.loading).toBe(false);
    });
});
