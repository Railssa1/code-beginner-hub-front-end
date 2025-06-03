export interface Topic {
  id: number;
  title: string;
  languages: string[];
  description: string;
  author?: string;
  completed: boolean;
  inProgress?: boolean;
  mentorId?: number;
  mentorName?: string;
  studentId: number;
  chatReadByMentor?: boolean;
  chatReadByStudent?: boolean;
  chatConcluded?: boolean;
}

export interface TopicoChat {
  id?: number;
  title: string;
  description: string;
  languages: string[];
  author: string;
  studentId: number;
  mentorId?: number;
  mentorName?: string;
  status?: 'aberto' | 'em_andamento' | 'concluido';
}
