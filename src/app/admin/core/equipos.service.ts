import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Equipo } from './models';

interface RespuestaLista<T> {
  data: T[];
}

interface RespuestaUno<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class EquiposService {
  private readonly base = `${environment.apiUrl}/equipos`;

  constructor(private readonly http: HttpClient) {}

  listar(clienteDocumentId?: string): Observable<Equipo[]> {
    const params = new URLSearchParams({
      'populate[cliente]': 'true',
      'sort[0]': 'createdAt:desc',
      'pagination[pageSize]': '200',
    });
    if (clienteDocumentId) params.set('filters[cliente][documentId][$eq]', clienteDocumentId);
    return this.http.get<RespuestaLista<Equipo>>(`${this.base}?${params.toString()}`).pipe(map((r) => r.data));
  }

  obtener(documentId: string): Observable<Equipo> {
    return this.http
      .get<RespuestaUno<Equipo>>(`${this.base}/${documentId}?populate[cliente]=true`)
      .pipe(map((r) => r.data));
  }

  crear(datos: Omit<Partial<Equipo>, 'cliente'> & { cliente: number }): Observable<Equipo> {
    return this.http.post<RespuestaUno<Equipo>>(this.base, { data: datos }).pipe(map((r) => r.data));
  }

  actualizar(documentId: string, datos: Partial<Equipo>): Observable<Equipo> {
    return this.http
      .put<RespuestaUno<Equipo>>(`${this.base}/${documentId}`, { data: datos })
      .pipe(map((r) => r.data));
  }

  eliminar(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${documentId}`);
  }
}
