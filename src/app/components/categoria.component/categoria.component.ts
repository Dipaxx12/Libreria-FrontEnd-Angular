import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../../services/categoria';
import { Categoria } from '../../model/Categoria';

@Component({
  standalone:false,
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categorias: Categoria[] = [];
  categoria: Categoria = {
    idCategoria: null,
    categoria: '',
    descripcion: ''
  };

  idEditar: number | null = null;
  searchText: string = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.categoriaService.findAll().subscribe(data => {
      this.categorias = data;
    });
  }

  guardarCategoria(): void {
    if (this.idEditar) {
      this.categoriaService.update(this.idEditar, this.categoria).subscribe(() => {
        this.obtenerCategorias();
        this.limpiarFormulario();
      });
    } else {
      this.categoriaService.save(this.categoria).subscribe(() => {
        this.obtenerCategorias();
        this.limpiarFormulario();
      });
    }
  }

  editarCategoria(c: Categoria): void {
    this.categoria = { ...c };
    this.idEditar = c.idCategoria!;
  }

  eliminarCategoria(id: number): void {
    this.categoriaService.delete(id).subscribe(() => {
      this.obtenerCategorias();
    });
  }

  limpiarFormulario(): void {
    this.categoria = {
      idCategoria: null,
      categoria: '',
      descripcion: ''
    };
    this.idEditar = null;
  }

  get categoriasFiltradas(): Categoria[] {
    return this.categorias.filter(c =>
      c.categoria.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}
