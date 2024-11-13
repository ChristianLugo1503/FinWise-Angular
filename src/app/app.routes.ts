import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';

export const routes: Routes = [
    {
        path:'', 
        loadComponent: () => import('./shared/components/layout/layout.component'),
        children:[
            {
                path: 'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard.component'),
                canActivate: [authGuard]
            },
            {
                path:'',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path:'login', 
        loadComponent: ()=> import('./business/auth/login/login.component'),
        canActivate: [authenticatedGuard]
    },
    {path:'register', loadComponent: ()=> import('./business/auth/register/register.component')},
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
