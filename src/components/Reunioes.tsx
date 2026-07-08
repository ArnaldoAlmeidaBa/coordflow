import React, { useState } from 'react';
import { Meeting, MeetingActionItem } from '../types';
import { 
  FileText, 
  Plus, 
  Calendar, 
  UserCheck, 
  Clock, 
  Check, 
  Trash2, 
  Save, 
  Archive, 
  CheckCircle,
  Briefcase,
  Layers,
  Sparkles,
  Pencil,
  X
} from 'lucide-react';

interface ReunioesProps {
  meetings: Meeting[];
  onAddMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void;
  onUpdateMeetingActions: (id: string, actionItems: MeetingActionItem[]) => void;
  onDeleteMeeting: (id: string) => void;
  onAddHistory: (title: string, details: string, actionType: any, category: any) => void;
}

export default function Reunioes({
  meetings,
  onAddMeeting,
  onUpdateMeetingActions,
  onDeleteMeeting,
  onAddHistory
}: ReunioesProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(meetings[0]?.id || null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<Meeting['type']>('professores');
  const [pauta, setPauta] = useState('');
  const [decisions, setDecisions] = useState('');
  
  // Temporary action items inside the Form
  const [pendingActionText, setPendingActionText] = useState('');
  const [pendingAssignee, setPendingAssignee] = useState('');
  const [pendingDueDate, setPendingDueDate] = useState('');
  const [formActionItems, setFormActionItems] = useState<Omit<MeetingActionItem, 'id' | 'done'>[]>([]);

  // Selected meeting dynamic actions editing
  const [newActionText, setNewActionText] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editActionText, setEditActionText] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  // Handle adding temporary action in form
  const handleAddTempAction = () => {
    if (!pendingActionText.trim()) return;
    setFormActionItems(prev => [
      ...prev,
      {
        text: pendingActionText,
        assignee: pendingAssignee.trim() || 'Não Atribuído',
        dueDate: pendingDueDate || new Date().toISOString().split('T')[0]
      }
    ]);
    setPendingActionText('');
    setPendingAssignee('');
    setPendingDueDate('');
  };

  const handleRemoveTempAction = (index: number) => {
    setFormActionItems(prev => prev.filter((_, idx) => idx !== index));
  };

  // Submit complete meeting
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Map temp action items
    const actionItemsMapped: MeetingActionItem[] = formActionItems.map((item, idx) => ({
      id: `mai-new-${Date.now()}-${idx}`,
      text: item.text,
      assignee: item.assignee,
      dueDate: item.dueDate,
      done: false
    }));

    onAddMeeting({
      title,
      date: date || new Date().toISOString().split('T')[0],
      time: time || undefined,
      type,
      pauta,
      decisions,
      actionItems: actionItemsMapped,
      status: 'finalizada'
    });

    onAddHistory(
      `Reunião Registrada: ${title}`,
      `Ata de conselho/conversa sobre ${type} registrada formalmente. ${actionItemsMapped.length} deliberações geradas.`,
      'reuniao_finalizada',
      type === 'pais' ? 'pais' : 'professor'
    );

    // Reset fields
    setTitle('');
    setDate('');
    setTime('');
    setType('professores');
    setPauta('');
    setDecisions('');
    setFormActionItems([]);
    setIsFormOpen(false);
  };

  // Add Action Item to an EXISTING Meeting
  const handleAddNewActionToSelected = () => {
    if (!selectedMeetingId || !newActionText.trim()) return;
    const selectedMeeting = meetings.find(m => m.id === selectedMeetingId);
    if (!selectedMeeting) return;

    const newItem: MeetingActionItem = {
      id: `mai-add-${Date.now()}`,
      text: newActionText.trim(),
      assignee: newAssignee.trim() || 'Não Designado',
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      done: false
    };

    const updatedActions = [...selectedMeeting.actionItems, newItem];
    onUpdateMeetingActions(selectedMeetingId, updatedActions);

    onAddHistory(
      `Nova Ação de Reunião`,
      `Atribuída tarefa [${newItem.text}] para ${newItem.assignee}.`,
      'geral',
      selectedMeeting.type === 'pais' ? 'pais' : 'professor'
    );

    setNewActionText('');
    setNewAssignee('');
    setNewDueDate('');
  };

  // Toggle action item checkbox in context
  const handleToggleActionDone = (meetingId: string, actionId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    const updated = meeting.actionItems.map(item => {
      if (item.id === actionId) {
        const nextState = !item.done;
        
        if (nextState) {
          onAddHistory(
            `Deliberação Resolvida`,
            `Concluído item: "${item.text}" sob responsabilidade de [${item.assignee}].`,
            'tarefa_concluida',
            meeting.type === 'pais' ? 'pais' : 'professor'
          );
        }
        
        return { ...item, done: nextState };
      }
      return item;
    });

    onUpdateMeetingActions(meetingId, updated);
  };

  const handleStartEditAction = (item: MeetingActionItem) => {
    setEditingActionId(item.id);
    setEditActionText(item.text);
    setEditAssignee(item.assignee);
    setEditDueDate(item.dueDate);
  };

  const handleCancelEditAction = () => {
    setEditingActionId(null);
    setEditActionText('');
    setEditAssignee('');
    setEditDueDate('');
  };

  const handleSaveEditedAction = (meetingId: string, actionId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting || !editActionText.trim()) return;

    const originalItem = meeting.actionItems.find(item => item.id === actionId);
    if (!originalItem) return;
    const nextText = editActionText.trim();
    const nextAssignee = editAssignee.trim() || 'Não Designado';
    const nextDueDate = editDueDate || originalItem.dueDate;

    const updatedItems = meeting.actionItems.map(item => (
      item.id === actionId
        ? {
            ...item,
            text: nextText,
            assignee: nextAssignee,
            dueDate: nextDueDate
          }
        : item
    ));

    onUpdateMeetingActions(meetingId, updatedItems);

    onAddHistory(
      'Encaminhamento Editado',
      `Antes: "${originalItem.text}" | Resp.: ${originalItem.assignee} | Prazo: ${originalItem.dueDate.split('-').reverse().join('/')}.\nDepois: "${nextText}" | Resp.: ${nextAssignee} | Prazo: ${nextDueDate.split('-').reverse().join('/')}.`,
      'geral',
      meeting.type === 'pais' ? 'pais' : 'professor'
    );

    handleCancelEditAction();
  };

  const handleDeleteAction = (meetingId: string, actionId: string) => {
    const meeting = meetings.find(m => m.id === meetingId);
    if (!meeting) return;

    const target = meeting.actionItems.find(item => item.id === actionId);
    if (!target) return;

    if (!confirm(`Excluir este encaminhamento?\n\n"${target.text}"`)) return;

    const updatedItems = meeting.actionItems.filter(item => item.id !== actionId);
    onUpdateMeetingActions(meetingId, updatedItems);

    onAddHistory(
      'Encaminhamento Excluído',
      `Item removido: "${target.text}" (responsável: ${target.assignee}).`,
      'geral',
      meeting.type === 'pais' ? 'pais' : 'professor'
    );

    if (editingActionId === actionId) {
      handleCancelEditAction();
    }
  };

  // Delete entire meeting
  const handleDeleteMeetingClick = (id: string) => {
    const meeting = meetings.find(m => m.id === id);
    if (confirm(`Excluir permanentemente o registro de ata e deliberações de: "${meeting?.title}"?`)) {
      onDeleteMeeting(id);
      setSelectedMeetingId(meetings[0]?.id || null);
    }
  };

  // Active meeting context
  const activeMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0] || null;

  const getTypeLabel = (t: Meeting['type']) => {
    switch(t) {
      case 'pais': return 'Pais / Responsáveis';
      case 'professores': return 'Corpo Docente';
      case 'direcao': return 'Diretoria';
      case 'conselho': return 'Conselho de Classe';
      default: return 'Geral';
    }
  };

  const getTypeBadgeStyle = (t: Meeting['type']) => {
    switch(t) {
      case 'pais': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'professores': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'conselho': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'direcao': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      
      {/* List / Tabs selection on Left Side */}
      <div className="lg:col-span-4 space-y-2.5">
        
        {/* Register Action button */}
        <button
          id="btn-new-meeting"
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setFormActionItems([]);
          }}
          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? 'Ver Atas Registradas' : 'Registrar Nova Ata'}</span>
        </button>

        <div className="tech-card">
          <div className="tech-card-header bg-white justify-between">
            <span className="tech-card-title">Atas Recentes</span>
            <span className="tech-badge">{meetings.length} Registradas</span>
          </div>

          <div className="p-2 bg-slate-50 border-b border-slate-150 text-[10px] text-slate-500 leading-normal">
            Acompanhamento de acordos estabelecidos com o corpo docente ou responsáveis na unidade.
          </div>
          
          <div className="p-2 space-y-[5px] max-h-[260px] overflow-y-auto pr-1 bg-white">
            {meetings.length === 0 ? (
              <p className="text-[11px] text-slate-400 py-2 text-center">Nenhuma ata registrada.</p>
            ) : (
              meetings.map(m => (
                <button
                  key={m.id}
                  id={`meeting-tab-${m.id}`}
                  onClick={() => {
                    setSelectedMeetingId(m.id);
                    setIsFormOpen(false);
                  }}
                  className={`w-full text-left p-1.5 rounded border text-xs transition-all flex flex-col space-y-[3px] ${
                    activeMeeting?.id === m.id && !isFormOpen
                      ? 'border-[#4F46E5] bg-indigo-50/50'
                      : 'border-slate-150 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] text-slate-450 font-bold">
                      {m.date.split('-').reverse().join('/')}
                    </span>
                    <span className={`text-[9px] font-semibold px-2 py-[2px] rounded ${getTypeBadgeStyle(m.type)}`}>
                      {getTypeLabel(m.type)}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-[11px] line-clamp-1 leading-snug">{m.title}</p>
                  
                  {/* Decisions snippet */}
                  <p className="text-slate-500 text-[10px] line-clamp-1 leading-relaxed">
                    {m.pauta || 'Sem pauta registrada'}
                  </p>
                  
                  <div className="pt-1.5 flex items-center justify-between text-[9px] text-slate-400 font-medium border-t border-slate-100">
                    <span>Deliberações:</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-[2px] rounded text-slate-600 font-bold">
                      {m.actionItems.filter(a=>a.done).length}/{m.actionItems.length} Resolvidos
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Main interactive area on Right Side */}
      <div className="lg:col-span-8">
        
        {/* COLLAPSIBLE FORM: Write Meeting Minutes */}
        {isFormOpen ? (
          <form onSubmit={handleSubmit} className="tech-card bg-white p-2.5 space-y-2.5">
            <div className="pb-1.5 border-b border-slate-100">
              <span className="tech-card-title text-[11px] block mb-0.5">Registrar Nova Ata de Reunião</span>
              <p className="text-[11px] text-slate-500 leading-snug">Registre de forma simples a pauta, decisões imediatas e atribua responsáveis com prazo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Título / Tema Principal *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Conselho Classe 3º Bimestre ou Mediação Aluno João"
                  className="w-full px-3 py-[5px] bg-white border border-slate-250 rounded text-[11px] font-sans text-[#111827] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Data</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-2 py-[5px] bg-white border border-slate-250 rounded text-[11px] text-slate-850 font-mono focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Tipo Reunião</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-2 py-[5px] bg-white border border-slate-250 rounded text-[11px] text-slate-800 focus:outline-hidden"
                  >
                    <option value="professores">Corpo Docente</option>
                    <option value="pais">Pais / Responsáveis</option>
                    <option value="conselho">Conselho de Classe</option>
                    <option value="direcao">Diretoria</option>
                    <option value="outro">Outro / Geral</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pauta (Agenda text) */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block">Pauta da Reunião (Assuntos Discutidos) *</label>
              <textarea
                rows={2}
                required
                value={pauta}
                onChange={(e) => setPauta(e.target.value)}
                placeholder="Enumere em parágrafos os principais tópicos abordados para consulta futura..."
                className="w-full px-3 py-[5px] bg-white border border-slate-250 rounded text-[11px] leading-relaxed text-[#111827] focus:outline-hidden"
              />
            </div>

            {/* Decisões Finais (Doc Decisions) */}
            <div className="space-y-1 bg-[#F9FAFB] p-2 rounded border border-slate-200">
              <label className="text-[9px] uppercase tracking-widest font-extrabold text-amber-900 block">Decisões Registradas (Acordos / Encaminhamentos) *</label>
              <textarea
                rows={2}
                required
                value={decisions}
                onChange={(e) => setDecisions(e.target.value)}
                placeholder="Quais foram as deliberações e acordos finais da reunião?"
                className="w-full px-3 py-[5px] bg-white border border-slate-250 rounded text-[11px] leading-relaxed text-[#111827] focus:outline-hidden"
              />
            </div>

            {/* TEMPORARY DELIBERATIONS (Encaminhamentos / Tarefas) */}
            <div className="space-y-2 pt-1.5 border-t border-slate-100">
              <h4 className="text-[9px] uppercase font-extrabold tracking-widest text-[#111827]">Adicionar Deliberações e Planos de Ação</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-1.5 items-end bg-slate-50 p-2 rounded border border-slate-200">
                <div className="md:col-span-6 space-y-1">
                  <label className="text-[9px] font-semibold text-slate-500">O que precisa ser feito?</label>
                  <input
                    type="text"
                    value={pendingActionText}
                    onChange={(e) => setPendingActionText(e.target.value)}
                    placeholder="Ex: Enviar termo pedagógico por correio..."
                    className="w-full px-2.5 py-[5px] bg-white border border-slate-200 rounded-md text-[11px] text-slate-800"
                  />
                </div>

                <div className="md:col-span-3 space-y-1">
                  <label className="text-[9px] font-semibold text-slate-500">Quem fará?</label>
                  <input
                    type="text"
                    value={pendingAssignee}
                    onChange={(e) => setPendingAssignee(e.target.value)}
                    placeholder="Ex: Prof. Roberto"
                    className="w-full px-2.5 py-[5px] bg-white border border-slate-200 rounded-md text-[11px] text-slate-800"
                  />
                </div>

                <div className="md:col-span-2 space-y-1 font-mono">
                  <label className="text-[9px] font-semibold text-slate-500 font-sans">Prazo</label>
                  <input
                    type="date"
                    value={pendingDueDate}
                    onChange={(e) => setPendingDueDate(e.target.value)}
                    className="w-full px-2 py-[5px] bg-white border border-slate-200 rounded-md text-[11px] text-slate-850"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddTempAction}
                  className="md:col-span-1 p-[5px] bg-slate-800 text-white rounded hover:bg-slate-900 transition-colors flex items-center justify-center font-bold font-mono cursor-pointer"
                  title="Incluir na Ata"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Temporary lists preview */}
              {formActionItems.length > 0 && (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded max-h-[120px] overflow-y-auto bg-white">
                  {formActionItems.map((item, idx) => (
                    <div key={idx} className="p-[5px] flex items-start justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">{item.text}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">
                          Responsável: <span className="font-semibold text-slate-600">{item.assignee}</span> • Prazo: <span className="font-mono">{item.dueDate.split('-').reverse().join('/')}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTempAction(idx)}
                        className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form actions submitting */}
            <div className="pt-2 border-t border-slate-155 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-[5px] text-[11px] text-slate-500 hover:text-slate-800 font-bold uppercase tracking-wider cursor-pointer"
              >
                Voltar
              </button>
              
              <button
                type="submit"
                className="flex items-center space-x-1 bg-[#111827] hover:bg-slate-800 text-white px-3.5 py-[5px] rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Save className="w-3 h-3" />
                <span>Salvar Ata Registrada</span>
              </button>
            </div>

          </form>
        ) : (
          /* DISPLAY ACTIVE PRE-RECORDED MEETING VIEW */
          activeMeeting ? (
            <div className="tech-card bg-white">
              
              {/* Card Meta details */}
              <div className="tech-card-header bg-white justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-bold px-2 py-[2px] rounded uppercase ${getTypeBadgeStyle(activeMeeting.type)}`}>
                      {getTypeLabel(activeMeeting.type)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 font-bold">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {activeMeeting.date.split('-').reverse().join('/')} {activeMeeting.time && `às ${activeMeeting.time}`}
                    </span>
                  </div>
                  <h3 id="active-meeting-title" className="text-xs font-black text-slate-900 mt-1 tracking-tight">{activeMeeting.title}</h3>
                </div>

                <button
                  onClick={() => handleDeleteMeetingClick(activeMeeting.id)}
                  className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-rose-600 px-2.5 py-[3px] hover:bg-rose-50 rounded transition-colors self-start cursor-pointer"
                  title="Deletar reunião"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Excluir</span>
                </button>
              </div>

              {/* Grid content containing: Agenda and Decisions */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border-b border-slate-150">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Pauta da Conversa</span>
                  </h4>
                  <div className="p-3 bg-[#F9FAFB] border border-slate-205 rounded leading-relaxed text-xs text-slate-755 min-h-[110px] whitespace-pre-line font-sans">
                    {activeMeeting.pauta}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-850 text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                    <Archive className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Decisões e Acordos</span>
                  </h4>
                  <div className="p-3 bg-emerald-50/25 border border-emerald-150 rounded leading-relaxed text-xs text-slate-800 min-h-[110px] whitespace-pre-line font-sans">
                    {activeMeeting.decisions || 'Nenhuma decisão formalizada.'}
                  </div>
                </div>
              </div>

              {/* Action items of the selected meeting */}
              <div className="p-3 space-y-2.5 bg-white">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wide flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-purple-600" />
                    <span>Responsáveis e Planos de Ação Criados</span>
                  </h4>
                  <span className="text-[9px] bg-slate-100 text-slate-700 font-mono font-bold px-2 py-[2px] rounded border border-slate-200">
                    {activeMeeting.actionItems.filter(ai => ai.done).length} de {activeMeeting.actionItems.length} Resolvidos
                  </span>
                </div>

                {/* Grid items representing action checklist */}
                <div id="selected-meeting-actions" className="space-y-1.5">
                  {activeMeeting.actionItems.length === 0 ? (
                    <div className="p-2.5 bg-slate-50 text-center rounded text-xs text-slate-400 font-sans">
                      Nenhum encaminhamento ou demanda registrada para esta ata.
                    </div>
                  ) : (
                    activeMeeting.actionItems.map(item => (
                      <div 
                        key={item.id}
                        className={`p-2.5 bg-white border rounded flex items-center justify-between gap-3 transition-colors ${
                          item.done 
                            ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-75' 
                            : 'border-slate-250 text-slate-850'
                        }`}
                      >
                        <div className="flex items-start space-x-2.5 text-xs flex-1">
                          <button
                            type="button"
                            onClick={() => handleToggleActionDone(activeMeeting.id, item.id)}
                            className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer ${
                              item.done 
                                ? 'bg-[#111827] border-[#111827] text-white' 
                                : 'border-slate-350 hover:border-slate-800 bg-white'
                            }`}
                          >
                            {item.done && <Check className="w-3 h-3" />}
                          </button>
                          
                          {editingActionId === item.id ? (
                            <div className="space-y-1.5 w-full pr-2">
                              <input
                                type="text"
                                value={editActionText}
                                onChange={(e) => setEditActionText(e.target.value)}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-800"
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                                <input
                                  type="text"
                                  value={editAssignee}
                                  onChange={(e) => setEditAssignee(e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-800"
                                />
                                <input
                                  type="date"
                                  value={editDueDate}
                                  onChange={(e) => setEditDueDate(e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-800"
                                />
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p className={`text-xs ${item.done ? 'line-through text-slate-400' : 'font-semibold'}`}>
                                {item.text}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-550">
                                <span>Responsável: <strong className="text-slate-600">{item.assignee}</strong></span>
                                <span>•</span>
                                <span className="font-mono">Prazo: {item.dueDate.split('-').reverse().join('/')}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {editingActionId === item.id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveEditedAction(activeMeeting.id, item.id)}
                                className="p-[5px] rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                title="Salvar edição"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEditAction}
                                className="p-[5px] rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                                title="Cancelar edição"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEditAction(item)}
                                className="p-[5px] rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                                title="Editar encaminhamento"
                              >
                                <Pencil className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAction(activeMeeting.id, item.id)}
                                className="p-[5px] rounded border border-rose-200 text-rose-600 hover:bg-rose-50"
                                title="Excluir encaminhamento"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                              {item.done && (
                                <span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-[2px] border border-emerald-100 rounded font-semibold flex items-center gap-0.5">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Ok</span>
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Rapid add control on an already registered meeting */}
                <div className="bg-[#F9FAFB] p-3 rounded space-y-2.5 border border-slate-250">
                  <h5 className="text-[10px] uppercase tracking-wide font-extrabold text-slate-700">Atribuir Nova Deliberação Corretiva</h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end">
                    
                    <div className="md:col-span-6 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">O que fazer?</label>
                      <input
                        type="text"
                        value={newActionText}
                        onChange={(e) => setNewActionText(e.target.value)}
                        placeholder="Ex: Ofício de encaminhamento para psicologia especializada..."
                        className="w-full px-2.5 py-[5px] bg-white border border-slate-205 rounded text-xs text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="text-[9px] font-bold text-slate-500 uppercase">Responsável</label>
                      <input
                        type="text"
                        value={newAssignee}
                        onChange={(e) => setNewAssignee(e.target.value)}
                        placeholder="Ex: Profª Marina"
                        className="w-full px-2.5 py-[5px] bg-white border border-slate-205 rounded text-xs text-slate-850 focus:outline-hidden"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1 font-mono">
                      <label className="text-[9px] font-bold text-slate-500 uppercase font-sans">Prazo</label>
                      <input
                        type="date"
                        value={newDueDate}
                        onChange={(e) => setNewDueDate(e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-205 rounded text-xs text-slate-850 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNewActionToSelected}
                      className="md:col-span-1 p-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded transition-colors flex items-center justify-center font-bold cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="tech-card p-6 text-center space-y-2 bg-white">
              <p className="text-slate-500 text-xs">Nenhuma reunião de equipe selecionada.</p>
              <p className="text-[11px] text-slate-400">Clique em alguma ata do histórico na lateral esquerda para detalhá-la, ou registre uma nova!</p>
            </div>
          )
        )}

      </div>
    </div>
  );
}

