import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ClientesService } from '../../core/clientes.service';
import { EquiposService } from '../../core/equipos.service';
import { Cliente, Equipo, EstadoOrden, ESTADOS_ORDEN, OrdenServicio, TIPOS_EQUIPO, TipoEquipo } from '../../core/models';
import { OrdenesService } from '../../core/ordenes.service';

@Component({
  selector: 'tf-ordenes-list',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './ordenes-list.html',
  styleUrl: './ordenes-list.scss',
})
export class OrdenesList implements OnInit {
  protected readonly estados = ESTADOS_ORDEN;
  protected readonly ordenes = signal<OrdenServicio[]>([]);
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly equiposDelCliente = signal<Equipo[]>([]);
  protected readonly cargando = signal(true);
  protected readonly filtroEstado = signal<EstadoOrden | 'todos'>('todos');
  protected readonly mostrarForm = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected clienteId: number | null = null;
  protected equipoId: number | null = null;
  protected problemaReportado = '';
  protected servicioSolicitado = '';

  // Atajo: dar de alta un equipo sin salir del modal de nueva orden — antes
  // había que cancelar, ir a Equipos, crearlo, y volver a abrir el modal.
  protected readonly tiposEquipo = TIPOS_EQUIPO;
  protected readonly mostrarNuevoEquipo = signal(false);
  protected readonly guardandoEquipo = signal(false);
  protected nuevoEquipo: { tipo: TipoEquipo; marca: string; modelo: string } = {
    tipo: 'Laptop',
    marca: '',
    modelo: '',
  };

  constructor(
    private readonly ordenesService: OrdenesService,
    private readonly clientesService: ClientesService,
    private readonly equiposService: EquiposService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.clientesService.listar().subscribe((lista) => this.clientes.set(lista));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.ordenesService.listar(this.filtroEstado()).subscribe({
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

  protected cambiarFiltro(estado: EstadoOrden | 'todos'): void {
    this.filtroEstado.set(estado);
    this.cargar();
  }

  protected abrirNueva(): void {
    this.clienteId = null;
    this.equipoId = null;
    this.problemaReportado = '';
    this.servicioSolicitado = '';
    this.equiposDelCliente.set([]);
    this.error.set(null);
    this.mostrarForm.set(true);
  }

  protected cancelar(): void {
    this.mostrarForm.set(false);
  }

  protected alCambiarCliente(): void {
    this.equipoId = null;
    this.equiposDelCliente.set([]);
    this.mostrarNuevoEquipo.set(false);
    if (!this.clienteId) return;
    const cliente = this.clientes().find((c) => c.id === this.clienteId);
    if (!cliente) return;
    this.equiposService.listar(cliente.documentId).subscribe((lista) => this.equiposDelCliente.set(lista));
  }

  protected abrirNuevoEquipo(): void {
    this.nuevoEquipo = { tipo: 'Laptop', marca: '', modelo: '' };
    this.mostrarNuevoEquipo.set(true);
  }

  protected cancelarNuevoEquipo(): void {
    this.mostrarNuevoEquipo.set(false);
  }

  protected crearEquipoRapido(): void {
    if (!this.clienteId || !this.nuevoEquipo.marca.trim()) {
      this.error.set('Indica al menos la marca del equipo.');
      return;
    }

    this.guardandoEquipo.set(true);
    this.error.set(null);

    this.equiposService
      .crear({
        cliente: this.clienteId,
        tipo: this.nuevoEquipo.tipo,
        marca: this.nuevoEquipo.marca,
        modelo: this.nuevoEquipo.modelo || null,
      })
      .subscribe({
        next: (equipo) => {
          this.guardandoEquipo.set(false);
          this.equiposDelCliente.update((lista) => [...lista, equipo]);
          this.equipoId = equipo.id;
          this.mostrarNuevoEquipo.set(false);
        },
        error: () => {
          this.guardandoEquipo.set(false);
          this.error.set('No se pudo crear el equipo.');
        },
      });
  }

  protected crear(): void {
    if (!this.clienteId || !this.equipoId || !this.problemaReportado.trim()) {
      this.error.set('Cliente, equipo y problema reportado son obligatorios.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.ordenesService
      .crear({
        cliente: this.clienteId,
        equipo: this.equipoId,
        problema_reportado: this.problemaReportado,
        servicio_solicitado: this.servicioSolicitado || undefined,
      })
      .subscribe({
        next: (orden) => {
          this.guardando.set(false);
          this.mostrarForm.set(false);
          this.router.navigate(['/admin/ordenes', orden.documentId]);
        },
        error: () => {
          this.guardando.set(false);
          this.error.set('No se pudo crear la orden.');
        },
      });
  }
}
