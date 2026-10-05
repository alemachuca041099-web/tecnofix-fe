import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

const CLAVE_TOKEN = 'tf_admin_token';
const CLAVE_USUARIO = 'tf_admin_usuario';

interface UsuarioStaff {
  id: number;
  username: string;
  email: string;
}

interface RespuestaLogin {
  jwt: string;
  user: UsuarioStaff;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  private readonly usuarioSignal = signal<UsuarioStaff | null>(this.leerUsuarioGuardado());

  readonly estaAutenticado = computed(() => this.tokenSignal() !== null);
  readonly usuario = this.usuarioSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  get token(): string | null {
    return this.tokenSignal();
  }

  login(identifier: string, password: string): Observable<RespuestaLogin> {
    return this.http
      .post<RespuestaLogin>(`${environment.apiUrl}/auth/local`, { identifier, password })
      .pipe(
        tap((respuesta) => {
          localStorage.setItem(CLAVE_TOKEN, respuesta.jwt);
          localStorage.setItem(CLAVE_USUARIO, JSON.stringify(respuesta.user));
          this.tokenSignal.set(respuesta.jwt);
          this.usuarioSignal.set(respuesta.user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this.tokenSignal.set(null);
    this.usuarioSignal.set(null);
  }

  private leerUsuarioGuardado(): UsuarioStaff | null {
    const crudo = localStorage.getItem(CLAVE_USUARIO);
    if (!crudo) return null;
    try {
      return JSON.parse(crudo);
    } catch {
      return null;
    }
  }
}
