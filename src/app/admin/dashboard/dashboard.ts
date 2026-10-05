import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../core/dashboard.service';
import { DashboardResumen, ESTADOS_ORDEN } from '../core/models';

@Component({
  selector: 'tf-dashboard',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  protected readonly estados = ESTADOS_ORDEN;
  protected readonly resumen = signal<DashboardResumen | null>(null);
  protected readonly cargando = signal(true);

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.resumen().subscribe({
      next: (r) => {
        this.resumen.set(r);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected totalPorEstado(estado: string): number {
    return this.resumen()?.conteos_por_estado.find((c) => c.estado === estado)?.total ?? 0;
  }
}
