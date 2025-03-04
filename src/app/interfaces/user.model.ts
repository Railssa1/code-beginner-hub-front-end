export interface UserEstudante {
  id: number;
  email: string;
  password: string;
  name: string;
}

export interface UserMentor {
  id: number;
  email: string;
  password: string;
  skills: string[];
  seniority: string;
  name: string;
}
