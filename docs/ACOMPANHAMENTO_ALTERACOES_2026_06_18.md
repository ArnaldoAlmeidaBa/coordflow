# Acompanhamento de Alteracoes

Data: 2026-06-18
Projeto: Coordena

## Resumo

Este documento registra as alteracoes recentes aplicadas no projeto para facilitar o acompanhamento funcional e visual.

## Alteracoes realizadas

### 1. Compactacao visual da Mesa Central

Objetivo:
Reduzir o espaco vertical ocupado pelo topo da tela e pelos cards de indicadores.

Principais ajustes:
- reducao da altura do cabecalho desktop;
- reducao de paddings e gaps do conteudo principal;
- reducao de altura, icones e tipografia dos cards-resumo;
- reducao das fontes em caixa alta nos titulos, badges e filtros;
- compactacao do cabecalho da secao "Mesa Operacional de Pendencias".

Arquivos principais:
- `src/App.tsx`
- `src/components/MesaCentral.tsx`

Commit publicado:
- `07cf33c` - `style(mesa): compactar cabecalho e indicadores`

### 2. Atualizacao de branding e identificacao institucional

Objetivo:
Atualizar o nome do produto e os textos da instituicao exibidos na interface.

Alteracoes aplicadas:
- `CoordFlow` -> `Coordena`
- `Escola Novo Horizonte` -> `CETI - Ibicoara`
- remocao de `Unidade Centro`

Pontos atualizados:
- cabecalho mobile;
- sidebar;
- topo desktop;
- rodape;
- templates textuais em `src/data.ts`.

Arquivos principais:
- `src/App.tsx`
- `src/data.ts`

Commit publicado:
- `fadb002` - `chore(branding): renomear app e escola`

## Estado atual do Git

Branch atual:
- `master`

Situacao com o remoto:
- `master` esta alinhada com `origin/master`

Observacao:
- existe uma modificacao local restante em `src/index.css`
- essa alteracao nao fez parte dos commits acima e permanece pendente de revisao/limpeza

## Ultimos commits relevantes

1. `fadb002` - `chore(branding): renomear app e escola`
2. `07cf33c` - `style(mesa): compactar cabecalho e indicadores`
3. `3e638ad` - `feat(mesa): permitir edicao de pendencias registradas`

## Proximo passo sugerido

Revisar e limpar o estado de `src/index.css` para deixar o repositorio totalmente limpo.
