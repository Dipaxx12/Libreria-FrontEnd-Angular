import { Autor } from './autor.model';
import { Categoria } from './Categoria';

export interface Libro {
  idLibro: number;
  titulo: string;
  editorial: string;
  numPaginas: number;
  edicion: string;
  idioma: string;
  fechaPublicacion: Date;
  descripcion: string;
  tipoPasta: string;
  isbn: string;
  numEjemplares: number;
  portada: string;
  presentacion: string;
  precio: number;
  categoria: Categoria;
  autor: Autor;
  
  [key: string]: any;
}
