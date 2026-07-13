# ARQUITETURA_PERSISTENCIA_UNICA

Data: 2026-07-13

## Objetivo

Preparar o Coordena para sustentar uma versao local e uma versao remota sem duplicar o projeto.

Principio adotado:

> Uma aplicacao, multiplas formas de persistencia.

---

## Inventario atual das entidades em uso

O projeto possui hoje as seguintes estruturas principais de dados:

- Demandas (`PendingTask` / `Demand`)
- Eventos de calendario
- Reunioes
- Itens de acao de reuniao
- Modelos de comunicacao
- Itens de historico

Nesta rodada, apenas o modulo de Demandas foi preparado para abstracao de persistencia.

---

## Diagnostico da situacao anterior

Antes desta rodada, a tela de Demandas dependia diretamente de:

- estado local em `App.tsx`;
- leitura e escrita direta em `localStorage`;
- dados iniciais definidos em `src/data.ts`.

Pontos de acoplamento identificados:

- carregamento de demandas em `src/App.tsx`;
- sincronizacao de demandas em `localStorage` dentro de `src/App.tsx`;
- operacoes de criar, atualizar, concluir e excluir demandas definidas no mesmo componente de interface.

Isso dificultava a troca futura entre:

- persistencia local simples;
- SQLite em app desktop;
- backend remoto;
- repositores mockados para desenvolvimento.

---

## Estrutura arquitetural introduzida

Foi criada uma divisao inicial em tres camadas para o modulo de Demandas:

```text
src/
  domain/
    demands/
      Demand.ts
  application/
    demands/
      DemandRepository.ts
      createDemandService.ts
  infrastructure/
    repositories/
      local/
        LocalStorageDemandRepository.ts
      mock/
        MockDemandRepository.ts
  config/
    dataProvider.ts
```

### Dominio

Contem a entidade `Demand`, sem dependencia de `localStorage`, SQLite, Firebase ou API.

### Aplicacao

Contem:

- contrato `DemandRepository`;
- casos de uso encapsulados no servico de demandas.

### Infraestrutura

Contem as implementacoes concretas de persistencia:

- `LocalStorageDemandRepository`
- `MockDemandRepository`

---

## Regra de configuracao

O projeto passa a aceitar a selecao de persistencia por configuracao:

```text
VITE_DATA_PROVIDER=mock
VITE_DATA_PROVIDER=local
VITE_DATA_PROVIDER=remote
```

Estado atual:

- `mock`: implementado;
- `local`: implementado provisoriamente com `localStorage`;
- `remote`: reservado para futura implementacao, com fallback temporario para o provedor local.

Importante:

- `localStorage` nao representa a persistencia local definitiva do produto;
- ele existe apenas como implementacao de transicao para manter validacao funcional da interface;
- a alternativa local definitiva continua em aberto para avaliacao futura, sem decisao tomada nesta rodada.

---

## O que mudou nesta rodada

- a interface de Demandas deixou de conhecer `localStorage` diretamente;
- `App.tsx` deixou de escolher provedor e passou a depender apenas do servico de Demandas;
- foi criado um contrato explicito de repositorio;
- a logica de criar, atualizar, alternar status, excluir e listar demandas passou a depender do contrato;
- a tela existente foi preservada sem mudanca visual;
- o projeto foi preparado para trocar o provedor de persistencia sem reescrever a tela.

---

## O que nao mudou nesta rodada

- nao foi instalado Tauri;
- nao foi instalado SQLite;
- nao foi configurado Firebase;
- nao foi criada API remota;
- Reunioes, Calendario, Historico e Comunicacao continuam fora desta abstracao inicial.

---

## Proximo passo recomendado

Seguir o mesmo padrao, por etapas, para:

1. Historico
2. Reunioes
3. Calendario

Somente depois disso faz sentido comparar com mais clareza:

- SQLite para modo local;
- backend remoto para acesso multi-dispositivo.
