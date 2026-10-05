import { Routes } from '@angular/router';
import { authGuard } from './admin/core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/layout/public-layout').then((m) => m.PublicLayout),
    children: [
      {
        path: '',
        loadComponent: () => import('./public/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'consulta-folio',
        loadComponent: () =>
          import('./public/consulta-folio/consulta-folio').then((m) => m.ConsultaFolio),
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./public/nosotros/nosotros').then((m) => m.Nosotros),
      },
    ],
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./admin/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/layout/admin-layout').then((m) => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./admin/clientes/clientes').then((m) => m.Clientes),
      },
      {
        path: 'clientes/:id',
        loadComponent: () =>
          import('./admin/clientes/cliente-detail/cliente-detail').then((m) => m.ClienteDetail),
      },
      {
        path: 'equipos',
        loadComponent: () => import('./admin/equipos/equipos').then((m) => m.Equipos),
      },
      {
        path: 'tecnicos',
        loadComponent: () => import('./admin/tecnicos/tecnicos').then((m) => m.Tecnicos),
      },
      {
        path: 'ordenes',
        loadComponent: () =>
          import('./admin/ordenes/ordenes-list/ordenes-list').then((m) => m.OrdenesList),
      },
      {
        path: 'ordenes/:id',
        loadComponent: () =>
          import('./admin/ordenes/orden-detail/orden-detail').then((m) => m.OrdenDetail),
      },
    ],
  },
];
