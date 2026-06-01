# Direção Futura: Fechamento de Agendamentos

Data: 31/05/2026

## Objetivo

Registrar uma melhoria futura no Calendário Operacional para permitir o fechamento de agendamentos com resultado, decisões e encaminhamentos, sem expandir o produto de forma desnecessária.

## Problema observado

Hoje o calendário cobre bem o agendamento e a visualização, mas não oferece uma instância dedicada para registrar o que aconteceu após cada evento.

Isso reduz rastreabilidade prática de:
- resultados obtidos;
- definições tomadas;
- próximos passos acordados.

## Direção proposta (futura)

Adicionar uma interação simples ao clicar em um agendamento:

1. abrir modal de **Registro de Fechamento**;
2. permitir preenchimento de:
   - resumo do resultado;
   - decisões;
   - encaminhamentos;
   - status final (`realizado`, `adiado`, `cancelado`);
3. salvar no estado local;
4. registrar automaticamente no Histórico Institucional.

## Escopo mínimo recomendado

- Reaproveitar estrutura atual (sem novo módulo separado).
- Sem backend real nesta etapa.
- Persistência em `localStorage` junto dos eventos já existentes.
- UI leve (modal único, sem fluxos complexos).

## Análise de possível necessidade: upload de arquivos

Pode haver necessidade prática de anexar arquivos no fechamento do agendamento, por exemplo:
- ata em PDF;
- ofício/relatório em DOCX;
- evidência de atividade (imagem).

### Quando o upload passa a ser necessário

- quando o registro textual não for suficiente para auditoria institucional;
- quando a coordenação precisar compartilhar comprovantes com direção/família/docentes;
- quando houver exigência de documentação formal por tipo de reunião/encaminhamento.

### Impactos esperados

- **Produto:** aumento de escopo (de texto para gestão de anexos).
- **Técnico:** `localStorage` não é adequado para arquivos (limite de tamanho e confiabilidade).
- **Operacional:** demanda política de retenção e privacidade dos anexos.

### Direção recomendada (futura, se validada)

1. manter upload fora da etapa atual de teste assistido;
2. validar necessidade real em campo (quantidade e tipo de anexos);
3. se confirmado, planejar armazenamento dedicado (não `localStorage`);
4. adicionar metadados no histórico (nome do arquivo, tipo, data, vínculo com evento).

## Critérios de pronto (quando implementar)

- clicar em um evento abre modal de fechamento;
- dados de fechamento ficam vinculados ao evento;
- atualização de status visível no calendário;
- registro correspondente aparece no Histórico;
- `npm run lint` e `npm run build` passando.
