import { Demand } from './domain/demands/Demand';

export type PendingTask = Demand;

export type EventType = 'reuniao' | 'conselho' | 'data_pedagogica' | 'entrega' | 'projeto' | 'outro';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  date: string;
  time?: string;
  location?: string;
  status: 'agendado' | 'concluido' | 'cancelado';
}

export interface MeetingActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  done: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'pais' | 'professores' | 'direcao' | 'conselho' | 'outro';
  pauta: string;
  decisions: string;
  actionItems: MeetingActionItem[];
  status: 'rascunho' | 'finalizada';
  createdAt: string;
}

export interface CommunicationTemplate {
  id: string;
  title: string;
  description: string;
  category: 'pais' | 'professor' | 'interno' | 'institucional';
  contentTemplate: string;
  placeholders: {
    key: string;
    label: string;
    placeholder: string;
  }[];
}

export type HistoryActionType = 'comunicado_gerado' | 'reuniao_finalizada' | 'tarefa_concluida' | 'evento_criado' | 'geral';

export interface HistoryItem {
  id: string;
  timestamp: string;
  actionType: HistoryActionType;
  title: string;
  details: string;
  category: 'pais' | 'professor' | 'direcional' | 'aluno' | 'sistema';
}
