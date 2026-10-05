import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DashboardResumen } from './models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  resumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(`${environment.apiUrl}/dashboard/resumen`);
  }
}
