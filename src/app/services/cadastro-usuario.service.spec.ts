/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CadastroUsuarioService } from './cadastro-usuario.service';

describe('Service: CadastroUsuario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CadastroUsuarioService]
    });
  });

  it('should ...', inject([CadastroUsuarioService], (service: CadastroUsuarioService) => {
    expect(service).toBeTruthy();
  }));
});
