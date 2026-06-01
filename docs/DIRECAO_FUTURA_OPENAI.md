# Direção Futura: Comunicação Assistida com API OpenAI

Data: 31/05/2026

## Objetivo

Registrar a direção futura de migração da camada de refinamento textual da Comunicação Assistida para a API da OpenAI, sem alterar o escopo da etapa atual de teste.

## Situação Atual

- Frontend chama `POST /api/refine`.
- Backend (`server.ts`) usa Gemini quando há chave válida.
- Sem chave, o sistema usa fallback local para manter continuidade operacional.

## Direção Proposta (futura)

Manter o mesmo desenho funcional e trocar apenas o provedor de IA no backend:

1. preservar a rota `POST /api/refine`;
2. substituir integração Gemini por cliente OpenAI;
3. trocar `GEMINI_API_KEY` por `OPENAI_API_KEY`;
4. manter os 4 tons já existentes (`acolhedor`, `direto`, `formal`, `formativo`);
5. manter fallback local para operação mesmo sem chave;
6. não alterar UX principal da coordenadora nesta migração.

## Princípios para a migração

- Sem expansão de produto.
- Sem novos módulos nesta fase.
- Sem alterar o conceito de protótipo para observação assistida.
- Foco em trocar provedor com impacto mínimo no frontend e nos fluxos já validados.

## Critério de pronto (quando executar a migração)

- `npm run lint` passando;
- `npm run build` passando;
- `npm run dev` funcionando;
- refino de texto funcionando pela rota existente;
- fallback local preservado.
