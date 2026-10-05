import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'tf-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  protected identifier = '';
  protected password = '';
  protected readonly cargando = signal(false);
  protected readonly error = signal<string | null>(null);

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  protected enviar(): void {
    if (!this.identifier.trim() || !this.password) {
      this.error.set('Ingresa tu usuario/correo y tu contraseña.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.auth.login(this.identifier.trim(), this.password).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/admin/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(
          err.status === 400 ? 'Usuario o contraseña incorrectos.' : 'No se pudo iniciar sesión. Intenta de nuevo.'
        );
        this.cargando.set(false);
      },
    });
  }
}
