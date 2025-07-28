import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { AutorComponent } from './components/autor.component/autor.component';
import { CategoriaComponent } from './components/categoria.component/categoria.component';

const routes: Routes = [
  { path: 'clientes', component: ClienteComponent },
  { path: 'autores', component: AutorComponent }, // 👈 nueva ruta
  { path: 'categorias', component: CategoriaComponent }, // 👈 AÑADE ESTA RUTA
  { path: '', redirectTo: 'clientes', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
