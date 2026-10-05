import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ConfirmDialog } from '../core/confirm-dialog/confirm-dialog';

const ENLACES = [
  { ruta: '/admin/dashboard', etiqueta: 'Dashboard', icono: 'dashboard' },
  { ruta: '/admin/clientes', etiqueta: 'Clientes', icono: 'groups' },
  { ruta: '/admin/equipos', etiqueta: 'Equipos', icono: 'devices' },
  { ruta: '/admin/ordenes', etiqueta: 'Órdenes de servicio', icono: 'assignment' },
  { ruta: '/admin/tecnicos', etiqueta: 'Técnicos', icono: 'engineering' },
  { ruta: '/admin/reportes', etiqueta: 'Reportes', icono: 'bar_chart' },
];

@Component({
  selector: 'tf-admin-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ConfirmDialog],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  protected readonly enlaces = ENLACES;
  protected readonly menuMovilAbierto = signal(false);

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  protected get usuario() {
    return this.auth.usuario();
  }

  protected alternarMenu(): void {
    this.menuMovilAbierto.update((v) => !v);
  }

  protected cerrarMenu(): void {
    this.menuMovilAbierto.set(false);
  }

  protected salir(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
