import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../core/clientes.service';
import { ConfirmService } from '../core/confirm.service';
import { EquiposService } from '../core/equipos.service';
import { Cliente, Equipo, TIPOS_EQUIPO, TipoEquipo } from '../core/models';

type FormularioEquipo = Partial<Equipo> & { clienteId: number | null };

const FORM_VACIO: FormularioEquipo = {
  clienteId: null,
  tipo: 'Laptop',
  marca: '',
  modelo: '',
  numero_serie: '',
  color: '',
  estado_fisico: '',
  accesorios_recibidos: '',
  observaciones: '',
  imei_1: '',
  imei_2: '',
  estado_pantalla: '',
  estado_carcasa: '',
  estado_camaras: '',
  estado_botones: '',
  estado_centro_carga: '',
  nivel_bateria: null,
};

@Component({
  selector: 'tf-equipos',
  imports: [FormsModule],
  templateUrl: './equipos.html',
  styleUrl: './equipos.scss',
})
export class Equipos implements OnInit {
  protected readonly tipos = TIPOS_EQUIPO;
  protected readonly equipos = signal<Equipo[]>([]);
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly cargando = signal(true);
  protected readonly mostrarForm = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected editandoId: string | null = null;
  protected form: FormularioEquipo = { ...FORM_VACIO };

  constructor(
    private readonly equiposService: EquiposService,
    private readonly clientesService: ClientesService,
    private readonly confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.cargar();
    this.clientesService.listar().subscribe((lista) => this.clientes.set(lista));
  }

  private cargar(): void {
    this.cargando.set(true);
    this.equiposService.listar().subscribe({
      next: (lista) => {
        this.equipos.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected get esMovil(): boolean {
    return this.form.tipo === 'Celular' || this.form.tipo === 'Tablet';
  }

  protected abrirNuevo(): void {
    this.editandoId = null;
    this.form = { ...FORM_VACIO };
    this.error.set(null);
    this.mostrarForm.set(true);
  }

  protected editar(equipo: Equipo): void {
    this.editandoId = equipo.documentId;
    this.form = { ...equipo, clienteId: equipo.cliente?.id ?? null };
    this.error.set(null);
    this.mostrarForm.set(true);
  }

  protected cancelar(): void {
    this.mostrarForm.set(false);
  }

  protected guardar(): void {
    if (!this.form.clienteId) {
      this.error.set('Selecciona el cliente dueño del equipo.');
      return;
    }
    if (!this.form.marca?.trim()) {
      this.error.set('La marca es obligatoria.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const datosComunes = {
      tipo: this.form.tipo as TipoEquipo,
      marca: this.form.marca,
      modelo: this.form.modelo || null,
      numero_serie: this.form.numero_serie || null,
      color: this.form.color || null,
      estado_fisico: this.form.estado_fisico || null,
      accesorios_recibidos: this.form.accesorios_recibidos || null,
      observaciones: this.form.observaciones || null,
      imei_1: this.esMovil ? this.form.imei_1 || null : null,
      imei_2: this.esMovil ? this.form.imei_2 || null : null,
      estado_pantalla: this.esMovil ? this.form.estado_pantalla || null : null,
      estado_carcasa: this.esMovil ? this.form.estado_carcasa || null : null,
      estado_camaras: this.esMovil ? this.form.estado_camaras || null : null,
      estado_botones: this.esMovil ? this.form.estado_botones || null : null,
      estado_centro_carga: this.esMovil ? this.form.estado_centro_carga || null : null,
      nivel_bateria: this.esMovil ? this.form.nivel_bateria : null,
    };

    const solicitud = this.editandoId
      ? this.equiposService.actualizar(this.editandoId, datosComunes)
      : this.equiposService.crear({ ...datosComunes, cliente: this.form.clienteId });

    solicitud.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar el equipo.');
      },
    });
  }

  protected async eliminar(equipo: Equipo): Promise<void> {
    const confirmado = await this.confirmService.confirmar(
      `¿Eliminar este equipo (${equipo.marca} ${equipo.modelo ?? ''})? Esta acción no se puede deshacer.`,
      { titulo: 'Eliminar equipo' }
    );
    if (!confirmado) return;
    this.equiposService.eliminar(equipo.documentId).subscribe(() => this.cargar());
  }
}
