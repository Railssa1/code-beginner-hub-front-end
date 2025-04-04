import { Routes } from '@angular/router';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { LoginComponent } from './login/login.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AuthGuard } from './auth.guard';
import { EsqueciSenhaComponent } from './esqueci-senha/esqueci-senha.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { NavbarComponent } from './_components/navbar/navbar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },
  { path: 'perfil-usuario', component: PerfilUsuarioComponent},
];

