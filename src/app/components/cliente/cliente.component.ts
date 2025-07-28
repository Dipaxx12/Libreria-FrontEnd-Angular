import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from '../../model/cliente.model';
import { ClienteService } from '../../services/cliente';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css'],
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  cliente: Cliente = {} as Cliente;
  editar: boolean = false;
  idEditar: number | null = null;

  dataSource!: MatTableDataSource<Cliente>;

  mostrarColumnas: string[] = [
    'idCliente',
    'cedula',
    'nombre',
    'apellido',
    'direccion',
    'telefono',
    'correo',
    'acciones'
  ];

  @ViewChild('formularioCliente') formularioCliente!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.findAll();
  }

  ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
  this.paginator._intl.itemsPerPageLabel = 'Clientes por página:'; // ⛔️ Aquí explota si paginator es undefined
  this.paginator.pageSize = 5;
}


  // ==============================
  //  MÉTODOS DEL SERVICE (API)
  // ==============================

  findAll(): void {
    this.clienteService.findAll().subscribe((data) => {
      this.clientes = data;
      this.dataSource = new MatTableDataSource(this.clientes);

      // Asignar paginator y sort después de crear dataSource
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

      this.dataSource.filterPredicate = (data: Cliente, filter: string) =>
        Object.values(data).some(value =>
          value?.toString().toLowerCase().includes(filter)
        );
    });
  }

  save(): void {
    this.clienteService.save(this.cliente).subscribe(() => {
      this.findAll();
      this.resetForm();
    });
  }

  update(): void {
    if (this.idEditar !== null) {
      this.clienteService.update(this.idEditar, this.cliente).subscribe(() => {
        this.findAll();
        this.resetForm();
        this.editar = false;
        this.idEditar = null;
      });
    }
  }

  delete(): void {
    Swal.fire({
      title: "¿Desea eliminar el dato?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6"
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(this.cliente.idCliente).subscribe(() => {
          this.findAll();
          this.cliente = {} as Cliente;
          Swal.fire("Eliminado", "El cliente ha sido eliminado", "success");
        });
      } else {
        this.cliente = {} as Cliente;
      }
    });
  }

  // ==============================
  //  MÉTODOS DE INTERACCIÓN WEB
  // ==============================

  editarCliente(cliente: Cliente): void {
    this.cliente = { ...cliente };
    this.idEditar = cliente.idCliente;
    this.editar = true;

    setTimeout(() => {
      this.formularioCliente?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  editarClienteCancelar(form: NgForm): void {
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

  buscarCliente(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  resetForm(): void {
    this.cliente = {} as Cliente;
    this.editar = false;
    this.idEditar = null;
    this.formularioCliente?.nativeElement?.reset?.();
  }
}
