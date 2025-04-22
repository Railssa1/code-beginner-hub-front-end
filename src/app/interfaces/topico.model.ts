export interface Topic {
  id: number;
  title: string;
  languages: string[];
  description: string;
  author?: string;
  completed: boolean;
}
