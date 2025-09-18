import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cart } from '../../model/cart.model';
import { CartItem } from '../../model/cart-item.model';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
  standalone: false
})
export class CartPageComponent implements OnInit {
  cart: Cart | null = null;
  displayed: string[] = ['titulo', 'precio', 'cantidad', 'total', 'acciones'];
  dataSource = new MatTableDataSource<CartItem>([]);

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.ensure().subscribe(() => this.refresh());
  }

  refresh(): void {
    this.cartService.get().subscribe(c => {
      this.cart = c;
      this.dataSource.data = c.items ?? [];
    });
  }

  update(item: CartItem, qty: number) {
    const cantidad = Math.max(0, Number(qty || 0));
    this.cartService.updateItem(item.idCarritoItem, cantidad).subscribe(() => this.refresh());
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item.idCarritoItem).subscribe(() => this.refresh());
  }

  clear() {
    this.cartService.clear().subscribe(() => this.refresh());
  }

  checkout() {
    this.cartService.checkout().subscribe(factura => {
      alert('Compra registrada. Factura # ' + (factura?.idFactura ?? 'N/A'));
      this.refresh();
    });
  }
}
