import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ResultadoConsultaFolio {
  folio: string;
  equipo: {
    tipo: string;
    marca: string;
    modelo: string;
  };
  servicio_solicitado: string;
  estado: string;
  ultima_actualizacion: string;
}

@Injectable({ providedIn: 'root' })
export class ConsultaFolioService {
  constructor(private readonly http: HttpClient) {}

  consultar(folio: string, telefono: string): Observable<ResultadoConsultaFolio> {
    const params = new URLSearchParams({ folio, telefono });
    return this.http.get<ResultadoConsultaFolio>(`${environment.apiUrl}/consulta-folio?${params.toString()}`);
  }
}
