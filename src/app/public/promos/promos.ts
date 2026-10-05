import { Component, ElementRef, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Promo {
  badge: string;
  tag: string;
  titulo: string;
  acento: string;
  descripcion: string;
  imagen: string;
}

// Contenido de arranque: TecnoFix es un negocio nuevo, así que estos son
// compromisos de servicio (no descuentos con fecha de vencimiento
// inventada). Editar con condiciones reales antes de publicar.
const PROMOS: Promo[] = [
  {
    badge: 'Todo el año',
    tag: 'Diagnóstico',
    titulo: 'Diagnóstico',
    acento: 'sin costo',
    descripcion:
      'Revisamos tu equipo y te decimos qué tiene y cuánto cuesta arreglarlo antes de cobrarte nada. Tú decides si autorizas el servicio.',
    imagen: 'img/gallery-repair-hands.jpg',
  },
  {
    badge: 'Negocios',
    tag: 'Servicio empresarial',
    titulo: 'Soporte para',
    acento: 'tu negocio',
    descripcion:
      'Cómputo, redes y cámaras para pequeños negocios y oficinas. Un solo contacto para varios equipos, con folio y seguimiento para cada uno.',
    imagen: 'img/gallery-network.jpg',
  },
  {
    badge: 'Clientes TecnoFix',
    tag: 'Referidos',
    titulo: 'Trae a alguien',
    acento: 'más',
    descripcion:
      'Si nos recomiendas con alguien y trae su equipo, pregunta por el beneficio disponible en tu próximo servicio.',
    imagen: 'img/gallery-laptops-hands.jpg',
  },
];

@Component({
  selector: 'tf-promos',
  imports: [RouterLink],
  templateUrl: './promos.html',
  styleUrl: './promos.scss',
})
export class Promos implements OnInit, OnDestroy {
  protected readonly promos = PROMOS;
  protected readonly indice = signal(0);
  protected readonly reproduciendo = signal(true);

  private temporizador?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;
  private visible = false;
  private xInicial = 0;
  private arrastrando = false;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible === this.visible) return;
        this.visible = visible;
        this.armar();
      },
      { threshold: 0.3 }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    clearInterval(this.temporizador);
    this.observer?.disconnect();
  }

  private armar(): void {
    clearInterval(this.temporizador);
    if (!this.reproduciendo() || !this.visible || this.promos.length < 2) return;
    this.temporizador = setInterval(() => this.avanzar(), 6000);
  }

  private avanzar(): void {
    this.indice.set((this.indice() + 1) % this.promos.length);
  }

  protected ir(delta: number): void {
    const n = this.promos.length;
    this.indice.set((this.indice() + delta + n) % n);
    this.armar();
  }

  protected irA(i: number): void {
    this.indice.set(i);
    this.armar();
  }

  protected pausar(): void {
    this.reproduciendo.set(false);
    this.armar();
  }

  protected reanudar(): void {
    this.reproduciendo.set(true);
    this.armar();
  }

  protected onPointerDown(evento: PointerEvent): void {
    this.xInicial = evento.clientX;
    this.arrastrando = true;
  }

  protected onPointerUp(evento: PointerEvent): void {
    if (!this.arrastrando) return;
    this.arrastrando = false;
    const delta = evento.clientX - this.xInicial;
    if (Math.abs(delta) > 44) this.ir(delta < 0 ? 1 : -1);
  }
}
