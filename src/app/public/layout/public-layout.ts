import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

const ENLACES = [
  { ruta: '/', fragmento: 'servicios', etiqueta: 'Servicios', icono: 'build' },
  { ruta: '/nosotros', fragmento: undefined, etiqueta: 'Nosotros', icono: 'groups' },
  { ruta: '/', fragmento: 'proceso', etiqueta: 'Proceso', icono: 'timeline' },
  { ruta: '/', fragmento: 'contacto', etiqueta: 'Contacto', icono: 'mail' },
  { ruta: '/consulta-folio', fragmento: undefined, etiqueta: 'Consultar folio', icono: 'confirmation_number' },
];

@Component({
  selector: 'tf-public-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.scss',
})
export class PublicLayout {
  protected readonly menuAbierto = signal(false);
  protected readonly mostrarArriba = signal(false);
  protected readonly enlaces = ENLACES;

  protected alternarMenu(): void {
    const abierto = !this.menuAbierto();
    this.menuAbierto.set(abierto);
    document.body.style.overflow = abierto ? 'hidden' : '';
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
    document.body.style.overflow = '';
  }

  protected irArriba(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll')
  protected onScroll(): void {
    this.mostrarArriba.set(window.scrollY > 640);
  }
}
