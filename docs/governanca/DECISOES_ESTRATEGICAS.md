# DECISOES_ESTRATEGICAS

## Registro de decisoes

Este arquivo concentra escolhas estruturantes do projeto, para que a direcao do Coordena nao fique dependente de memoria informal.

Uso recomendado:

- registrar mudancas que alterem identidade, comportamento ou direcao do projeto;
- evitar registrar detalhes pequenos que nao mudem a orientacao geral;
- usar este documento como instrumento de coerencia, nao como camada burocratica.

---

## 2026-06-18 - O Coordena passa a ser tratado como habitat de coordenacao humana

### Decisao

O projeto deixa de ser orientado apenas como aplicativo operacional e passa a ser compreendido como ambiente digital de coordenacao humana.

### Implicacoes

- novas funcionalidades devem ser avaliadas por impacto humano, nao apenas por viabilidade tecnica;
- a interface deve continuar reduzindo burocracia;
- a memoria do projeto passa a ser tratada como parte do produto;
- crescimento funcional deve respeitar maturidade dos modulos existentes.

---

## 2026-06-18 - Instituicao da camada de governanca em documentacao

### Decisao

Foi criada a estrutura `docs/governanca/` para separar pensamento estrategico de implementacao tecnica.

### Implicacoes

- principios do projeto ficam explicitados;
- decisoes estruturais passam a ser registradas;
- ideias futuras ganham espaco proprio sem virarem backlog automatico;
- futuras conversas podem ser traduzidas em memoria de governanca.

---

## 2026-06-18 - Protocolo obrigatorio para novas funcionalidades

### Decisao

Toda funcionalidade relevante deve passar pelo protocolo de cinco perguntas definido em `PRINCIPIOS_DO_COORDENA.md`.

### Implicacoes

- reduz risco de expansao por impulso;
- favorece coerencia entre produto e proposito;
- cria criterio para dizer "nao agora" quando necessario.

---

## 2026-06-18 - Governanca como artefato vivo

### Decisao

Os documentos de governanca passam a ser tratados como artefatos vivos, sujeitos a amadurecimento continuo conforme o projeto evolui.

### Implicacoes

- a governanca deve acompanhar o desenvolvimento sem engessa-lo;
- documentacao deve servir ao projeto, e nao competir com ele;
- registros devem priorizar aquilo que altera identidade, comportamento ou direcao.

---

## 2026-06-18 - Prioridade atual: aprofundar antes de expandir

### Decisao

A fase atual do projeto prioriza maturidade sobre proliferacao de modulos.

### Focos imediatos

- Demandas;
- Reunioes;
- Mesa Central;
- Navegacao;
- Experiencia mobile.

### Implicacoes

- novas ideias podem ser registradas;
- implementacoes futuras devem respeitar a capacidade operacional atual do sistema.

---

## 2026-06-18 - Paleta visual experimental em eixo ocre/madeira

### Decisao

Foi criada uma variacao experimental, sutil e reversivel da paleta visual do Coordena, deslocando a base cromatica de tons frios para um eixo mais quente, ligado a ocre, amarelo claro e referencias de madeira.

### Motivacao

- testar uma atmosfera mais acolhedora e organica;
- aproximar a experiencia visual do conceito de habitat de coordenacao humana;
- experimentar mudanca identitaria sem romper a legibilidade e a estabilidade atual.

### Implicacoes

- a mudanca foi isolada em commit proprio para avaliacao;
- a experiencia pode ser revertida com baixo risco caso nao agrade;
- a avaliacao deve considerar sensacao de acolhimento, contraste e clareza operacional.

---

## 2026-07-13 - Persistencia desacoplada por contrato no modulo de Demandas

### Decisao

O projeto passa a manter um unico codigo-fonte para versoes local e remota, com separacao inicial entre dominio, aplicacao e infraestrutura no modulo de Demandas.

Foi adotado contrato explicito de repositorio para evitar dependencia direta da interface com `localStorage` ou com qualquer banco especifico.

### Implicacoes

- a tela de Demandas nao depende mais diretamente da tecnologia de armazenamento;
- `localStorage` passa a ser apenas uma implementacao de infraestrutura;
- `localStorage` deve ser tratado apenas como etapa provisoria, e nao como decisao definitiva de persistencia local;
- o projeto fica apto a receber SQLite, API remota ou outro provedor sem duplicar componentes;
- a migracao arquitetural deve continuar em pequenos modulos, sem reescrever o produto inteiro;
- a documentacao de apoio desta decisao passa a ser `docs/ARQUITETURA_PERSISTENCIA_UNICA.md`.
