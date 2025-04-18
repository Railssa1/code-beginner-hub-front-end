import { Routes } from '@angular/router';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { LoginComponent } from './login/login.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { EsqueciSenhaComponent } from './esqueci-senha/esqueci-senha.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { TopicosComponent } from './topicos/topicos.component';
import { CriarTopicoComponent } from './criar-topico/criar-topico.component';
import { AuthGuard } from './auth.guard';
import { AlreadyAuthGuard } from './already-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AlreadyAuthGuard] },
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent, canActivate: [AlreadyAuthGuard] },
  { path: 'esqueci-senha', component: EsqueciSenhaComponent, canActivate: [AlreadyAuthGuard] },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent, canActivate: [AlreadyAuthGuard] },
  { path: 'perfil-usuario', component: PerfilUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'topicos', component: TopicosComponent, canActivate: [AuthGuard] },
  { path: 'criar-topico', component: CriarTopicoComponent, canActivate: [AuthGuard] },
];
