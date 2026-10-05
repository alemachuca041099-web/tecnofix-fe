import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EstadoOrden, OrdenServicio } from './models';

interface RespuestaLista<T> {
  data: T[];
}

interface RespuestaUno<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class OrdenesService {
  private readonly base = `${environment.apiUrl}/orden-servicios`;

  constructor(private readonly http: HttpClient) {}

  listar(estado?: EstadoOrden | 'todos'): Observable<OrdenServicio[]> {
    const params = new URLSearchParams({
      'populate[cliente]': 'true',
      'populate[equipo]': 'true',
      'populate[tecnico_responsable]': 'true',
      'sort[0]': 'createdAt:desc',
      'pagination[pageSize]': '200',
    });
    if (estado && estado !== 'todos') params.set('filters[estado][$eq]', estado);
    return this.http
      .get<RespuestaLista<OrdenServicio>>(`${this.base}?${params.toString()}`)
      .pipe(map((r) => r.data));
  }

  listarPorRango(desde: string, hasta: string): Observable<OrdenServicio[]> {
    const params = new URLSearchParams({
      'populate[cliente]': 'true',
      'populate[equipo]': 'true',
      'populate[tecnico_responsable]': 'true',
      'sort[0]': 'fecha_recepcion:asc',
      'pagination[pageSize]': '500',
      'filters[fecha_recepcion][$gte]': desde,
      'filters[fecha_recepcion][$lte]': `${hasta}T23:59:59.999Z`,
    });
    return this.http
      .get<RespuestaLista<OrdenServicio>>(`${this.base}?${params.toString()}`)
      .pipe(map((r) => r.data));
  }

  obtener(documentId: string): Observable<OrdenServicio> {
    const params = new URLSearchParams({
      'populate[cliente]': 'true',
      'populate[equipo]': 'true',
      'populate[tecnico_responsable]': 'true',
      'populate[pdf_recepcion]': 'true',
      'populate[pdf_entrega]': 'true',
      'populate[historial][sort][0]': 'id:asc',
    });
    return this.http
      .get<RespuestaUno<OrdenServicio>>(`${this.base}/${documentId}?${params.toString()}`)
      .pipe(map((r) => r.data));
  }

  crear(datos: {
    cliente: number;
    equipo: number;
    problema_reportado: string;
    servicio_solicitado?: string;
    tecnico_responsable?: number | null;
  }): Observable<OrdenServicio> {
    return this.http.post<RespuestaUno<OrdenServicio>>(this.base, { data: datos }).pipe(map((r) => r.data));
  }

  actualizar(documentId: string, datos: Partial<OrdenServicio> | Record<string, unknown>): Observable<OrdenServicio> {
    return this.http
      .put<RespuestaUno<OrdenServicio>>(`${this.base}/${documentId}`, { data: datos })
      .pipe(map((r) => r.data));
  }

  generarPdfRecepcion(documentId: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.base}/${documentId}/pdf-recepcion`, {});
  }

  generarPdfEntrega(documentId: string): Observable<{ url: string }> {
    return this.http.post<{ url: string }>(`${this.base}/${documentId}/pdf-entrega`, {});
  }
}
