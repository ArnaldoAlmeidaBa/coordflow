import React, { useState, useEffect } from 'react';
import { CommunicationTemplate } from '../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  Send, 
  History, 
  MessageSquare, 
  FileText,
  UserCheck,
  FileCheck,
  Smile,
  Megaphone,
  Volume2
} from 'lucide-react';

interface ComunicacaoAssistidaProps {
  templates: CommunicationTemplate[];
  onAddHistory: (title: string, details: string, actionType: any, category: any) => void;
}

export default function ComunicacaoAssistida({ templates, onAddHistory }: ComunicacaoAssistidaProps) {
  const AI_REFINEMENT_ENABLED = false;
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate>(templates[0]);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [compiledText, setCompiledText] = useState('');
  const [isAiPolished, setIsAiPolished] = useState(false);
  const [originalCompiledText, setOriginalCompiledText] = useState('');
  const [selectedTone, setSelectedTone] = useState<'acolhedor' | 'direto' | 'formal' | 'formativo'>('acolhedor');
  
  // AI loader states
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiLoadingMessage, setAiLoadingMessage] = useState('Analisando rascunho pedagógico...');
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Load selected template defaults to placeholders value
  useEffect(() => {
    const initialValues: Record<string, string> = {};
    selectedTemplate.placeholders.forEach(ph => {
      initialValues[ph.key] = ph.placeholder;
    });
    setFieldValues(initialValues);
    setIsAiPolished(false);
    setRegistered(false);
  }, [selectedTemplate]);

  // Compute compiled text whenever fieldValues or selectedTemplate changes
  useEffect(() => {
    if (isAiPolished) return; // Keep AI polished text if user is looking at it

    let text = selectedTemplate.contentTemplate;
    selectedTemplate.placeholders.forEach(ph => {
      const val = fieldValues[ph.key] !== undefined ? fieldValues[ph.key] : ph.placeholder;
      // Replace [KEY] with val
      text = text.replace(`[${ph.key}]`, val || `__${ph.label}__`);
    });
    setCompiledText(text);
    setOriginalCompiledText(text);
  }, [fieldValues, selectedTemplate, isAiPolished]);

  const handleFieldChange = (key: string, val: string) => {
    setFieldValues(prev => ({ ...prev, [key]: val }));
    setIsAiPolished(false); // Reset AI state since template modified manually
    setRegistered(false);
  };

  // List of pedagogical reassuring messages of the AI polisher
  const loadingMessages = [
    'Revisando ortografia e concordância institucional...',
    'Formatando parágrafos de aproximação escolar...',
    'Aglutinando dados operacionais chave...',
    'Refinando o tom para máxima empatia pedagógica...',
    'Preparando formatação acolhedor-educativa final...'
  ];

  // Call backend server secure Gemini API proxy
  const handleAiRefine = async () => {
    setIsAiLoading(true);
    let msgIdx = 0;
    setAiLoadingMessage(loadingMessages[0]);
    
    // Cycle messages for rich loader experience
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length;
      setAiLoadingMessage(loadingMessages[msgIdx]);
    }, 1800);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: compiledText,
          tone: selectedTone
        })
      });

      const data = await response.json();
      clearInterval(interval);

      if (data.text) {
        setCompiledText(data.text);
        setIsAiPolished(true);
        setRegistered(false);
      } else {
        alert(data.error || 'Não foi possível refinar o texto.');
      }
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      alert('Erro na conexão com o servidor. Verifique o console.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Register simple audit log automatically
    onAddHistory(
      `Comunicado de Apoio: ${selectedTemplate.title}`,
      `Conteúdo enviado/copiado para canais externos. Categoria: ${selectedTemplate.category}`,
      'comunicado_gerado',
      selectedTemplate.category === 'pais' ? 'pais' : 'professor'
    );
  };

  const handleRegisterReceipt = () => {
    onAddHistory(
      `Comunicado Arquivado: ${selectedTemplate.title}`,
      `O documento foi finalizado e salvo oficialmente no histórico escolar para controle operacional de ações.`,
      'comunicado_gerado',
      selectedTemplate.category === 'pais' ? 'pais' : 'professor'
    );
    setRegistered(true);
  };

  const handleReset = () => {
    setCompiledText(originalCompiledText);
    setIsAiPolished(false);
  };

  // Icon switcher for visual category feedback
  const getTemplateCategoryIcon = (cat: string) => {
    switch(cat) {
      case 'pais': return <Smile className="w-5 h-5 text-amber-600" />;
      case 'professor': return <UserCheck className="w-5 h-5 text-emerald-600" />;
      case 'interno': return <FileCheck className="w-5 h-5 text-purple-600" />;
      default: return <Megaphone className="w-5 h-5 text-sky-600" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      
      {/* LEFT COLUMN: Template selection & Custom Placeholder form */}
      <div className="lg:col-span-5 space-y-3">
        
        {/* Templates library select box */}
        <div className="tech-card">
          <div className="tech-card-header bg-white">
            <div className="flex items-center space-x-2">
              <span className="tech-card-title">Biblioteca de Comunicados</span>
            </div>
            <span className="tech-badge">{templates.length} Modelos</span>
          </div>
          
          <div className="p-2.5 bg-slate-50 border-b border-slate-150 text-[11px] text-slate-500 leading-normal">
            Modelos de redação para famílias, professores e atas internas que poupam tempo gerencial.
          </div>

          <div className="p-2.5 space-y-1.5 max-h-[170px] overflow-y-auto bg-white">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                id={`tpl-btn-${tpl.id}`}
                onClick={() => {
                  setSelectedTemplate(tpl);
                }}
                className={`w-full text-left p-2.5 rounded border text-xs transition-colors flex items-start gap-2.5 ${
                  selectedTemplate.id === tpl.id
                    ? 'border-[#4F46E5] bg-indigo-50/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="mt-0.5">{getTemplateCategoryIcon(tpl.category)}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 leading-tight truncate">{tpl.title}</p>
                  <p className="text-slate-500 mt-1 line-clamp-1 leading-snug">{tpl.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Placeholder Form Fieldsets */}
        <div className="tech-card">
          <div className="tech-card-header bg-white">
            <span className="tech-card-title">Preenchimento de Informações</span>
          </div>
          
          <div className="p-3 space-y-2.5 bg-white">
            <div id="placeholders-inputs" className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {selectedTemplate.placeholders.map((ph) => (
                <div key={ph.key} className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">{ph.label}</label>
                  {ph.key === 'OBSERVACOES' || ph.key === 'MOTIVO' ? (
                    <textarea
                      rows={2}
                      value={fieldValues[ph.key] !== undefined ? fieldValues[ph.key] : ''}
                      onChange={(e) => handleFieldChange(ph.key, e.target.value)}
                      placeholder={ph.placeholder}
                      className="w-full px-3 py-[5px] bg-white border border-slate-250 rounded text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-[#111827] leading-relaxed font-sans"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fieldValues[ph.key] !== undefined ? fieldValues[ph.key] : ''}
                      onChange={(e) => handleFieldChange(ph.key, e.target.value)}
                      placeholder={ph.placeholder}
                      className="w-full px-3 py-[5px] bg-white border border-slate-250 rounded text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-[#111827] font-sans"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Live compiled template preview + Gemini tone purifier */}
      <div className="lg:col-span-7 flex flex-col space-y-3">
        
        {/* Live letterhead sheet paper simulation */}
        <div className="tech-card flex-1 flex flex-col">
          
          {/* Paper meta header */}
          <div className="tech-card-header bg-white">
            <div className="flex items-center space-x-2">
              <span className="tech-card-title">Visualização do Comunicado</span>
            </div>
            
            {isAiPolished && (
              <span className="tech-badge bg-emerald-50 text-emerald-800 border-emerald-100 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3" />
                <span>Modulação Gemini Ativa</span>
              </span>
            )}
          </div>

          {/* Styled Document container */}
          <div className="p-4 bg-slate-50/30 flex-1 flex flex-col justify-between">
            
            {isAiLoading ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-10 bg-white rounded border border-dashed border-slate-250 my-auto">
                <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800 animate-pulse">{aiLoadingMessage}</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Modulação de Linguagem Inteligente Ativa</p>
                </div>
              </div>
            ) : (
              <div
                id="compiled-preview"
                className="bg-white p-4 rounded shadow-2xs border border-slate-200 font-sans whitespace-pre-line text-xs sm:text-sm text-slate-850 leading-relaxed min-h-[210px] relative transition-all"
              >
                {compiledText}
              </div>
            )}

            {/* Actions panel */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-150">
              
              <div className="flex items-center space-x-2">
                {isAiPolished && (
                  <button
                    onClick={handleReset}
                    className="flex items-center space-x-1 text-[11px] text-slate-500 hover:text-slate-850 py-1 px-2.5 border border-slate-200 rounded-full hover:bg-slate-50 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restaura Rascunho</span>
                  </button>
                )}
              </div>

              {/* Copy and Archive controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRegisterReceipt}
                  disabled={registered}
                  className={`flex items-center space-x-1 text-[11px] py-1 px-3.5 rounded-full border transition-colors cursor-pointer ${
                    registered 
                      ? 'bg-slate-150 border-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'border-slate-250 hover:bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <History className="w-3 h-3" />
                  <span>{registered ? 'Arquivado no Histórico' : 'Registrar no Histórico'}</span>
                </button>

                <button
                  id="action-copy-doc"
                  onClick={handleCopy}
                  className="tech-btn-primary flex items-center space-x-1 px-3.5 py-1 text-[11px] bg-[#111827] hover:bg-slate-800"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>

        {AI_REFINEMENT_ENABLED ? (
          <div className="bg-[#111827] text-white p-4 rounded-lg border border-slate-900 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="space-y-1 flex-1 max-w-xl">
              <h4 className="font-extrabold text-white text-sm flex items-center gap-2 tracking-tight">
                <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                <span>Apropriador de Tom Pedagógico (Gemini AI)</span>
              </h4>
              <p className="text-[11px] text-slate-350 leading-relaxed font-sans">
                Utilize o modelo generativo para enriquecer e lapidar a abordagem pedagógica com empatia institucional, adaptando-o ao público-alvo escolhido.
              </p>

              <div className="flex flex-wrap gap-1.5 pt-3">
                {[
                  { key: 'acolhedor', label: '🌸 Acolhedor' },
                  { key: 'direto', label: '⚡ Objetivo' },
                  { key: 'formal', label: '💼 Atas/Formal' },
                  { key: 'formativo', label: '🎓 Docente/Pedagógico' }
                ].map(tone => (
                  <button
                    key={tone.key}
                    type="button"
                    onClick={() => setSelectedTone(tone.key as any)}
                    className={`px-2.5 py-1 text-[9px] uppercase tracking-wider rounded font-bold font-mono transition-colors cursor-pointer ${
                      selectedTone === tone.key 
                        ? 'bg-amber-400 text-[#111827]' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="action-refine-ai"
              onClick={handleAiRefine}
              disabled={isAiLoading}
              className="w-full md:w-auto flex-shrink-0 flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer self-center md:self-auto"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Refinar Tom</span>
            </button>
          </div>
        ) : (
          <div className="bg-slate-100 text-slate-700 p-2.5 rounded-lg border border-slate-200 text-xs">
            Refinamento por IA desativado nesta fase de Teste Coordenadora 0.1. Os modelos seguem disponíveis para uso manual/local.
          </div>
        )}

      </div>

    </div>
  );
}
