export interface Topic {
  id: number;
  title: string;
  languages: string[];
  description: string;
  author?: string;
  completed: boolean;
  mentorId?: string;
  mentorName?: string;
}

export interface TopicoChat {
  id?: string;
  title: string;
  description: string;
  languages: string[];
  author: string;
  studentId: string;
  mentorId?: string;
  mentorName?: string;
  status?: 'aberto' | 'em_andamento' | 'concluido';
}

