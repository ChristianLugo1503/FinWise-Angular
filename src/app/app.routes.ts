import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    {
        path:'', 
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children:[
            {
                path: 'home',
                loadComponent: () => import('./business/home/home.component'),
                canActivate: [authGuard]
            },
            {
                path: 'categories',
                loadComponent: () => import('./business/categories/categories.component'),
                canActivate: [authGuard]
            },
            {
                path:'',
                redirectTo: 'home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path:'login', 
        loadComponent: ()=> import('./business/auth/login/login.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path:'register', 
        loadComponent: ()=> import('./business/auth/register/register.component'),
        canActivate: [AuthenticatedGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
