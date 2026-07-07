import React, { useState } from 'react';
import { CalendarEvent, EventType } from '../types';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Filter, 
  Trash2, 
  Tag, 
  Award, 
  CheckCircle, 
  X,
  FileSpreadsheet,
  Network
} from 'lucide-react';

interface CalendarioProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
  onAddHistory: (title: string, details: string, actionType: any, category: any) => void;
}

export default function Calendario({
  events,
  onAddEvent,
  onDeleteEvent,
  onAddHistory
}: CalendarioProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('todos');

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<EventType>('reuniao');
  const [description, setDescription] = useState('');

  // Submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    onAddEvent({
      title,
      date,
      time: time || undefined,
      location: location.trim() || undefined,
      type,
      description: description.trim(),
      status: 'agendado'
    });

    onAddHistory(
      `Operando Calendário: ${title}`,
      `Criado novo evento de tipo [${type}] para dia ${date.split('-').reverse().join('/')}.`,
      'evento_criado',
      'sistema'
    );

    // Reset
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setType('reuniao');
    setDescription('');
    setIsFormOpen(false);
  };

  // Sort events chronologically by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Filter events
  const filteredEvents = sortedEvents.filter(ev => {
    return selectedTypeFilter === 'todos' || ev.type === selectedTypeFilter;
  });

  const getEventTypeLabel = (t: EventType) => {
    switch(t) {
      case 'conselho': return 'Conselho de Classe';
      case 'reuniao': return 'Reunião';
      case 'data_pedagogica': return 'Data/Oficina Pedagógica';
      case 'entrega': return 'Entrega de Notas/Docs';
      case 'projeto': return 'Projeto Institucional';
      default: return 'Outros';
    }
  };

  const getEventTypeColor = (t: EventType) => {
    switch(t) {
      case 'conselho': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reuniao': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'data_pedagogica': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'entrega': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'projeto': return 'bg-sky-100 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* LEFT: Quick Add Form & Dynamic Event Types Filter */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Toggle Form button */}
        <button
          id="btn-toggle-calendar"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
        >
          {isFormOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Fechar Agendador</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Agendar Novo Evento</span>
            </>
          )}
        </button>

        {/* Dynamic Filtering Widget */}
        <div className="tech-card">
          <div className="tech-card-header bg-white justify-between">
            <span className="tech-card-title flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <span>Mapeamento</span>
            </span>
            <span className="tech-badge">{events.length} Totais</span>
          </div>
          
          <div className="p-3 space-y-1 bg-white">
            {[
              { id: 'todos', label: 'Todos os Eventos', count: events.length },
              { id: 'conselho', label: 'Conselhos de Classe', count: events.filter(e => e.type === 'conselho').length },
              { id: 'reuniao', label: 'Reuniões Pedagógicas', count: events.filter(e => e.type === 'reuniao').length },
              { id: 'data_pedagogica', label: 'Datas / Formações', count: events.filter(e => e.type === 'data_pedagogica').length },
              { id: 'entrega', label: 'Prazos / Entregas', count: events.filter(e => e.type === 'entrega').length },
              { id: 'projeto', label: 'Projetos Institucionais', count: events.filter(e => e.type === 'projeto').length }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setSelectedTypeFilter(item.id)}
                className={`w-full text-left px-3 py-2 rounded text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                  selectedTypeFilter === item.id 
                    ? 'bg-indigo-50 text-[#4F46E5] font-black' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{item.label}</span>
                <span className="bg-slate-100 text-slate-600 px-2 py-0.2 rounded font-mono text-[10px] font-bold">
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Operational disclaimer helper card */}
        <div className="bg-amber-50/70 border border-amber-200 rounded p-4 space-y-2">
          <h5 className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
            <Award className="w-4.5 h-4.5 text-amber-700" />
            <span>Sinalização Ativa</span>
          </h5>
          <p className="text-[11px] text-amber-850 leading-relaxed font-sans">
            Mapeie recessos, marcos pedagógicos e datas de entrega de notas para antever conflitos de cronograma institucional com antecedência nas áreas administrativas.
          </p>
        </div>

      </div>

      {/* RIGHT: Chronological Operational Timeline Grid */}
      <div className="lg:col-span-8">
        
        {isFormOpen ? (
          /* EVENT CREATOR FORM CONTAINER */
          <form onSubmit={handleSubmit} className="tech-card bg-white p-6 space-y-4">
            <div className="pb-2 border-b border-slate-150">
              <span className="tech-card-title text-base block mb-0.5">Agendar Novo Evento ou Marco</span>
              <p className="text-xs text-slate-500">Mapeie no painel de datas para prover previsibilidade de entregas pedagógicas.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Nome do Evento / Entrega *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Entrega de Planos de Estudos Dirigidos"
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs text-[#111827] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Classificação do Evento</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-250 rounded text-xs text-[#111827] focus:outline-hidden"
                >
                  <option value="conselho">Conselho de Classe</option>
                  <option value="reuniao">Reunião de Pais/Docentes</option>
                  <option value="data_pedagogica">Data / Oficina Pedagógica</option>
                  <option value="entrega">Prazo Limite / Entregas de Notas</option>
                  <option value="projeto">Projeto Institucional</option>
                  <option value="outro">Outro / Geral</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 font-mono">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-sans">Data do Calendário *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs text-slate-850 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1 font-mono">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block font-sans">Horário de Início</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs text-slate-855 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Local de Realização</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Sala de Inovação Pedagógica"
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs text-[#111827] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">Descrição / Instruções / Observações *</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Professores devem trazer os roteiros impressos para assinatura cooperativa conjunta..."
                className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs leading-relaxed text-[#111827] focus:outline-hidden"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold uppercase tracking-wider cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="tech-btn-primary px-4 py-2 bg-[#111827] hover:bg-slate-800"
              >
                Registrar Evento
              </button>
            </div>
          </form>
        ) : (
          /* RENDER TIMELINE GRID LIST */
          <div className="tech-card">
            <div className="tech-card-header bg-white">
              <span className="tech-card-title">Cronograma de Atividades Internas</span>
              <span className="tech-badge bg-indigo-50 text-[#4F46E5] border-indigo-100">{filteredEvents.length} Ativos</span>
            </div>

            <div className="p-4 bg-slate-50 border-b border-slate-150 text-[11px] text-slate-500 leading-normal">
              Visualização sequencial das próximas datas cronológicas pautadas na coordenação.
            </div>

            <div className="p-5 space-y-4 bg-white" id="events-timeline">
              {filteredEvents.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs font-sans">
                  Nenhum evento mapeado para os filtros selecionados no momento.
                </div>
              ) : (
                filteredEvents.map(ev => {
                  return (
                    <div 
                      key={ev.id} 
                      id={`ev-card-${ev.id}`}
                      className="p-4 bg-white border border-slate-200 rounded hover:border-[#4F46E5] transition-all flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                    >
                      {/* Left: date + type badges */}
                      <div className="flex items-start space-x-3.5">
                        
                        {/* Elegant Date block */}
                        <div className="flex-shrink-0 w-14 py-2 bg-indigo-50/50 rounded border border-indigo-100 flex flex-col items-center justify-center text-center font-mono select-none">
                          <span className="text-[10px] text-indigo-500 uppercase font-black">Dia</span>
                          <span className="text-lg font-extrabold text-indigo-900 leading-none mt-0.5 font-mono">
                            {ev.date.split('-')[2]}
                          </span>
                          <span className="text-[9px] text-[#4F46E5] mt-0.5 font-mono uppercase">
                            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][parseInt(ev.date.split('-')[1]) - 1]}
                          </span>
                        </div>
 
                        {/* Middle info */}
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className={`text-[9px] font-bold px-2 py-0.2 border rounded uppercase tracking-wider ${getEventTypeColor(ev.type)}`}>
                              {getEventTypeLabel(ev.type)}
                            </span>
                            
                            {ev.time && (
                              <span className="text-[10px] text-slate-500 flex items-center font-mono">
                                <Clock className="w-3 h-3 mr-1" />
                                {ev.time}
                              </span>
                            )}
 
                            {ev.location && (
                              <span className="text-[10px] text-slate-550 flex items-center font-sans tracking-wide">
                                <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                                {ev.location}
                              </span>
                            )}
                          </div>
 
                          <h4 className="text-xs sm:text-xs font-black text-slate-900 leading-tight">
                            {ev.title}
                          </h4>
 
                          <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-xl">
                            {ev.description}
                          </p>
                        </div>
 
                      </div>
 
                      {/* Right actions */}
                      <div className="flex sm:flex-col items-start justify-end sm:self-center">
                        <button
                          onClick={() => {
                            if (confirm(`Excluir permanentemente o evento: "${ev.title}"?`)) {
                              onDeleteEvent(ev.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Remover evento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
 
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
 
      </div>
    </div>
  );
}

