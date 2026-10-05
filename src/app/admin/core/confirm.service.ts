import { Injectable, signal } from '@angular/core';

interface EstadoConfirm {
  visible: boolean;
  titulo: string;
  mensaje: string;
  textoConfirmar: string;
  resolver?: (valor: boolean) => void;
}

const ESTADO_VACIO: EstadoConfirm = { visible: false, titulo: '', mensaje: '', textoConfirmar: 'Eliminar' };

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly estado = signal<EstadoConfirm>(ESTADO_VACIO);

  confirmar(mensaje: string, opciones?: { titulo?: string; textoConfirmar?: string }): Promise<boolean> {
    return new Promise((resolve) => {
      this.estado.set({
        visible: true,
        titulo: opciones?.titulo ?? '¿Estás seguro?',
        mensaje,
        textoConfirmar: opciones?.textoConfirmar ?? 'Eliminar',
        resolver: resolve,
      });
    });
  }

  responder(valor: boolean): void {
    this.estado().resolver?.(valor);
    this.estado.set(ESTADO_VACIO);
  }
}
