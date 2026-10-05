import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../core/reveal.directive';

interface Principio {
  titulo: string;
  descripcion: string;
}

interface FormaTrabajo {
  titulo: string;
  descripcion: string;
}

const PRINCIPIOS: Principio[] = [
  {
    titulo: 'Honestidad primero',
    descripcion: 'Si un equipo no vale la pena repararlo, te lo decimos. No forzamos un servicio para cobrar una visita.',
  },
  {
    titulo: 'Todo por escrito',
    descripcion: 'Folio, diagnóstico, costo y garantía quedan documentados. Nada se acuerda solo de palabra.',
  },
  {
    titulo: 'Respeto por tu información',
    descripcion: 'No revisamos ni guardamos datos personales de tus cuentas más allá de lo estrictamente necesario para el servicio.',
  },
  {
    titulo: 'Mejora continua',
    descripcion: 'Cada equipo que entra por la puerta es una oportunidad de afinar el proceso para el siguiente cliente.',
  },
];

const FORMA_TRABAJO: FormaTrabajo[] = [
  { titulo: 'Recepción ordenada', descripcion: 'Cada equipo se registra con folio, fotografías del estado en que llega y accesorios recibidos.' },
  { titulo: 'Diagnóstico documentado', descripcion: 'El diagnóstico y el costo se registran antes de reparar, no después.' },
  { titulo: 'Técnicos según el equipo', descripcion: 'Asignamos el servicio a técnicos propios o asociados según el tipo de equipo y la complejidad.' },
];

@Component({
  selector: 'tf-nosotros',
  imports: [RouterLink, RevealDirective],
  templateUrl: './nosotros.html',
  styleUrl: './nosotros.scss',
})
export class Nosotros {
  protected readonly principios = PRINCIPIOS;
  protected readonly formaTrabajo = FORMA_TRABAJO;
}
