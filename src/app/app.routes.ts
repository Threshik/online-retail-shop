import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { AddProduct } from './components/add-product/add-product';
import { Order } from './components/order/order';

export const routes: Routes = [
    //default route
    {path: '', redirectTo:'product-list',pathMatch:'full'},
    
    {path: 'product-list', component: ProductList},
    {path: 'add-product', component: AddProduct},
    {path: 'order', component: Order}
];
