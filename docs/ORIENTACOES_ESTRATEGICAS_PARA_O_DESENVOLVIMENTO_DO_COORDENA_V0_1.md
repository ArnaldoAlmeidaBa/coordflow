# ORIENTACOES_ESTRATEGICAS_PARA_O_DESENVOLVIMENTO_DO_COORDENA_V0_1

Data: 2026-06-18

## Contexto

O projeto Coordena alcancou um estagio importante de maturidade. Alguns elementos fundamentais ja foram consolidados, como a identidade visual, a linguagem da interface, a estabilidade do deploy e a experiencia de uso em dispositivos moveis.

A partir deste momento, o desenvolvimento deve deixar de ser guiado prioritariamente pela pergunta tecnica "como implementar?" e passar a ser orientado por uma pergunta mais ampla:

> Como esta funcionalidade melhora a coordenacao humana?

Esta mudanca de perspectiva transforma o Coordena de um aplicativo em um habitat digital de coordenacao.

---

## Principio Central

O Coordena nao deve ser compreendido como um gerenciador de tarefas.

O Coordena e um ambiente digital que ajuda pessoas a se organizarem, colaborarem e conduzirem acoes coletivas sem transformar a organizacao em burocracia.

Toda nova decisao de desenvolvimento deve preservar este principio.

---

## Orientacao 1 - Instituir uma camada permanente de governanca

Criar uma estrutura dedicada para separar decisoes estrategicas do codigo.

Sugestao:

`docs/governanca/`

Arquivos iniciais:

- `PRINCIPIOS_DO_COORDENA.md`
- `DECISOES_ESTRATEGICAS.md`
- `HIPOTESES_FUTURAS.md`

Objetivo:

Registrar o pensamento do projeto para que ele nao fique disperso em conversas, commits ou memoria operacional.

---

## Orientacao 2 - Adotar um protocolo para novas funcionalidades

Antes de implementar qualquer funcionalidade, responder as seguintes perguntas:

1. Qual problema humano isso resolve?
2. Quem sera beneficiado?
3. Isso simplifica ou adiciona complexidade?
4. Isso funciona bem no celular?
5. Isso melhora a coordenacao entre pessoas?

Caso a resposta a quinta pergunta seja negativa, a funcionalidade deve ser reavaliada.

Regra operacional permanente:

- toda funcionalidade nova deve responder a pelo menos um dos principios do Coordena;
- quando necessario, deve gerar registro em `docs/governanca/DECISOES_ESTRATEGICAS.md`.

---

## Orientacao 3 - Observar o Coordena como um corpo vivo

O projeto ja apresenta caracteristicas de um organismo digital.

O corpo Coordena possui:

- identidade;
- linguagem;
- memoria;
- relacoes;
- demandas;
- encontros;
- historico de decisoes;
- territorios futuros.

Essa leitura aproxima o Coordena das cartografias que estao sendo desenvolvidas em outros projetos.

---

## Orientacao 4 - Priorizar profundidade antes da expansao

Evitar criar novos modulos por entusiasmo momentaneo.

Antes de expandir o sistema, aprofundar os elementos ja existentes:

- Demandas;
- Reunioes;
- Mesa Central;
- Navegacao;
- Experiencia mobile.

A estabilidade operacional deve preceder o crescimento funcional.

---

## Orientacao 5 - Criar um Escaninho do Coordena

Manter uma fila de ideias em observacao, sem compromisso imediato de implementacao.

Possibilidades futuras:

- historico das demandas;
- responsaveis e colaboradores;
- niveis de prioridade;
- notificacoes suaves;
- visao semanal;
- grupos ou territorios de trabalho;
- indicadores simples de participacao.

A existencia de uma ideia nao implica sua implementacao imediata.

---

## Orientacao 6 - Consolidar um Diario de Bordo

Os documentos de acompanhamento nao devem registrar apenas alteracoes tecnicas.

Eles devem constituir a memoria evolutiva do projeto.

Objetivos:

- registrar decisoes;
- documentar aprendizados;
- acompanhar mudancas de entendimento;
- preservar o raciocinio que conduziu cada evolucao.

Com o tempo, sera possivel observar nao apenas o que foi construido, mas como o pensamento do projeto amadureceu.

Importante:

- a governanca nao deve se transformar em burocracia;
- o objetivo nao e documentar tudo;
- o objetivo e documentar aquilo que altera a identidade, o comportamento ou a direcao do projeto.

---

## Bussola Permanente

O Coordena deve ser tratado menos como um aplicativo e mais como um habitat de coordenacao humana.

Pergunta orientadora:

> Como criar ambientes digitais que ajudem pessoas a se organizarem sem transformar a organizacao em burocracia?

Essa pergunta deve acompanhar todas as futuras evolucoes do projeto.
