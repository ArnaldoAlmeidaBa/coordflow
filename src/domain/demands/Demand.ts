export interface Demand {
  id: string;
  title: string;
  priority: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_andamento' | 'concluido';
  deadline: string;
  category: 'coord' | 'familia' | 'professor' | 'direcao' | 'aluno' | 'geral';
  notes?: string;
  createdAt: string;
}
