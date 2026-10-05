export type TipoEquipo = 'PC' | 'Laptop' | 'All-in-One' | 'Impresora' | 'Celular' | 'Tablet' | 'Otro';

export type EstadoOrden =
  | 'recibido'
  | 'diagnostico'
  | 'esperando_autorizacion'
  | 'en_reparacion'
  | 'listo'
  | 'entregado';

export const ESTADOS_ORDEN: { valor: EstadoOrden; etiqueta: string }[] = [
  { valor: 'recibido', etiqueta: 'Recibido' },
  { valor: 'diagnostico', etiqueta: 'Diagnóstico' },
  { valor: 'esperando_autorizacion', etiqueta: 'Esperando autorización' },
  { valor: 'en_reparacion', etiqueta: 'En reparación' },
  { valor: 'listo', etiqueta: 'Listo' },
  { valor: 'entregado', etiqueta: 'Entregado' },
];

export const TIPOS_EQUIPO: TipoEquipo[] = ['PC', 'Laptop', 'All-in-One', 'Impresora', 'Celular', 'Tablet', 'Otro'];

export interface Cliente {
  id: number;
  documentId: string;
  nombre_completo: string;
  telefono: string;
  whatsapp?: string | null;
  correo?: string | null;
  direccion?: string | null;
  fecha_registro: string;
  notas?: string | null;
  createdAt?: string;
  equipos?: Equipo[];
  ordenes?: OrdenServicio[];
}

export interface Equipo {
  id: number;
  documentId: string;
  tipo: TipoEquipo;
  marca: string;
  modelo?: string | null;
  numero_serie?: string | null;
  color?: string | null;
  estado_fisico?: string | null;
  accesorios_recibidos?: string | null;
  observaciones?: string | null;
  imei_1?: string | null;
  imei_2?: string | null;
  estado_pantalla?: string | null;
  estado_carcasa?: string | null;
  estado_camaras?: string | null;
  estado_botones?: string | null;
  estado_centro_carga?: string | null;
  nivel_bateria?: number | null;
  cliente?: Cliente | null;
}

export interface Tecnico {
  id: number;
  documentId: string;
  nombre: string;
  tipo: 'interno' | 'asociado';
  telefono?: string | null;
  correo?: string | null;
  estado: 'activo' | 'inactivo';
}

export interface HistorialEstado {
  id: number;
  documentId: string;
  fecha_hora: string;
  estado_anterior: EstadoOrden | null;
  estado_nuevo: EstadoOrden;
  usuario_nombre: string | null;
  nota: string | null;
}

export interface OrdenServicio {
  id: number;
  documentId: string;
  folio: string;
  cliente?: Cliente | null;
  equipo?: Equipo | null;
  fecha_recepcion: string;
  problema_reportado: string;
  diagnostico?: string | null;
  servicio_solicitado?: string | null;
  piezas?: string | null;
  mano_obra?: number | null;
  costo_estimado?: number | null;
  anticipo?: number | null;
  saldo?: number | null;
  estado: EstadoOrden;
  tecnico_responsable?: Tecnico | null;
  fecha_estimada_entrega?: string | null;
  notas?: string | null;
  garantia_dias?: number | null;
  garantia_condiciones?: string | null;
  pdf_recepcion?: { url: string } | null;
  pdf_entrega?: { url: string } | null;
  historial?: HistorialEstado[];
  createdAt?: string;
}

export interface DashboardResumen {
  conteos_por_estado: { estado: EstadoOrden; total: number }[];
  total_clientes: number;
  ingresos_del_mes: number;
  servicios_del_mes: number;
}
