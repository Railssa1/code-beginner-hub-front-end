export interface Login {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  email: string;
}

export interface EsqueciSenha {
  email: string;
}

export interface RedefinirSenha {
  email: string;
  newPassword: string;
}
