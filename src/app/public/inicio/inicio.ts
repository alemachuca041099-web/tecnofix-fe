import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';
import { Promos } from '../promos/promos';

interface Servicio {
  numero: string;
  icono: string;
  titulo: string;
  resumen: string;
  imagen: string;
  items: string[];
}

interface PasoProceso {
  numero: string;
  titulo: string;
  descripcion: string;
}

interface Razon {
  icono: string;
  titulo: string;
  descripcion: string;
}

const SERVICIOS: Servicio[] = [
  {
    numero: '01',
    icono: 'desktop_windows',
    titulo: 'Computadoras',
    resumen: 'Nuestro servicio más solicitado: de escritorio, laptop y All-in-One, de cualquier marca.',
    imagen: 'img/gallery-macbook.jpg',
    items: [
      'PC de escritorio, laptop y All-in-One',
      'Diagnóstico y mantenimiento preventivo',
      'Reparación y cambio de componentes',
      'Cambio de disco a SSD y ampliación de RAM',
      'Formateo, respaldo e instalación de software',
      'Limpieza interna y cambio de pasta térmica',
      'Eliminación de virus y malware',
    ],
  },
  {
    numero: '02',
    icono: 'print',
    titulo: 'Impresoras',
    resumen: 'Láser, tinta o multifuncional: diagnóstico, limpieza y puesta a punto.',
    imagen: 'img/gallery-circuit-macro.jpg',
    items: [
      'Diagnóstico y limpieza de cabezales',
      'Mantenimiento preventivo',
      'Configuración en red y wifi',
      'Reparación de mecanismos de arrastre',
      'Instalación y puesta a punto',
    ],
  },
  {
    numero: '03',
    icono: 'smartphone',
    titulo: 'Celulares',
    resumen: 'iOS y Android: desde una pantalla rota hasta un diagnóstico completo del equipo.',
    imagen: 'img/gallery-phone.jpg',
    items: [
      'Cambio de pantalla y batería',
      'Cambio de centro de carga',
      'Reparación de botones físicos',
      'Problemas de audio, micrófono o bocina',
      'Problemas de cámara',
      'Formateo y configuración',
      'Diagnóstico de software',
    ],
  },
  {
    numero: '04',
    icono: 'tablet_mac',
    titulo: 'Tablets',
    resumen: 'El mismo cuidado que a los celulares, adaptado a cada modelo de tablet.',
    imagen: 'img/gallery-laptops-hands.jpg',
    items: [
      'Diagnóstico general',
      'Cambio de pantalla y batería',
      'Cambio de centro de carga',
      'Actualización y mantenimiento de software',
      'Otras reparaciones según el modelo',
    ],
  },
  {
    numero: '05',
    icono: 'wifi',
    titulo: 'Redes',
    resumen: 'Para que la señal llegue a todos lados, en casa o en el negocio.',
    imagen: 'img/gallery-network.jpg',
    items: [
      'Instalación de redes domésticas y de oficina',
      'Configuración de router y access points',
      'Optimización de cobertura wifi',
      'Cableado estructurado',
      'Soporte y diagnóstico de fallas de conexión',
    ],
  },
  {
    numero: '06',
    icono: 'videocam',
    titulo: 'Cámaras',
    resumen: 'Videovigilancia para el hogar o el negocio, instalada y configurada de principio a fin.',
    imagen: 'img/gallery-repair-hands.jpg',
    items: [
      'Instalación de cámaras de videovigilancia',
      'Configuración de grabación y acceso remoto',
      'Mantenimiento de equipos existentes',
      'Soporte y diagnóstico de fallas',
    ],
  },
];

const PROCESO: PasoProceso[] = [
  { numero: '01', titulo: 'Recibimos tu equipo', descripcion: 'Se registra el equipo y se genera un folio único de seguimiento.' },
  { numero: '02', titulo: 'Diagnóstico', descripcion: 'Revisamos el equipo a fondo para encontrar la causa real del problema.' },
  { numero: '03', titulo: 'Autorización', descripcion: 'Te informamos el trabajo y el costo. No tocamos nada sin tu visto bueno.' },
  { numero: '04', titulo: 'Reparación', descripcion: 'Se realiza el servicio acordado, con piezas de calidad.' },
  { numero: '05', titulo: 'Listo', descripcion: 'El equipo queda probado y preparado para entrega.' },
  { numero: '06', titulo: 'Entrega', descripcion: 'Recibes tu equipo, tu comprobante y, si aplica, tu garantía por escrito.' },
];

const RAZONES: Razon[] = [
  {
    icono: 'fact_check',
    titulo: 'Diagnóstico transparente',
    descripcion: 'Te decimos qué tiene el equipo y cuánto cuesta arreglarlo antes de empezar. Sin sorpresas en la cuenta.',
  },
  {
    icono: 'confirmation_number',
    titulo: 'Seguimiento por folio',
    descripcion: 'Cada equipo recibe un folio único. Consulta su estado en línea cuando quieras, sin tener que llamar.',
  },
  {
    icono: 'verified',
    titulo: 'Garantía por escrito',
    descripcion: 'Las reparaciones quedan documentadas con condiciones y vigencia claras en tu comprobante de entrega.',
  },
  {
    icono: 'groups',
    titulo: 'Red de técnicos',
    descripcion: 'Trabajamos con técnicos propios y asociados capacitados, según el tipo de equipo y servicio.',
  },
];

const MARCAS = ['Dell', 'HP', 'Lenovo', 'Apple', 'Samsung', 'Asus', 'Acer', 'Epson', 'Canon', 'TP-Link', 'Xiaomi', 'Motorola'];

@Component({
  selector: 'tf-inicio',
  imports: [RouterLink, RevealDirective, Promos],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  protected readonly servicios = SERVICIOS;
  protected readonly proceso = PROCESO;
  protected readonly razones = RAZONES;
  protected readonly marcas = MARCAS;
  protected readonly servicioSeleccionado = signal<Servicio | null>(null);

  // Parallax del laptop del hero: se mueve más lento que el scroll (factor
  // 0.22) hasta un tope, para dar sensación de profundidad sin marear. Se
  // aplica vía la custom property --tf-par en vez de vincular [style.transform]
  // directo, porque translate/transform son propiedades CSS independientes:
  // así no pisa la animación de flotación (tf-float) que ya usa transform.
  protected readonly heroParallax = signal(0);
  private readonly parallaxMax = 70;
  private readonly parallaxFactor = 0.22;

  @HostListener('window:scroll')
  protected onScroll(): void {
    const offset = Math.min(window.scrollY * this.parallaxFactor, this.parallaxMax);
    this.heroParallax.set(offset);
  }

  // Carrusel de servicios en móvil: puntos que reflejan la tarjeta activa
  // y permiten saltar a una en concreto — sin esto, la única pista de que
  // se puede deslizar era ver la siguiente tarjeta asomando por el borde.
  protected readonly servicioActivo = signal(0);

  protected onServiciosScroll(el: HTMLElement): void {
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const progreso = el.scrollLeft / maxScroll;
    const indice = Math.round(progreso * (this.servicios.length - 1));
    this.servicioActivo.set(indice);
  }

  protected irAServicio(el: HTMLElement, indice: number): void {
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (maxScroll * indice) / (this.servicios.length - 1), behavior: 'smooth' });
  }

  // Mismo patrón para el carrusel de "Cómo trabajamos" en móvil.
  protected readonly pasoActivo = signal(0);

  protected onProcesoScroll(el: HTMLElement): void {
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const progreso = el.scrollLeft / maxScroll;
    const indice = Math.round(progreso * (this.proceso.length - 1));
    this.pasoActivo.set(indice);
  }

  protected irAPaso(el: HTMLElement, indice: number): void {
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: (maxScroll * indice) / (this.proceso.length - 1), behavior: 'smooth' });
  }

  protected abrirServicio(servicio: Servicio): void {
    this.servicioSeleccionado.set(servicio);
    document.body.style.overflow = 'hidden';
  }

  protected cerrarServicio(): void {
    this.servicioSeleccionado.set(null);
    document.body.style.overflow = '';
  }
}
