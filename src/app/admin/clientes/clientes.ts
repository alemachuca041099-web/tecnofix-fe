import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClientesService } from '../core/clientes.service';
import { ConfirmService } from '../core/confirm.service';
import { Cliente } from '../core/models';

type FormularioCliente = Partial<Cliente>;

const FORM_VACIO: FormularioCliente = {
  nombre_completo: '',
  telefono: '',
  whatsapp: '',
  correo: '',
  direccion: '',
  notas: '',
};

@Component({
  selector: 'tf-clientes',
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss',
})
export class Clientes implements OnInit {
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly mostrarForm = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly busqueda = signal('');

  protected editandoId: string | null = null;
  protected form: FormularioCliente = { ...FORM_VACIO };

  constructor(
    private readonly clientesService: ClientesService,
    private readonly confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.clientesService.listar(this.busqueda() || undefined).subscribe({
      next: (lista) => {
        this.clientes.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected buscar(): void {
    this.cargar();
  }

  protected abrirNuevo(): void {
    this.editandoId = null;
    this.form = { ...FORM_VACIO };
    this.error.set(null);
    this.mostrarForm.set(true);
  }

  protected editar(cliente: Cliente): void {
    this.editandoId = cliente.documentId;
    this.form = { ...cliente };
    this.error.set(null);
    this.mostrarForm.set(true);
  }

  protected cancelar(): void {
    this.mostrarForm.set(false);
  }

  protected guardar(): void {
    if (!this.form.nombre_completo?.trim() || !this.form.telefono?.trim()) {
      this.error.set('Nombre y teléfono son obligatorios.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const datos: Partial<Cliente> = {
      nombre_completo: this.form.nombre_completo,
      telefono: this.form.telefono,
      whatsapp: this.form.whatsapp || null,
      correo: this.form.correo || null,
      direccion: this.form.direccion || null,
      notas: this.form.notas || null,
      fecha_registro: this.editandoId ? this.form.fecha_registro : new Date().toISOString().slice(0, 10),
    };

    const solicitud = this.editandoId
      ? this.clientesService.actualizar(this.editandoId, datos)
      : this.clientesService.crear(datos);

    solicitud.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar el cliente.');
      },
    });
  }

  protected async eliminar(cliente: Cliente): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      `¿Eliminar a ${cliente.nombre_completo}? Esta acción no se puede deshacer.`,
      { titulo: 'Eliminar cliente' }
    );
    if (!confirmado) return;
    this.clientesService.eliminar(cliente.documentId).subscribe(() => this.cargar());
  }
}
