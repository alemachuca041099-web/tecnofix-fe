import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConsultaFolioService, ResultadoConsultaFolio } from '../../core/services/consulta-folio.service';

interface EstadoPaso {
  clave: string;
  etiqueta: string;
}

const PASOS: EstadoPaso[] = [
  { clave: 'recibido', etiqueta: 'Recibido' },
  { clave: 'diagnostico', etiqueta: 'Diagnóstico' },
  { clave: 'esperando_autorizacion', etiqueta: 'Esperando autorización' },
  { clave: 'en_reparacion', etiqueta: 'En reparación' },
  { clave: 'listo', etiqueta: 'Listo' },
  { clave: 'entregado', etiqueta: 'Entregado' },
];

@Component({
  selector: 'tf-consulta-folio',
  imports: [FormsModule, DatePipe],
  templateUrl: './consulta-folio.html',
  styleUrl: './consulta-folio.scss',
})
export class ConsultaFolio {
  protected readonly pasos = PASOS;

  protected folio = '';
  protected telefono = '';

  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly resultado = signal<ResultadoConsultaFolio | null>(null);

  constructor(private readonly consultaFolioService: ConsultaFolioService) {}

  protected consultar(): void {
    if (!this.folio.trim() || !this.telefono.trim()) {
      this.error.set('Ingresa tu folio y tu teléfono.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);
    this.resultado.set(null);

    this.consultaFolioService.consultar(this.folio.trim(), this.telefono.trim()).subscribe({
      next: (resultado) => {
        this.resultado.set(resultado);
        this.cargando.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 404
            ? 'No encontramos ese folio con ese teléfono. Verifica ambos datos.'
            : 'Ocurrió un problema al consultar tu folio. Intenta de nuevo en un momento.'
        );
        this.cargando.set(false);
      },
    });
  }

  protected indicePaso(estado: string): number {
    return this.pasos.findIndex((paso) => paso.clave === estado);
  }
}
