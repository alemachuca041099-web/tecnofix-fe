import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ESTADOS_ORDEN, EstadoOrden, OrdenServicio, Tecnico } from '../../core/models';
import { OrdenesService } from '../../core/ordenes.service';
import { TecnicosService } from '../../core/tecnicos.service';

const ESTADOS_CON_PDF_ENTREGA: EstadoOrden[] = ['listo', 'entregado'];

@Component({
  selector: 'tf-orden-detail',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './orden-detail.html',
  styleUrl: './orden-detail.scss',
})
export class OrdenDetail implements OnInit {
  protected readonly estados = ESTADOS_ORDEN;
  protected readonly orden = signal<OrdenServicio | null>(null);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly generandoPdf = signal<'recepcion' | 'entrega' | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly tecnicos = signal<Tecnico[]>([]);
  protected readonly apiOrigin = environment.apiUrl.replace(/\/api$/, '');

  private documentId!: string;

  protected form: {
    estado: EstadoOrden;
    diagnostico: string;
    servicio_solicitado: string;
    piezas: string;
    mano_obra: number | null;
    costo_estimado: number | null;
    anticipo: number | null;
    saldo: number | null;
    tecnico_responsable: number | null;
    notas: string;
    garantia_dias: number | null;
    garantia_condiciones: string;
  } = this.formVacio();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly ordenesService: OrdenesService,
    private readonly tecnicosService: TecnicosService
  ) {}

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id')!;
    this.tecnicosService.listar().subscribe((lista) => this.tecnicos.set(lista));
    this.cargar();
  }

  private formVacio() {
    return {
      estado: 'recibido' as EstadoOrden,
      diagnostico: '',
      servicio_solicitado: '',
      piezas: '',
      mano_obra: null,
      costo_estimado: null,
      anticipo: null,
      saldo: null,
      tecnico_responsable: null,
      notas: '',
      garantia_dias: null,
      garantia_condiciones: '',
    };
  }

  private cargar(): void {
    this.cargando.set(true);
    this.ordenesService.obtener(this.documentId).subscribe({
      next: (o) => {
        this.orden.set(o);
        this.form = {
          estado: o.estado,
          diagnostico: o.diagnostico ?? '',
          servicio_solicitado: o.servicio_solicitado ?? '',
          piezas: o.piezas ?? '',
          mano_obra: o.mano_obra ?? null,
          costo_estimado: o.costo_estimado ?? null,
          anticipo: o.anticipo ?? null,
          saldo: o.saldo ?? null,
          tecnico_responsable: o.tecnico_responsable?.id ?? null,
          notas: o.notas ?? '',
          garantia_dias: o.garantia_dias ?? null,
          garantia_condiciones: o.garantia_condiciones ?? '',
        };
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected get puedeGenerarPdfEntrega(): boolean {
    return ESTADOS_CON_PDF_ENTREGA.includes(this.form.estado);
  }

  protected guardar(): void {
    this.guardando.set(true);
    this.error.set(null);

    this.ordenesService
      .actualizar(this.documentId, {
        estado: this.form.estado,
        diagnostico: this.form.diagnostico || null,
        servicio_solicitado: this.form.servicio_solicitado || null,
        piezas: this.form.piezas || null,
        mano_obra: this.form.mano_obra,
        costo_estimado: this.form.costo_estimado,
        anticipo: this.form.anticipo,
        saldo: this.form.saldo,
        tecnico_responsable: this.form.tecnico_responsable,
        notas: this.form.notas || null,
        garantia_dias: this.form.garantia_dias,
        garantia_condiciones: this.form.garantia_condiciones || null,
      })
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.cargar();
        },
        error: (err: HttpErrorResponse) => {
          this.guardando.set(false);
          this.error.set(err.error?.error?.message || 'No se pudo guardar la orden.');
        },
      });
  }

  protected generarPdfRecepcion(): void {
    this.generandoPdf.set('recepcion');
    this.ordenesService.generarPdfRecepcion(this.documentId).subscribe({
      next: () => {
        this.generandoPdf.set(null);
        this.cargar();
      },
      error: () => this.generandoPdf.set(null),
    });
  }

  protected generarPdfEntrega(): void {
    this.generandoPdf.set('entrega');
    this.ordenesService.generarPdfEntrega(this.documentId).subscribe({
      next: () => {
        this.generandoPdf.set(null);
        this.cargar();
      },
      error: () => this.generandoPdf.set(null),
    });
  }
}
