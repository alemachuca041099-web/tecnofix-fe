import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ESTADOS_ORDEN, EstadoOrden, OrdenServicio } from '../core/models';
import { OrdenesService } from '../core/ordenes.service';

function primerDiaDelMes(): string {
  const hoy = new Date();
  return new Date(hoy.getFullYear(), hoy.getMonth(), 1).toISOString().slice(0, 10);
}

function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}

@Component({
  selector: 'tf-reportes',
  imports: [FormsModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements OnInit {
  protected readonly estados = ESTADOS_ORDEN;
  protected readonly ordenes = signal<OrdenServicio[]>([]);
  protected readonly cargando = signal(true);

  protected desde = primerDiaDelMes();
  protected hasta = hoyISO();

  protected readonly totalOrdenes = computed(() => this.ordenes().length);

  protected readonly ingresosTotales = computed(() =>
    this.ordenes()
      .filter((o) => o.estado === 'entregado')
      .reduce((suma, o) => suma + Number(o.costo_estimado ?? 0), 0)
  );

  protected readonly entregadas = computed(() => this.ordenes().filter((o) => o.estado === 'entregado').length);

  protected readonly ticketPromedio = computed(() => {
    const n = this.entregadas();
    return n === 0 ? 0 : this.ingresosTotales() / n;
  });

  protected readonly conteoPorEstado = computed(() => {
    const ordenes = this.ordenes();
    return this.estados.map((e) => ({
      ...e,
      total: ordenes.filter((o) => o.estado === e.valor).length,
    }));
  });

  protected readonly conteoPorTipoEquipo = computed(() => {
    const conteo = new Map<string, number>();
    for (const orden of this.ordenes()) {
      const tipo = orden.equipo?.tipo ?? 'Sin equipo';
      conteo.set(tipo, (conteo.get(tipo) ?? 0) + 1);
    }
    return [...conteo.entries()]
      .map(([tipo, total]) => ({ tipo, total }))
      .sort((a, b) => b.total - a.total);
  });

  protected readonly maxPorTipoEquipo = computed(() =>
    Math.max(1, ...this.conteoPorTipoEquipo().map((t) => t.total))
  );

  constructor(private readonly ordenesService: OrdenesService) {}

  ngOnInit(): void {
    this.cargar();
  }

  protected cargar(): void {
    this.cargando.set(true);
    this.ordenesService.listarPorRango(this.desde, this.hasta).subscribe({
      next: (lista) => {
        this.ordenes.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected etiquetaEstado(estado: EstadoOrden): string {
    return this.estados.find((e) => e.valor === estado)?.etiqueta ?? estado;
  }
}
