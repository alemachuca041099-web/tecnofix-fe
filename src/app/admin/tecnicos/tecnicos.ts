import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmService } from '../core/confirm.service';
import { TecnicosService } from '../core/tecnicos.service';
import { Tecnico } from '../core/models';

const FORM_VACIO: Partial<Tecnico> = {
  nombre: '',
  tipo: 'interno',
  telefono: '',
  correo: '',
  estado: 'activo',
};

@Component({
  selector: 'tf-tecnicos',
  imports: [FormsModule],
  templateUrl: './tecnicos.html',
  styleUrl: './tecnicos.scss',
})
export class Tecnicos implements OnInit {
  protected readonly tecnicos = signal<Tecnico[]>([]);
  protected readonly cargando = signal(true);
  protected readonly mostrarForm = signal(false);
  protected readonly guardando = signal(false);
  protected readonly error = signal<string | null>(null);

  protected editandoId: string | null = null;
  protected form: Partial<Tecnico> = { ...FORM_VACIO };

  constructor(
    private readonly tecnicosService: TecnicosService,
    private readonly confirmService: ConfirmService
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.cargando.set(true);
    this.tecnicosService.listar().subscribe({
      next: (lista) => {
        this.tecnicos.set(lista);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected abrirNuevo(): void {
    this.editandoId = null;
    this.form = { ...FORM_VACIO };
    this.error.set(null);
    this.mostrarForm.set(true);
  }

  protected editar(tecnico: Tecnico): void {
    this.editandoId = tecnico.documentId;
    this.form = { ...tecnico };
    this.error.set(null);
    this.mostrarForm.set(true);
  }

  protected cancelar(): void {
    this.mostrarForm.set(false);
  }

  protected guardar(): void {
    if (!this.form.nombre?.trim()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    const solicitud = this.editandoId
      ? this.tecnicosService.actualizar(this.editandoId, this.form)
      : this.tecnicosService.crear(this.form);

    solicitud.subscribe({
      next: () => {
        this.guardando.set(false);
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('No se pudo guardar el técnico.');
      },
    });
  }

  protected async eliminar(tecnico: Tecnico): Promise<void> {
    const confirmado = await this.confirmService.confirmar(`¿Eliminar a ${tecnico.nombre}?`, {
      titulo: 'Eliminar técnico',
    });
    if (!confirmado) return;
    this.tecnicosService.eliminar(tecnico.documentId).subscribe(() => this.cargar());
  }
}
