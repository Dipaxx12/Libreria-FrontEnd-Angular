import { Libro } from './libro.model';

export interface CartItem {
  idCarritoItem: number;
  libro: Libro;
  cantidad: number;
  precioUnitario: number;
  total: number;
}
