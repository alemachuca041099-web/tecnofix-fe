import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tecnico } from './models';

interface RespuestaLista<T> {
  data: T[];
}

interface RespuestaUno<T> {
  data: T;
}

@Injectable({ providedIn: 'root' })
export class TecnicosService {
  private readonly base = `${environment.apiUrl}/tecnicos`;

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Tecnico[]> {
    return this.http
      .get<RespuestaLista<Tecnico>>(`${this.base}?sort[0]=nombre:asc&pagination[pageSize]=200`)
      .pipe(map((r) => r.data));
  }

  crear(datos: Partial<Tecnico>): Observable<Tecnico> {
    return this.http.post<RespuestaUno<Tecnico>>(this.base, { data: datos }).pipe(map((r) => r.data));
  }

  actualizar(documentId: string, datos: Partial<Tecnico>): Observable<Tecnico> {
    return this.http
      .put<RespuestaUno<Tecnico>>(`${this.base}/${documentId}`, { data: datos })
      .pipe(map((r) => r.data));
  }

  eliminar(documentId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${documentId}`);
  }
}
