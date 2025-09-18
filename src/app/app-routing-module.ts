import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { AutorComponent } from './components/autor.component/autor.component';
import { CategoriaComponent } from './components/categoria.component/categoria.component';
import { LibroComponent } from './components/libro/libro.component';
import { CartPageComponent } from './components/cart-page/cart-page.component';

const routes: Routes = [
  { path: 'clientes', component: ClienteComponent },
  { path: 'autores', component: AutorComponent }, 
  { path: 'categorias', component: CategoriaComponent }, 
  { path: 'libros', component: LibroComponent },
  { path: 'carrito', component: CartPageComponent }, 
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
