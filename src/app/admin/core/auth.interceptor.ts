import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const esApiPropia = req.url.startsWith(environment.apiUrl);
  const token = auth.token;

  const solicitud = esApiPropia && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(solicitud).pipe(
    catchError((error) => {
      if (esApiPropia && error.status === 401) {
        auth.logout();
        router.navigate(['/admin/login']);
      }
      return throwError(() => error);
    })
  );
};
