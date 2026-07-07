import { PendingTask, CalendarEvent, Meeting, CommunicationTemplate, HistoryItem } from './types';

export const INITIAL_TASKS: PendingTask[] = [
  {
    id: 't-1',
    title: 'Ligar para os responsáveis do Arthur Lima (8º A) sobre infrequência recorrente',
    priority: 'alta',
    status: 'pendente',
    deadline: '2026-06-02',
    category: 'familia',
    notes: 'Já acumulou 6 faltas consecutivas sem justificativa médica.',
    createdAt: '2026-05-30'
  }
];

export const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Pré-Conselho de Classe (Ensino Fundamental II)',
    description: 'Reunião de nivelamento com os professores regentes para alinhar os casos graves antes do conselho oficial.',
    type: 'conselho',
    date: '2026-06-03',
    time: '14:30',
    location: 'Sala de Reuniões Pedagógicas',
    status: 'agendado'
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'm-1',
    title: 'Conselho Extraordinário sobre Planos de Apoio Individual (AEE)',
    date: '2026-05-28',
    time: '16:00',
    type: 'professores',
    pauta: 'Alinhamento metodológico e adaptações de testes avaliativos para alunos laudados do Fundamental II.\n1. Diagnóstico do 1º Bimestre.\n2. Recursos de acessibilidade específicos.\n3. Papel do mediador em sala de aula.',
    decisions: 'Definiu-se que as avaliações de Inglês e História serão adaptadas com menor volume textual e suporte visual de fotos. Professores enviarão rascunho com 5 dias de antecedência para a coordenação.\nFoi decidida a manutenção de registro diário de cooperação pedagógica para os alunos focados.',
    actionItems: [
      {
        id: 'mai-1',
        text: 'Enviar diretriz de design universal de aprendizagem (DUA) adaptada ao e-mail dos docentes',
        assignee: 'Coord. pedagógica',
        dueDate: '2026-06-02',
        done: false
      }
    ],
    status: 'finalizada',
    createdAt: '2026-05-28'
  }
];

export const COMMUNICATION_TEMPLATES: CommunicationTemplate[] = [
  {
    id: 'ct-1',
    title: 'Convocação para Reunião Individual pedagógica',
    description: 'Para solicitar a presença e parceria dos pais ou responsáveis visando alinhar suporte de aprendizagem ou comportamento do aluno.',
    category: 'pais',
    placeholders: [
      { key: 'NOME_RESPONT', label: 'Nome do Responsável', placeholder: 'Sra. Márcia Lima' },
      { key: 'NOME_ALUNO', label: 'Nome do Aluno', placeholder: 'Gabriel Lima' },
      { key: 'TURMA', label: 'Turma/Série', placeholder: '8º Ano A' },
      { key: 'MOTIVO', label: 'Motivo do Encontro', placeholder: 'diferença acentuada nas entregas de deveres de casa e dispersão' },
      { key: 'DATA_REU', label: 'Data', placeholder: '04/06/2026' },
      { key: 'HORA_REU', label: 'Horário', placeholder: '15:30' }
    ],
    contentTemplate: `Prezado(a) [NOME_RESPONT],

Gostaria de solicitar a sua presença em uma reunião individual na coordenação pedagógica, para conversarmos de forma conjunta e construtiva sobre o desenvolvimento escolar do(a) [NOME_ALUNO], estudante do [TURMA].

Nesta conversa, nosso foco principal será: [MOTIVO].

Agendamos este momento para o dia [DATA_REU] às [HORA_REU] horas.

A sua parceria e acompanhamento diário em casa são vitais para o avanço pedagógico e o bem-estar do(a) estudante. Por gentileza, confirme o recebimento e disponibilidade respondendo a este canal oficial.

Atenciosamente,
Coordenação Pedagógica - CETI - Ibicoara`
  },
  {
    id: 'ct-2',
    title: 'Feedback / Solicitação de Adaptação de Plano de Aula',
    description: 'Mensagem carinhosa e orientadora para solicitar ao professor refinamentos de objetivos ou adequações no seu planejamento bimestral.',
    category: 'professor',
    placeholders: [
      { key: 'PROFESSOR', label: 'Nome do Professor', placeholder: 'Prof. Roberto' },
      { key: 'DISCIPLINA', label: 'Disciplina', placeholder: 'História' },
      { key: 'SERIE', label: 'Série/Ano', placeholder: '9º Ano B' },
      { key: 'OBSERVACOES', label: 'Pontos de Ajuste', placeholder: '- Inserir a data final da culminância do projeto;\n- Detalhar o método avaliativo formativo no rascunho de aula;' },
      { key: 'PRAZO', label: 'Data Limite para Ajuste', placeholder: '04 de junho' }
    ],
    contentTemplate: `Olá, Prof. [PROFESSOR], tudo bem?

Analisei com muito carinho seu plano de aula para a disciplina de [DISCIPLINA] voltado às turmas de [SERIE]. Gostei muito da sequência didática delineada e da forma como abordou os marcos históricos.

Para que seu documento fique em perfeita conformidade operacional e pedagógica, peço a gentileza de aplicar estes pequenos ajustes:

[OBSERVACOES]

Você poderia fazer esse refinamento direto na plataforma e sincronizar novamente até o dia [PRAZO]? 

Sigo à inteira disposição na coordenação caso queira debater alternativas ou necessite de recursos específicos! Obrigado(a) por sua contínua dedicação em elevar o patamar de nossas aulas.

Um forte abraço,
Coordenação Pedagógica`
  },
  {
    id: 'ct-3',
    title: 'Convocação Geral de Conselhos de Classe',
    description: 'Comunicado interno direcionado à equipe docente convocando para as reuniões regimentais e detalhando as entregas exigidas.',
    category: 'interno',
    placeholders: [
      { key: 'BIMESTRE', label: 'Bimestre', placeholder: '1º Bimestre' },
      { key: 'DIAS', label: 'Dias das Reuniões', placeholder: '03 e 04 de Junho' },
      { key: 'HORARIOS', label: 'Horários / Janelas', placeholder: 'das 14:00 às 17:30' },
      { key: 'DOCUMENTACAO', label: 'Documentação Necessária', placeholder: 'planilha consolidada de médias, fichas extras de conduta e relatório de recuperação' }
    ],
    contentTemplate: `Prezada equipe escolar e corpo docente,

Convocamos todos os professores para participarem de nossos Conselhos de Classe regimentais relativos ao [BIMESTRE].

Nosso cronograma detalhado de reuniões ocorrerá nos dias [DIAS], na janela [HORARIOS], na Sala de Reuniões Pedagógicas.

Lembramos que, para garantirmos a produtividade corporativa e a precisão do mapeamento acadêmico, cada professor deve portar as seguintes documentações preenchidas:

[DOCUMENTACAO]

Pedimos pontualidade absoluta. A presença de todos é um requisito legal indispensável e também o pilar central para que possamos conceber planos de amparo urgentes para os alunos.

Gratidão pela costumeira colaboração e empenho.

Atenciosamente,
Coordenação Pedagógica - CETI - Ibicoara`
  },
  {
    id: 'ct-4',
    title: 'Informativo à Família: Calendário de Atividades Pedagógicas',
    description: 'Aviso institucional simplificado para atualizar as famílias sobre projetos especiais e fechamento de ciclo avaliativo, gerando previsibilidade.',
    category: 'institucional',
    placeholders: [
      { key: 'TITULO_PROJ', label: 'Título do Projeto', placeholder: 'Semana do Clima e Meio Ambiente' },
      { key: 'DATAS_PROJ', label: 'Período', placeholder: 'de 15/06 a 19/06' },
      { key: 'ATIVIDADE_PRINC', label: 'Atividade Principal', placeholder: 'exposição de maquetes biodegradáveis e feira de sementes' },
      { key: 'CONSELHO_PAIS', label: 'Mensagem de Participação', placeholder: 'Encorajamos que os responsáveis acompanhem a confecção dos materiais.' }
    ],
    contentTemplate: `Prezadas famílias e responsáveis,

Compartilhamos com entusiasmo nosso calendário de atividades escolares. Estamos nos preparando para dar início ao projeto: "[TITULO_PROJ]".

As atividades escolares diferenciadas estão agendadas para o período de [DATAS_PROJ]. Durante esse ciclo, nossos estudantes desenvolverão: [ATIVIDADE_PRINC].

[CONSELHO_PAIS]

Acreditamos que a educação transborda os limites da sala de aula comum e se solidifica com a experimentação e a ação concreta do estudante no mundo. Contamos com o entusiasmo de vocês em casa para impulsionarem os estudos e pesquisas!

Qualquer dúvida, nossa equipe de suporte e coordenação segue de portas abertas.

Atenciosamente e com carinho,
Coordenação Pedagógica`
  }
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'h-1',
    timestamp: '2026-05-31T10:15:00Z',
    actionType: 'comunicado_gerado',
    title: 'Convocação pedagógica gerada',
    details: 'Gerado e copiado comunicado para Sra. Márcia Lima referente ao aluno Gabriel Lima (8º A).',
    category: 'pais'
  }
];
