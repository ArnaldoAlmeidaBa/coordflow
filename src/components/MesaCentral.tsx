import React, { useState } from 'react';
import { PendingTask } from '../types';
import { 
  Clock, 
  Trash2, 
  Plus, 
  Search, 
  Check, 
  Filter, 
  Info, 
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Users,
  GraduationCap,
  Pencil,
  X
} from 'lucide-react';

interface MesaCentralProps {
  tasks: PendingTask[];
  onAddTask: (task: Omit<PendingTask, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Omit<PendingTask, 'id' | 'createdAt'>) => void;
  onToggleTaskStatus: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onAddHistory: (title: string, details: string, actionType: any, category: any) => void;
}

export default function MesaCentral({ 
  tasks, 
  onAddTask, 
  onUpdateTask,
  onToggleTaskStatus, 
  onDeleteTask,
  onAddHistory
}: MesaCentralProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states for NEW task
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'baixa' | 'media' | 'alta'>('media');
  const [newCategory, setNewCategory] = useState<PendingTask['category']>('geral');
  const [newDeadline, setNewDeadline] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<PendingTask['priority']>('media');
  const [editCategory, setEditCategory] = useState<PendingTask['category']>('geral');
  const [editDeadline, setEditDeadline] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Handle submit new task
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle,
      priority: newPriority,
      status: 'pendente',
      deadline: newDeadline || new Date().toISOString().split('T')[0],
      category: newCategory,
      notes: newNotes.trim() || undefined
    });

    // Reset controls
    setNewTitle('');
    setNewPriority('media');
    setNewCategory('geral');
    setNewDeadline('');
    setNewNotes('');
    setIsFormOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.notes && task.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'todos' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'todos' || task.priority === selectedPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Category label helper
  const getCategoryLabel = (cat: PendingTask['category']) => {
    switch(cat) {
      case 'coord': return 'Coordenação';
      case 'familia': return 'Família';
      case 'professor': return 'Corpo Docente';
      case 'direcao': return 'Direção';
      case 'aluno': return 'Aluno';
      default: return 'Geral';
    }
  };

  // Color badges for category
  const getCategoryBadgeStyle = (cat: PendingTask['category']) => {
    switch(cat) {
      case 'coord': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'familia': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'professor': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'direcao': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'aluno': return 'bg-sky-100 text-sky-800 border-sky-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleStartEditTask = (task: PendingTask) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDeadline(task.deadline);
    setEditNotes(task.notes || '');
  };

  const handleCancelEditTask = () => {
    setEditingTaskId(null);
    setEditTitle('');
    setEditPriority('media');
    setEditCategory('geral');
    setEditDeadline('');
    setEditNotes('');
  };

  const handleSaveEditedTask = (task: PendingTask) => {
    if (!editTitle.trim()) return;

    onUpdateTask(task.id, {
      title: editTitle.trim(),
      priority: editPriority,
      status: task.status,
      deadline: editDeadline || task.deadline,
      category: editCategory,
      notes: editNotes.trim() || undefined
    });

    handleCancelEditTask();
  };

  return (
    <div className="space-y-2.5 md:space-y-3">
      {/* Main Panel Content split into actions + list */}
      <div className="tech-card">
        {/* Header controller */}
        <div className="tech-card-header bg-white px-3 py-2 [&_.tech-card-title]:text-[10px] [&_.tech-card-title]:tracking-[0.025em] [&_.tech-badge]:text-[8px] [&_.tech-btn-primary]:px-3 [&_.tech-btn-primary]:py-1 [&_.tech-btn-primary]:text-[8px]">
          <div className="flex items-center space-x-2">
            <span className="tech-card-title">Mesa Operacional de Demandas</span>
            <span className="tech-badge">{filteredTasks.length} Exibidas</span>
          </div>
          <button
            id="toggle-task-form"
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="tech-btn-primary flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isFormOpen ? 'Fechar Cadastro' : 'Cadastrar Demanda'}</span>
          </button>
        </div>

        {/* Action subtitle banner */}
        <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-150 text-[10px] text-slate-600 font-sans">
          Acompanhamento e rastreio de demandas imediatas de suporte pedagógico na unidade.
        </div>

        {/* Collapsible Action Add-Form Widget */}
        {isFormOpen && (
          <form id="new-task-form" onSubmit={handleSubmit} className="p-3 bg-[#F9FAFB] border-b border-slate-200 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">O que precisa ser feito? *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Ligar para responsáveis da Sofia (9º Ano) sobre notas de física..."
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-[#111827]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Prazo / Limite</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-[#111827] font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Prioridade</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-[#111827]"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta / Urgente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Categoria Aplicável</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-hidden"
                >
                  <option value="coord">Coordenação / Organização</option>
                  <option value="familia">Família / Responsáveis</option>
                  <option value="professor">Corpo Docente</option>
                  <option value="direcao">Direção Escolar</option>
                  <option value="aluno">Apoio a Alunos</option>
                  <option value="geral">Geral / Administrativo</option>
                </select>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Observações Críticas / Contexto</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ex: Aluna apresenta resistência em falar em público, acordado com psicólogo."
                  className="w-full px-3 py-2 bg-white border border-slate-250 rounded text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1.5 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-[#111827] text-white hover:bg-slate-800 text-xs font-bold rounded-full uppercase tracking-wider"
              >
                Confirmar Registro
              </button>
            </div>
          </form>
        )}

        {/* Filters and search controller */}
        <div className="p-2.5 border-b border-light flex flex-col xl:flex-row xl:items-center xl:justify-between gap-2 bg-slate-50 [&_.tech-btn-pill]:px-2 [&_.tech-btn-pill]:py-1 [&_.tech-btn-pill]:text-[8px]">
          {/* Quick search input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar demanda..."
              className="w-full pl-8.5 pr-3 py-1 bg-white border border-slate-250 rounded-lg text-[10px] font-sans text-slate-850 focus:outline-hidden"
            />
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1.5 text-[8px] font-mono text-slate-400 font-bold uppercase mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Público:</span>
            </div>
            
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`tech-btn-pill ${selectedCategory === 'todos' ? 'border-[#4F46E5] bg-indigo-50 text-[#4F46E5] font-bold' : ''}`}
            >
              Todos ({tasks.length})
            </button>

            <button
              onClick={() => setSelectedCategory('familia')}
              className={`tech-btn-pill ${selectedCategory === 'familia' ? 'border-amber-400 bg-amber-50 text-amber-800 font-bold' : ''}`}
            >
              Família
            </button>

            <button
              onClick={() => setSelectedCategory('professor')}
              className={`tech-btn-pill ${selectedCategory === 'professor' ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-bold' : ''}`}
            >
              Professores
            </button>

            <button
              onClick={() => setSelectedCategory('aluno')}
              className={`tech-btn-pill ${selectedCategory === 'aluno' ? 'border-sky-400 bg-sky-50 text-sky-800 font-bold' : ''}`}
            >
              Alunos
            </button>

            <button
              onClick={() => setSelectedCategory('direcao')}
              className={`tech-btn-pill ${selectedCategory === 'direcao' ? 'border-rose-400 bg-rose-50 text-rose-800 font-bold' : ''}`}
            >
              Direção
            </button>

            {/* Separator */}
            <span className="h-4 w-px bg-slate-250 mx-1"></span>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-2.5 py-[3px] text-[10px] bg-white text-slate-600 border border-slate-250 rounded focus:outline-hidden"
            >
              <option value="todos">Todas as Prioridades</option>
              <option value="alta">Apenas Alta / Urgente</option>
              <option value="media">Apenas Média</option>
              <option value="baixa">Apenas Baixa</option>
            </select>
          </div>
        </div>

        {/* Task List table/grid */}
        <div className="divide-y divide-slate-100 bg-white">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-200">
                <Check className="w-3.5 h-3.5" />
              </div>
              <h4 className="font-semibold text-slate-700 text-xs">Nenhum registro selecionado</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Você completou todas as tarefas dessa aba ou nenhuma atende o termo buscar.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                id={`task-item-${task.id}`}
                className={`p-3 flex items-start sm:items-center justify-between gap-3 transition-all hover:bg-slate-55/40 ${
                  task.status === 'concluido' ? 'opacity-65 bg-slate-50/40' : ''
                }`}
              >
                <div className="flex items-start space-x-3.5 max-w-4xl">
                  {/* Styled Checklist control */}
                  <button 
                    onClick={() => onToggleTaskStatus(task.id)}
                    className={`mt-1 sm:mt-0 flex-shrink-0 w-4.5 h-4.5 rounded border flex items-center justify-center transition-all ${
                      task.status === 'concluido' 
                        ? 'bg-[#111827] border-[#111827] text-white' 
                        : 'border-slate-350 hover:border-slate-800 bg-white'
                    }`}
                  >
                    {task.status === 'concluido' && <Check className="w-3 h-3" />}
                  </button>

                  <div className="space-y-[3px]">
                    {editingTaskId === task.id ? (
                      <div className="space-y-1.5 w-full">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value as PendingTask['priority'])}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                          >
                            <option value="alta">Alta / Urgente</option>
                            <option value="media">Média</option>
                            <option value="baixa">Baixa</option>
                          </select>
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value as PendingTask['category'])}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                          >
                            <option value="coord">Coordenação</option>
                            <option value="familia">Família</option>
                            <option value="professor">Corpo Docente</option>
                            <option value="direcao">Direção</option>
                            <option value="aluno">Aluno</option>
                            <option value="geral">Geral</option>
                          </select>
                          <input
                            type="date"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800"
                          />
                        </div>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Observações"
                          className="w-full px-2.5 py-[5px] border border-slate-300 rounded text-xs text-slate-800"
                        />
                      </div>
                    ) : (
                      <p className={`text-xs sm:text-sm text-slate-800 ${
                        task.status === 'concluido' ? 'line-through text-slate-400' : 'font-semibold'
                      }`}>
                        {task.title}
                      </p>
                    )}
                    
                    {/* Meta info block */}
                    {editingTaskId !== task.id && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Priority Tag */}
                      <span className={`text-[9px] font-bold font-mono px-2 py-[2px] rounded border uppercase tracking-wider ${
                        task.priority === 'alta' 
                          ? 'bg-rose-50 text-rose-800 border-rose-150' 
                          : task.priority === 'media'
                          ? 'bg-indigo-50 text-indigo-800 border-indigo-150'
                          : 'bg-slate-50 text-slate-500 border-slate-205'
                      }`}>
                        {task.priority === 'alta' ? 'Urgente' : task.priority === 'media' ? 'Média' : 'Baixa'}
                      </span>

                      {/* Stakeholder Category Tag */}
                      <span className={`text-[9px] font-semibold px-2 py-[2px] border rounded ${getCategoryBadgeStyle(task.category)}`}>
                        {getCategoryLabel(task.category)}
                      </span>

                      {/* Deadline label */}
                      <span className="text-[9px] text-slate-500 flex items-center font-mono font-medium">
                        <Clock className="w-3 h-3 mr-1 text-slate-400" />
                        Limite: {task.deadline.split('-').reverse().join('/')}
                      </span>
                    </div>
                    )}

                    {/* Task notes if present */}
                    {editingTaskId !== task.id && task.notes && (
                      <p className={`text-xs p-2 bg-[#F9FAFB] border-l border-[#111827] mt-[5px] rounded-r font-sans leading-relaxed ${
                        task.status === 'concluido' ? 'text-slate-400 border-slate-300' : 'text-slate-600'
                      }`}>
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleSaveEditedTask(task)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        title="Salvar edição"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditTask}
                        className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"
                        title="Cancelar edição"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEditTask(task)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      title="Editar demanda"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remover permanentemente a demanda: "${task.title}"?`)) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    title="Excluir demanda"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick reminder help footer */}
        <div className="p-3 bg-[#F9FAFB] border-t border-slate-150 flex items-center space-x-2 text-[10px] text-slate-600 font-sans">
          <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span>Filtre as demandas acima por tipo de público para agilizar o contato através do módulo Comunicação Assistida!</span>
        </div>
      </div>
    </div>
  );
}


