import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from './models';

interface RespuestaLista<T> {
  data: T[];
}

interface RespuestaUno<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private readonly base = `${environment.apiUrl}/clientes`;

  constructor(private readonly http: HttpClient) {}

  listar(busqueda?: string): Observable<Cliente[]> {
    const params = new URLSearchParams({ 'sort[0]': 'nombre_completo:asc', 'pagination[pageSize]': '200' });
    if (busqueda) params.set('filters[nombre_completo][$containsi]', busqueda);
    return this.http
      .get<RespuestaLista<Cliente>>(`${this.base}?${params.toString()}`)
      .pipe(map((r) => r.data));
  }

  obtener(documentId: string): Observable<Cliente> {
    const params = new URLSearchParams({
      'populate[equipos]': 'true',
      'populate[ordenes][populate]': 'equipo',
    });
    return this.http
      .get<RespuestaUno<Cliente>>(`${this.base}/${documentId}?${params.toString()}`)
      .pipe(map((r) => r.data));
  }

  crear(datos: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<RespuestaUno<Cliente>>(this.base, { data: datos }).pipe(map((r) => r.data));
  }

  actualizar(documentId: string, datos: Partial<Cliente>): Observable<Cliente> {
    return this.http
      .put<RespuestaUno<Cliente>>(`${this.base}/${documentId}`, { data: datos })
      .pipe(map((r) => r.data));
  }

  eliminar(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${documentId}`);
  }
}
