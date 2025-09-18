import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

import { Libro } from '../../model/libro.model';
import { Autor } from '../../model/autor.model';
import { Categoria } from '../../model/Categoria';
import { CartService } from '../../services/cart.service';

import { LibroService } from '../../services/libro';
import { AutorService } from '../../services/autor';
import { CategoriaService } from '../../services/categoria';

@Component({
  standalone: false,
  selector: 'app-libro',
  templateUrl: './libro.component.html',
  styleUrls: ['./libro.component.css']
})
export class LibroComponent implements OnInit {

  libros: Libro[] = [];
  autores: Autor[] = [];
  categorias: Categoria[] = [];

  libro: Libro = {} as Libro;

  // 👇 añadimos 'carrito' antes de 'acciones'
  displayedColumns: string[] = [
    'idLibro', 'titulo', 'autor', 'categoria', 'precio', 'isbn', 'carrito', 'acciones'
  ];
  dataSource = new MatTableDataSource<Libro>([]);

  editar = false;
  idEditar: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private libroService: LibroService,
    private autorService: AutorService,
    private categoriaService: CategoriaService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    // crea/asegura el carrito de invitado (token) una vez
    this.cartService.ensure().subscribe();

    this.findAll();
    this.loadAux();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadAux(): void {
    this.autorService.findAll().subscribe(data => this.autores = data);
    this.categoriaService.findAll().subscribe(data => this.categorias = data);
  }

  findAll(): void {
    this.libroService.findAll().subscribe((data) => {
      this.libros = data;
      this.dataSource.data = data;
    });
  }

  guardar(form: NgForm): void {
    if (form.invalid) return;

    if (this.editar && this.idEditar) {
      this.libroService.update(this.idEditar, this.libro).subscribe(() => {
        Swal.fire('Actualizado', 'El libro se actualizó correctamente', 'success');
        this.cancelar(form);
        this.findAll();
      });
    } else {
      this.libroService.save(this.libro).subscribe(() => {
        Swal.fire('Registrado', 'El libro se registró correctamente', 'success');
        this.cancelar(form);
        this.findAll();
      });
    }
  }

  editarLibro(row: Libro): void {
    this.libro = { ...row }; // clonar
    this.editar = true;
    this.idEditar = row.idLibro ?? null;
  }

  delete(l: Libro): void {
    Swal.fire({
      title: '¿Eliminar libro?',
      text: `Se eliminará: ${l.titulo}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((r) => {
      if (r.isConfirmed && l.idLibro) {
        this.libroService.delete(l.idLibro).subscribe(() => {
          Swal.fire('Eliminado', 'El libro fue eliminado', 'success');
          this.findAll();
        });
      }
    });
  }

  cancelar(form: NgForm): void {
    this.libro = {} as Libro;
    form.resetForm();
    this.editar = false;
    this.idEditar = null;
  }

  // 👇 MÉTODO NUEVO: agregar al carrito
  addToCart(l: Libro): void {
    const id = l.idLibro;
    if (!id) {
      Swal.fire('Error', 'No se pudo identificar el libro', 'error');
      return;
    }
    this.cartService.addItem(id, 1).subscribe({
      next: () => Swal.fire('Agregado', 'Libro agregado al carrito', 'success'),
      error: () => Swal.fire('Error', 'No se pudo agregar al carrito', 'error')
    });
  }
}
