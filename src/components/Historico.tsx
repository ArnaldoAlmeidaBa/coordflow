import React, { useState } from 'react';
import { HistoryItem, HistoryActionType } from '../types';
import { 
  History, 
  Search, 
  MessageSquare, 
  CheckCircle, 
  FolderPlus, 
  Database, 
  Trash2, 
  RotateCcw, 
  Clock, 
  UserCheck, 
  FileText,
  Bookmark,
  Share2
} from 'lucide-react';

interface HistoricoProps {
  historyItems: HistoryItem[];
  onClearHistory: () => void;
  onRestoreDefaultHistory: () => void;
}

export default function Historico({
  historyItems,
  onClearHistory,
  onRestoreDefaultHistory
}: HistoricoProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const normalizeText = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const handleCopyLog = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter logs
  const normalizedSearchTerm = normalizeText(searchTerm);
  const filteredLogs = [...historyItems]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .filter(log => {
      const searchableText = normalizeText(`${log.title} ${log.details}`);
      const matchesSearch = normalizedSearchTerm.length === 0 || searchableText.includes(normalizedSearchTerm);
      const matchesCategory = normalizedSearchTerm.length > 0
        ? true
        : selectedTagFilter === 'todos' || log.category === selectedTagFilter;
      
      return matchesSearch && matchesCategory;
    });

  // Action Icon helper representing what took place
  const getActionIcon = (actionType: HistoryActionType) => {
    switch (actionType) {
      case 'comunicado_gerado':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-150 border border-amber-200 text-amber-700 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
        );
      case 'reuniao_finalizada':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-150 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        );
      case 'tarefa_concluida':
        return (
          <div className="w-8 h-8 rounded-full bg-indigo-150 border border-indigo-200 text-indigo-700 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        );
      case 'evento_criado':
        return (
          <div className="w-8 h-8 rounded-full bg-purple-150 border border-purple-200 text-purple-700 flex items-center justify-center">
            <FolderPlus className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-150 border border-slate-200 text-slate-700 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        );
    }
  };

  const getCategoryLabel = (cat: HistoryItem['category']) => {
    switch (cat) {
      case 'pais': return 'Com Pais';
      case 'professor': return 'Com Docentes';
      case 'direcional': return 'Diretoria';
      case 'aluno': return 'Com Alunos';
      default: return 'Geral/Sistema';
    }
  };

  const getCategoryColor = (cat: HistoryItem['category']) => {
    switch (cat) {
      case 'pais': return 'bg-amber-100 text-amber-800';
      case 'professor': return 'bg-emerald-100 text-emerald-800';
      case 'direcional': return 'bg-rose-100 text-rose-800';
      case 'aluno': return 'bg-sky-100 text-sky-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="tech-card bg-white">
      
      {/* Header action controls */}
      <div className="tech-card-header bg-white justify-between">
        <div className="space-y-0.5">
          <span className="tech-card-title">Histórico Pedagógico de Ações</span>
          <p className="text-[11px] text-slate-500 leading-normal font-sans">Memória operacional consultável de registros gerados e comunicados emitidos.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onRestoreDefaultHistory}
            className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-800 py-1.5 px-3 border border-slate-200 rounded-full hover:bg-slate-50 font-medium transition-colors cursor-pointer"
            title="Resetar historico"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Iniciais</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Deseja limpar todos os registros do histórico? Esta ação é irreversível.')) {
                onClearHistory();
              }
            }}
            className="flex items-center space-x-1 text-xs text-rose-600 hover:bg-rose-50 py-1.5 px-3 rounded-full transition-colors font-medium border border-rose-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5 bg-white">
        {/* Filtering Controller */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 pb-2 border-b border-slate-100">
          
          {/* Keyword Search */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar registros de ações..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-250 rounded text-xs font-sans text-slate-850 focus:outline-hidden"
            />
          </div>

          {/* Stakeholder tags filters */}
          <div className="lg:col-span-8 flex flex-wrap items-center gap-1.5 lg:justify-end">
            <span className="text-[10px] text-slate-500 font-mono mr-2">
              {filteredLogs.length} resultado{filteredLogs.length === 1 ? '' : 's'}
            </span>
            <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-450 mr-1.5 font-mono">Segmento:</span>
            {[
              { id: 'todos', label: 'Todos' },
              { id: 'pais', label: 'Pais' },
              { id: 'professor', label: 'Docentes' },
              { id: 'direcional', label: 'Diretoria' },
              { id: 'aluno', label: 'Alunos' },
              { id: 'sistema', label: 'Administrativo' }
            ].map(tag => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedTagFilter(tag.id)}
                className={`px-3 py-1 text-[11px] font-bold rounded transition-colors cursor-pointer ${
                  selectedTagFilter === tag.id
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

        </div>

        {/* Chronological vertical tracking tree */}
        <div className="relative border-l border-slate-150 pl-6 ml-4 space-y-6 pt-2">
          {filteredLogs.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs font-sans">
              Nenhum registro encontrado no histórico de processos pedagógicos.
            </div>
          ) : (
            filteredLogs.map(log => {
              const dateObj = new Date(log.timestamp);
              const dateString = dateObj.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              });
              const timeString = dateObj.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={log.id} id={`history-row-${log.id}`} className="relative flex items-start space-x-3.5">
                  
                  {/* Visual Timeline Circle Line bullet pin */}
                  <span className="absolute -left-[39px] top-1 bg-white p-0.5 rounded-full z-10 select-none">
                    {getActionIcon(log.actionType)}
                  </span>

                  {/* Tracking item details wrapper */}
                  <div className="bg-white p-4 border border-slate-200 rounded flex-1 hover:border-[#4F46E5] transition-all flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="space-y-1.5">
                      
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-semibold mb-0.5">
                        <span className={`px-2 py-0.2 rounded font-bold text-[9px] uppercase tracking-wider ${getCategoryColor(log.category)}`}>
                          {getCategoryLabel(log.category)}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono flex items-center font-bold">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {dateString} às {timeString}
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 text-xs sm:text-[13px] leading-tight">{log.title}</h4>
                      <p className="text-xs text-slate-600 font-sans leading-relaxed">{log.details}</p>
                    </div>

                    {/* Copy actions inside logs */}
                    <button
                      type="button"
                      onClick={() => handleCopyLog(log.id, `${log.title}\n${log.details}`)}
                      className={`p-2 rounded border transition-colors flex-shrink-0 self-end md:self-start cursor-pointer ${
                        copiedId === log.id 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                          : 'border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-400'
                      }`}
                      title="Copiar logs"
                    >
                      {copiedId === log.id ? (
                        <div className="text-[10px] font-mono uppercase tracking-wider font-bold">Copiado</div>
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>

                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
