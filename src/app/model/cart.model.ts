import { CartItem } from './cart-item.model';

export interface Cart {
  idCarrito: number;
  token: string;
  items: CartItem[];
  subtotal: number;
  impuestos?: number;
  descuento?: number;
  total: number;
}
