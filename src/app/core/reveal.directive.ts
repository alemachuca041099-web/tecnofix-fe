import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

// Añade .is-in cuando el elemento entra en viewport (una sola vez), para
// combinar con la clase utilitaria .tf-reveal de styles.scss. Deliberadamente
// simple (sin Lenis/parallax como en el sitio hermano ZELYON): este es un
// panel operativo, no un sitio de portafolio, así que solo se toma el
// lenguaje visual (fade + translateY), no la maquinaria de scroll completa.
@Directive({
  selector: '[tfReveal]',
  standalone: true,
  host: { class: 'tf-reveal' },
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input() tfRevealDelay = 0;

  private observer?: IntersectionObserver;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (this.tfRevealDelay > 0) {
      this.el.nativeElement.style.transitionDelay = `${this.tfRevealDelay}ms`;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.el.nativeElement.classList.add('is-in');
            this.observer?.unobserve(this.el.nativeElement);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
