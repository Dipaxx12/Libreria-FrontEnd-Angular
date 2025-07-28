import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Autor } from '../../model/autor.model';
import { AutorService } from '../../services/autor';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  standalone: false,
  selector: 'app-autor',
  templateUrl: './autor.component.html',
  styleUrls: ['./autor.component.css']
})
export class AutorComponent implements OnInit {
  autores: Autor[] = [];
  autor: Autor = {} as Autor;
  editar: boolean = false;
  idEditar: number | null = null;

  dataSource!: MatTableDataSource<Autor>;
  mostrarColumnas: string[] = [
    'idAutor',
    'nombre',
    'apellido',
    'pais',
    'direccion',
    'telefono',
    'correo',
    'acciones'
  ];

  @ViewChild('formularioAutor') formularioAutor!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private autorService: AutorService) {}

  ngOnInit(): void {
    this.findAll();
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = 'Autores por página:';
      this.paginator.pageSize = 5;
    }
  }

  findAll(): void {
    this.autorService.findAll().subscribe((data) => {
      this.autores = data;
      this.dataSource = new MatTableDataSource(this.autores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSource.filterPredicate = (data: Autor, filter: string) =>
        Object.values(data).some(value =>
          value?.toString().toLowerCase().includes(filter)
        );
    });
  }

  save(): void {
    this.autorService.save(this.autor).subscribe(() => {
      this.findAll();
      this.resetForm();
    });
  }

  update(): void {
    if (this.idEditar !== null) {
      this.autorService.update(this.idEditar, this.autor).subscribe(() => {
        this.findAll();
        this.resetForm();
        this.editar = false;
        this.idEditar = null;
      });
    }
  }

  delete(): void {
    Swal.fire({
      title: "¿Desea eliminar el autor?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    }).then((result) => {
      if (result.isConfirmed) {
        this.autorService.delete(this.autor.idAutor!).subscribe(() => {
          this.findAll();
          this.autor = {} as Autor;
          Swal.fire("Eliminado", "El autor ha sido eliminado", "success");
        });
      } else {
        this.autor = {} as Autor;
      }
    });
  }

  editarAutor(autor: Autor): void {
    this.autor = { ...autor };
    this.idEditar = autor.idAutor ?? null;
    this.editar = true;

    setTimeout(() => {
      this.formularioAutor?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  editarAutorCancelar(form: NgForm): void {
    this.resetForm();
    form.resetForm();
  }

  guardar(form: NgForm): void {
    if (this.editar && this.idEditar !== null) {
      this.update();
      form.resetForm();
    } else {
      this.save();
      form.resetForm();
    }
  }

  buscarAutor(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  resetForm(): void {
    this.autor = {} as Autor;
    this.editar = false;
    this.idEditar = null;
    this.formularioAutor?.nativeElement?.reset?.();
  }
}
