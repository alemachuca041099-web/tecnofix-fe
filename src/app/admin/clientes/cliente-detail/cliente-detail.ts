import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientesService } from '../../core/clientes.service';
import { Cliente } from '../../core/models';

@Component({
  selector: 'tf-cliente-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './cliente-detail.html',
  styleUrl: './cliente-detail.scss',
})
export class ClienteDetail implements OnInit {
  protected readonly cliente = signal<Cliente | null>(null);
  protected readonly cargando = signal(true);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly clientesService: ClientesService
  ) {}

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id')!;
    this.clientesService.obtener(documentId).subscribe({
      next: (c) => {
        this.cliente.set(c);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
