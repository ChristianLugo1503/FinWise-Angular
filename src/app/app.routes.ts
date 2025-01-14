import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthenticatedGuard } from './core/guards/authenticated.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'start', // Redirige a la ruta 'start' por defecto
    pathMatch: 'full',
  },
  {
    path: 'start',
    loadComponent: () => import('./business/start/start.component'),
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component'),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./business/home/home.component'),
        canActivate: [authGuard],
      },
      {
        path: 'recurring-payments',
        loadComponent: () =>
          import('./business/recurring-payments/recurring-payments.component'),
        canActivate: [authGuard],
      },
      {
        path: 'groups',
        loadComponent: () => import('./business/groups/groups.component'),
        canActivate: [authGuard],
      },
      {
        path: 'savings',
        loadComponent: () => import('./business/savings/savings.component'),
        canActivate: [authGuard],
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./business/categories/categories.component'),
        canActivate: [authGuard],
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./business/notifications/notifications.component'),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./business/auth/login/login.component'),
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./business/auth/register/register.component'),
    canActivate: [AuthenticatedGuard],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
