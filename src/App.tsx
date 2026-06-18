import React, { useState, useEffect } from 'react';
import { 
  INITIAL_TASKS, 
  INITIAL_EVENTS, 
  INITIAL_MEETINGS, 
  COMMUNICATION_TEMPLATES, 
  INITIAL_HISTORY 
} from './data';
import { PendingTask, CalendarEvent, Meeting, MeetingActionItem, HistoryItem, HistoryActionType } from './types';
import MesaCentral from './components/MesaCentral';
import ComunicacaoAssistida from './components/ComunicacaoAssistida';
import Reunioes from './components/Reunioes';
import Calendario from './components/Calendario';
import Historico from './components/Historico';
import coordenaLogoMark from './assets/coordena-logo-mark.png';

// Icons
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Calendar as CalendarIcon, 
  History as HistoryIcon,
  RefreshCw,
  Clock,
  Menu,
  Moon,
  Sun,
  X
} from 'lucide-react';

export default function App() {
  const getPreferredTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const readStoredState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved) return fallback;
      return JSON.parse(saved) as T;
    } catch {
      return fallback;
    }
  };

  const [activeTab, setActiveTab] = useState<'mesa' | 'comunicacao' | 'reunioes' | 'calendario' | 'historico'>('mesa');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => readStoredState('coordflow_theme', getPreferredTheme()));

  // Unified State with fallback persistence
  const [tasks, setTasks] = useState<PendingTask[]>(() => readStoredState('coordflow_tasks', INITIAL_TASKS));

  const [events, setEvents] = useState<CalendarEvent[]>(() => readStoredState('coordflow_events', INITIAL_EVENTS));

  const [meetings, setMeetings] = useState<Meeting[]>(() => readStoredState('coordflow_meetings', INITIAL_MEETINGS));

  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => readStoredState('coordflow_history', INITIAL_HISTORY));

  // Effect triggers on every state modification to synchronize storage
  useEffect(() => {
    localStorage.setItem('coordflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('coordflow_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('coordflow_meetings', JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem('coordflow_history', JSON.stringify(historyItems));
  }, [historyItems]);

  useEffect(() => {
    localStorage.setItem('coordflow_theme', JSON.stringify(themeMode));
    document.documentElement.dataset.theme = themeMode;
    document.documentElement.style.colorScheme = themeMode;
  }, [themeMode]);

  // Current DateTime tracker formatted elegantly under localized standards
  const [clockString, setClockString] = useState('2026-05-31 14:29');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const parts = now.toLocaleString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      // Capitalize first word of day
      setClockString(parts.charAt(0).toUpperCase() + parts.slice(1));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Global Callbacks for actions:
  const handleAddNewTask = (newTask: Omit<PendingTask, 'id' | 'createdAt'>) => {
    const task: PendingTask = {
      ...newTask,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [task, ...prev]);

    // Simple automatic audit logger
    handleAddNewHistoryItem(
      `Nova demanda cadastrada: ${task.title}`,
      `Atribuída a categoria [${task.category}] com prazo final agendado para ${task.deadline.split('-').reverse().join('/')}.`,
      'geral',
      task.category === 'familia' || task.category === 'professor' ? (task.category as any) : 'sistema'
    );
  };

  const handleToggleTaskStatus = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;

    const nextStatus = target.status === 'concluido' ? 'pendente' : 'concluido';

    setTasks(prev => prev.map(t => (
      t.id === id ? { ...t, status: nextStatus } : t
    )));

    handleAddNewHistoryItem(
      `Status de Demanda Alterado`,
      `Tarefa "${target.title}" foi marcada como [${nextStatus === 'concluido' ? 'CONCLUÍDO' : 'PENDENTE'}].`,
      nextStatus === 'concluido' ? 'tarefa_concluida' : 'geral',
      target.category === 'familia' || target.category === 'professor' ? (target.category as any) : 'sistema'
    );
  };

  const handleDeleteTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    
    if (target) {
      handleAddNewHistoryItem(
        `Demanda removida permanentemente`,
        `Excluído o registro de tarefa de título: "${target.title}".`,
        'geral',
        'sistema'
      );
    }
  };

  const handleUpdateTask = (id: string, updates: Omit<PendingTask, 'id' | 'createdAt'>) => {
    const target = tasks.find(t => t.id === id);
    if (!target) return;

    setTasks(prev => prev.map(t => (
      t.id === id ? { ...t, ...updates } : t
    )));

    handleAddNewHistoryItem(
      'Demanda Editada',
      `Tarefa atualizada: "${target.title}" -> "${updates.title}". Prazo: ${target.deadline.split('-').reverse().join('/')} -> ${updates.deadline.split('-').reverse().join('/')}.`,
      'geral',
      updates.category === 'familia' || updates.category === 'professor' ? (updates.category as any) : 'sistema'
    );
  };

  const handleAddNewMeeting = (newMeeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    const meeting: Meeting = {
      ...newMeeting,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMeetings(prev => [meeting, ...prev]);
  };

  const handleUpdateMeetingActions = (meetingId: string, actionItems: MeetingActionItem[]) => {
    setMeetings(prev => prev.map(m => {
      if (m.id === meetingId) {
        return { ...m, actionItems };
      }
      return m;
    }));
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(prev => prev.filter(m => m.id !== id));
  };

  const handleAddNewEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const ev: CalendarEvent = {
      ...newEvent,
      id: `ev-${Date.now()}`
    };
    setEvents(prev => [...prev, ev]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const handleAddNewHistoryItem = (
    title: string, 
    details: string, 
    actionType: HistoryActionType, 
    category: HistoryItem['category']
  ) => {
    const log: HistoryItem = {
      id: `h-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      details,
      actionType,
      category
    };
    setHistoryItems(prev => [log, ...prev]);
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
  };

  const handleRestoreDefaultHistory = () => {
    setHistoryItems(INITIAL_HISTORY);
  };

  // Completely reset simulation data
  const handleFullReset = () => {
    if (confirm('Deseja resetar TODOS os dados escolares para as configurações de MVP originais de demonstração? Isso limpará suas edições atuais.')) {
      setTasks(INITIAL_TASKS);
      setEvents(INITIAL_EVENTS);
      setMeetings(INITIAL_MEETINGS);
      setHistoryItems(INITIAL_HISTORY);
      ['coordflow_tasks', 'coordflow_events', 'coordflow_meetings', 'coordflow_history'].forEach((key) => {
        localStorage.removeItem(key);
      });
      setActiveTab('mesa');
    }
  };

  const pendingActiveCount = tasks.filter(t => t.status !== 'concluido').length;
  const isDarkMode = themeMode === 'dark';
  const handleToggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };
  const ThemeToggleIcon = isDarkMode ? Sun : Moon;

  return (
    <div className={`min-h-dvh md:min-h-screen md:flex md:flex-row font-sans app-shell ${isDarkMode ? 'theme-dark' : ''}`}>
      
      {/* MOBILE RATIO BAR */}
      <header className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <img
            src={coordenaLogoMark}
            alt="Logo do Coordena"
            className="w-10 h-10 object-contain rounded-lg bg-white p-0.5 shadow-xs"
          />
          <div>
            <span className="font-extrabold text-sm text-[#111827] tracking-tight">Coordena</span>
            <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 ml-2 border rounded font-mono font-bold uppercase">v1.0</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5E7EB] text-slate-600 hover:bg-slate-50 transition-colors bg-white"
            title={isDarkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
          >
            <ThemeToggleIcon className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* COMPANION SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E5E7EB] flex flex-col p-6 transform transition-transform duration-300 md:translate-x-0 md:static md:h-screen sticky md:top-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* LOGO AREA */}
        <div className="mb-8 select-none">
          <div className="flex items-center space-x-2.5">
            <img
              src={coordenaLogoMark}
              alt="Logo do Coordena"
              className="w-12 h-12 object-contain rounded-xl bg-white p-1 shadow-xs"
            />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-[#111827] leading-tight">Coordena</h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Gestão Pedagógica</p>
            </div>
          </div>
          <p className="text-[10px] text-[#6B7280] mt-3 font-semibold font-mono border-t border-slate-100 pt-1.5">
            <span>CETI - Ibicoara</span>
          </p>
        </div>

        {/* COMPREHENSIVE SIDE NAVIGATION */}
        <nav className="flex-1 space-y-1">
          {[
            { id: 'mesa', label: 'Mesa Central', icon: LayoutDashboard, badge: pendingActiveCount > 0 ? pendingActiveCount : null, badgeColor: 'bg-rose-100 text-rose-800' },
            { id: 'comunicacao', label: 'Comunicação Assistida', icon: MessageSquare, badge: 'IA', badgeColor: 'bg-amber-100 text-amber-800 font-mono text-[9px]' },
            { id: 'reunioes', label: 'Pautas & Reuniões', icon: FileText, badge: null, badgeColor: '' },
            { id: 'calendario', label: 'Calendário Operacional', icon: CalendarIcon, badge: events.length > 0 ? events.length : null, badgeColor: 'bg-indigo-100 text-indigo-800 font-mono text-[9px]' },
            { id: 'historico', label: 'Histórico Institucional', icon: HistoryIcon, badge: null, badgeColor: '' },
          ].map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}-button`}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#4F46E5] font-bold shadow-2xs'
                    : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F46E5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`px-2 py-0.2 rounded-md font-bold text-[9px] ${isActive ? 'bg-[#4F46E5]/15 text-[#4F46E5]' : item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM METRIC RAIL */}
        <div className="mt-auto pt-6 border-t border-[#E5E7EB] self-stretch">
          <p className="text-[10px] text-[#6B7280] uppercase tracking-widest font-bold mb-3">Status da Escola</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-[11px] font-medium text-slate-700">94% Frequência Média</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${pendingActiveCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-slate-300'}`}></span>
              <span className="text-[11px] font-medium text-slate-700">{pendingActiveCount} Demandas Ativas</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE DIM BACKDROP */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* MAIN CONTENT WINDOW wrapper */}
      <div className="min-w-0 md:flex-1 md:flex md:flex-col md:min-h-0">
        
        {/* DESKTOP EXCLUSIVE TOP-BAR */}
        <header className="bg-white border-b border-[#E5E7EB] h-[52px] hidden md:flex items-center justify-between px-6 py-2 z-10 sticky top-0">
          <div className="flex items-center gap-2 text-[10px] text-[#6B7280] font-semibold tracking-[0.12em] uppercase">
            <span className="text-[#111827] font-bold">
              {activeTab === 'mesa' && 'Mesa Central'}
              {activeTab === 'comunicacao' && 'Comunicação Assistida'}
              {activeTab === 'reunioes' && 'Reuniões & Pautas'}
              {activeTab === 'calendario' && 'Calendário Operacional'}
              {activeTab === 'historico' && 'Histórico Institucional'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleTheme}
              className="flex items-center space-x-1.5 px-2.5 py-1.25 border border-[#E5E7EB] hover:border-slate-400 rounded-md text-slate-600 hover:text-[#111827] text-[9px] font-semibold uppercase tracking-[0.11em] transition-all bg-white"
              title={isDarkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
            >
              <ThemeToggleIcon className="w-3.5 h-3.5" />
              <span>{isDarkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
            </button>
            
            {/* Clock */}
            <div className="flex items-center space-x-1.5 text-slate-600 text-[9px] font-mono bg-[#F9FAFB] border border-[#E5E7EB] px-2 py-1.25 rounded-md">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{clockString}</span>
            </div>

            {/* Reset */}
            <button
              onClick={handleFullReset}
              className="flex items-center space-x-1.5 px-2.5 py-1.25 border border-[#E5E7EB] hover:border-slate-400 rounded-md text-slate-600 hover:text-[#111827] text-[9px] font-semibold uppercase tracking-[0.11em] transition-all bg-white"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Resetar MVP</span>
            </button>

            {/* Custom user initial badge matching our template design */}
            <div className="w-7 h-7 rounded-full bg-[#111827] text-white flex items-center justify-center text-[11px] font-bold font-mono" title="arnaldodealmeida@gmail.com">
              CP
            </div>

          </div>
        </header>

        {/* CORE SCROLLABLE CONTAINER */}
        <main className="p-3.5 pb-4 md:flex-1 md:min-h-0 md:p-5 overflow-visible md:overflow-y-auto space-y-4">
          
          {activeTab === 'mesa' && (
            <MesaCentral
              tasks={tasks}
              onAddTask={handleAddNewTask}
              onUpdateTask={handleUpdateTask}
              onToggleTaskStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
              onAddHistory={handleAddNewHistoryItem}
            />
          )}

          {activeTab === 'comunicacao' && (
            <ComunicacaoAssistida
              templates={COMMUNICATION_TEMPLATES}
              onAddHistory={handleAddNewHistoryItem}
            />
          )}

          {activeTab === 'reunioes' && (
            <Reunioes
              meetings={meetings}
              onAddMeeting={handleAddNewMeeting}
              onUpdateMeetingActions={handleUpdateMeetingActions}
              onDeleteMeeting={handleDeleteMeeting}
              onAddHistory={handleAddNewHistoryItem}
            />
          )}

          {activeTab === 'calendario' && (
            <Calendario
              events={events}
              onAddEvent={handleAddNewEvent}
              onDeleteEvent={handleDeleteEvent}
              onAddHistory={handleAddNewHistoryItem}
            />
          )}

          {activeTab === 'historico' && (
            <Historico
              historyItems={historyItems}
              onClearHistory={handleClearHistory}
              onRestoreDefaultHistory={handleRestoreDefaultHistory}
            />
          )}

        </main>

        {/* FOOTER BAR */}
        <footer className="bg-white border-t border-[#E5E7EB] py-3.5 md:py-4.5 text-slate-500 text-xs px-4 md:px-8">
          <div className="text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-mono text-[11px] text-[#6B7280]">
              Coordena • Camada Inteligente e Leve de Apoio Operacional ao Coordenador Pedagógico.
            </p>
            <div className="flex items-center space-x-3.5 text-[#6B7280] text-[11px] font-semibold uppercase tracking-wider">
              <span>Alívio Operacional</span>
              <span>•</span>
              <span className="text-[#4F46E5]">CETI - Ibicoara</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}

