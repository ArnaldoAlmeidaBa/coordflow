# ESTUDO_VIABILIDADE_TAURI_SQLITE_V0_1

Data: 2026-07-13

## Objetivo da rodada

Responder, sem instalar nada ainda, se o Coordena pode evoluir para uma prova de conceito desktop instalavel, monousuaria e restrita ao modulo de Demandas, preservando:

- o mesmo repositorio;
- o mesmo codigo-fonte principal;
- a versao web atual;
- a arquitetura por contratos ja iniciada.

Premissa operacional consolidada nesta revisao:

- o sistema operacional-alvo da versao instalavel e o Windows;
- o Linux permanece util para estudo e desenvolvimento, mas nao deve ser tratado como referencia principal de distribuicao para a escola.

Pergunta central desta rodada:

> Podemos criar uma prova de conceito instalavel do Coordena, restrita a Demandas, sem duplicar o projeto e sem comprometer a versao web atual?

Resposta curta:

> Sim, tecnicamente faz sentido avancar para uma prova de conceito baseada em React + Tauri + SQLite, mas o ambiente atual ainda nao esta pronto para isso e exige preparacao explicita antes de qualquer implementacao.

Refinamento importante:

> a prova de conceito deve ser desenhada para funcionamento real em Windows 10/11, com uso diario por conta padrao, sem depender de privilegios administrativos apos a instalacao.

---

## 1. Diagnostico do ambiente atual de estudo

### Sistema operacional

- Kernel: `Linux 6.12.74+deb13+1-amd64`
- Arquitetura: `x86_64`
- Distribuicao: `Debian GNU/Linux 13 (trixie)`

### Node e npm

- Node.js: `v20.19.2`
- npm: `9.2.0`

Leitura:

- o ambiente Node atual e suficientemente moderno para sustentar a camada web do projeto;
- a base atual com React + Vite nao apresenta incompatibilidade conceitual com uma futura casca Tauri.

### Rust e Cargo

- `rustc`: indisponivel
- `cargo`: indisponivel

Leitura:

- o ambiente atual nao consegue compilar Tauri neste momento;
- esse e um bloqueio objetivo para qualquer prova de conceito desktop real.

### Ferramentas de compilacao Linux

- `gcc`: disponivel (`gcc 14.2.0`)
- `pkg-config`: indisponivel

Leitura:

- ha compilador C/C++ disponivel;
- a ausencia de `pkg-config` impede verificar e provavelmente compilar dependencias nativas tipicas do Tauri no Linux;
- sem `pkg-config`, tambem nao foi possivel confirmar a presenca das bibliotecas do WebKitGTK e correlatas.

### Bibliotecas nativas normalmente relevantes para Tauri no Linux

Nao foi possivel confirmar no ambiente atual:

- `webkit2gtk`
- `javascriptcoregtk`
- `libsoup`

Motivo:

- `pkg-config` nao esta instalado, entao a verificacao nao pode ser concluida por comando local padrao.

Leitura:

- essas dependencias devem ser tratadas como pendencias provaveis ate verificacao posterior autorizada;
- o ambiente nao deve ser considerado pronto para build desktop ainda.

### Espaco em disco

- volume do repositorio: `94G` total
- usado: `8.1G`
- livre: `81G`

Leitura:

- ha espaco confortavel para adicionar toolchain, build desktop e artefatos locais de teste.

### Interpretacao correta deste diagnostico

Este levantamento descreve apenas o ambiente Linux atualmente disponivel para estudo local.

Ele nao deve ser confundido com:

- ambiente-alvo de execucao da coordenadora;
- ambiente definitivo de empacotamento do instalador Windows;
- evidencia de que o Linux sera a plataforma principal de distribuicao.

---

## 2. Sistema operacional-alvo da prova de conceito

O alvo principal da versao instalavel deve ser:

- Windows 10
- Windows 11

Condicoes operacionais esperadas:

- execucao diaria por usuario padrao;
- nenhuma dependencia de permissao administrativa para abrir ou usar o app depois de instalado;
- banco SQLite no diretorio de dados do proprio usuario;
- nenhum dado salvo em `Program Files` ou na pasta de instalacao;
- criacao e atualizacao do banco sem elevacao de privilegios;
- backup e restauracao em pastas acessiveis ao usuario;
- preservacao dos dados ao atualizar ou reinstalar;
- validacao em conta Windows sem privilegios administrativos.

Distincao importante:

- o instalador pode, dependendo do formato, exigir permissao administrativa;
- isso nao pode virar condicao normal de funcionamento do Coordena no dia a dia.

Possibilidade que merece estudo proprio na proxima rodada:

- instalacao por usuario, dentro do perfil da coordenadora, como alternativa especialmente relevante para ambientes escolares com restricoes de permissao.

---

## 3. Compatibilidade com o projeto atual

### Stack web atual

Base identificada:

- React `19.0.1`
- React DOM `19.0.1`
- Vite `6.2.3`
- plugin React para Vite `5.0.4`
- TypeScript `5.8.2`

Leitura:

- nao ha sinal estrutural de incompatibilidade com Tauri apenas pelo uso dessas versoes;
- a interface atual pode continuar em `src/`, com Vite servindo o frontend e Tauri encapsulando a execucao desktop;
- a validacao final de compatibilidade de versoes so deve ocorrer quando houver autorizacao para instalar a camada Tauri.

### Arquitetura atual de Demandas

O modulo de Demandas ja possui a separacao minima desejada:

- dominio: `src/domain/demands/Demand.ts`
- contrato: `src/application/demands/DemandRepository.ts`
- servico: `src/application/demands/createDemandService.ts`
- selecao de provedor: `src/config/dataProvider.ts`
- implementacoes atuais: `MockDemandRepository` e `LocalStorageDemandRepository`

Leitura:

- esse desenho favorece diretamente a futura introducao de `SQLiteDemandRepository`;
- a camada de interface nao precisa conhecer SQLite;
- a diretriz "um produto, multiplas formas de persistencia" continua preservada.

---

## 4. Impacto previsto no repositorio

Estrutura recomendada para a prova de conceito futura:

```text
coordflow/
├── src/
├── src-tauri/
├── docs/
├── package.json
├── vite.config.ts
└── .env.example
```

### Papel de cada parte

`src/`

- interface React;
- componentes compartilhados;
- regras de negocio;
- entidades;
- servicos;
- contratos de repositorio.

`src-tauri/`

- camada desktop;
- configuracao do Tauri;
- codigo Rust necessario para ponte com sistema operacional;
- acesso a caminhos locais de dados;
- possivel exposicao de comandos para SQLite, backup e restauracao.

### Conclusao sobre impacto no repositorio

- nao e necessario criar projeto separado;
- a versao web pode continuar compilavel;
- os componentes React nao precisam ser duplicados;
- a principal adicao sera uma pasta `src-tauri/` e possiveis scripts no `package.json`;
- o impacto arquitetural e moderado, nao explosivo.

---

## 5. Desenho do futuro SQLiteDemandRepository

### Contrato atual a ser preservado

O contrato atual de Demandas contem apenas:

- `list()`
- `getById(id)`
- `create(input)`
- `update(id, input)`
- `delete(id)`

Leitura:

- o contrato ja e suficiente para o fluxo da prova de conceito;
- nao ha necessidade real de ampliacao nesta rodada;
- a prova de conceito desktop deve respeitar esse contrato como ele esta.

### Fluxo arquitetural esperado

```text
App
→ DemandService
→ DemandRepository
→ SQLiteDemandRepository
```

### Campos de Demand que ja estao explicitados

Campos atuais do dominio:

- `id`
- `title`
- `priority`
- `status`
- `deadline`
- `category`
- `notes`
- `createdAt`

Leitura:

- o dominio atual ja explicita todos os dados necessarios para persistir Demandas na prova de conceito;
- nao ha lacuna obrigatoria de modelagem para esse primeiro fluxo desktop.

### Esquema inicial sugerido para SQLite

Tabela `demands`:

```text
id TEXT PRIMARY KEY
title TEXT NOT NULL
priority TEXT NOT NULL
status TEXT NOT NULL
deadline TEXT NOT NULL
category TEXT NOT NULL
notes TEXT NULL
created_at TEXT NOT NULL
```

Indices minimos recomendados:

- indice por `status`
- indice por `deadline`

Observacao:

- datas podem continuar em texto ISO nesta prova de conceito, para reduzir complexidade e manter alinhamento com o formato atual do frontend.

---

## 6. Proposta para o provedor `sqlite`

### Provedores previstos

Estado conceitual desejado:

```text
local
mock
sqlite
remote
```

### Regra de uso

- `sqlite` deve existir apenas na versao desktop;
- a versao web nao deve tentar acessar SQLite;
- a interface nao deve receber condicionais espalhadas para saber se esta em modo desktop.

### Proposta de selecao

Sugestao de arranjo:

1. manter `VITE_DATA_PROVIDER` como chave declarativa;
2. adicionar `sqlite` ao tipo de provedor quando a implementacao for autorizada;
3. concentrar a decisao em um ponto unico de composicao do repositorio;
4. deixar a camada Tauri injetar ou habilitar o provedor desktop.

Exemplo conceitual:

```text
web:
  mock | local | remote

desktop:
  sqlite
```

### Observacao importante

`sqlite` nao deve virar apenas mais um fallback generico na web.

Se o provedor for `sqlite` sem ambiente desktop disponivel, o comportamento futuro recomendado e:

- falhar de forma explicita; ou
- recusar inicializacao desse provedor com mensagem clara.

Isso evita falsa impressao de persistencia SQLite quando o app estiver rodando no navegador comum.

---

## 7. Localizacao prevista do banco

### Diretriz

O banco nao deve ficar:

- na pasta de instalacao do programa;
- dentro do repositorio;
- em local manual escolhido pelo usuario no primeiro momento.

### Recomendacao para Windows alvo

O caminho conceitual esperado e:

```text
Aplicacao:
C:\Program Files\Coordena\

Dados do usuario:
C:\Users\<usuario>\AppData\Roaming\Coordena\
```

Arquivo de banco, de forma conceitual:

```text
C:\Users\<usuario>\AppData\Roaming\Coordena\coordena.db
```

Regra obrigatoria:

- a aplicacao deve localizar esse diretorio pelas APIs do sistema operacional expostas pela plataforma desktop;
- nao deve presumir letra de unidade;
- nao deve presumir nome de usuario;
- nao deve escrever caminho fixo manualmente no codigo.

Forma correta de pensar o caminho:

```text
<app_data_dir>/coordena.db
```

onde `app_data_dir` deve ser resolvido por API oficial da plataforma.

### Objetivos atendidos

- atualizacao do executavel nao apaga os dados;
- reinstalacao do programa nao deve apagar automaticamente o banco;
- o banco fica em local previsivel para backup;
- evita mistura entre binario e dados da coordenadora.

---

## 8. Estrategia minima de migracoes

### Requisito minimo

A prova de conceito nao deve depender de criacao manual de tabela.

### Estrategia recomendada

Usar tabela de controle:

```text
schema_migrations
```

Campos minimos sugeridos:

```text
version TEXT PRIMARY KEY
applied_at TEXT NOT NULL
```

### Estrategia operacional

Na inicializacao do app desktop:

1. abrir ou criar o banco;
2. verificar existencia de `schema_migrations`;
3. aplicar migracoes pendentes em ordem;
4. registrar cada migracao executada.

### Menor recorte aceitavel

Migracao inicial:

- criar `schema_migrations`
- criar `demands`
- criar indices minimos

---

## 9. Contrato funcional de backup e restauracao

### Funcoes futuras minimas

- Fazer backup
- Restaurar backup
- Abrir pasta de backups

### Conteudo minimo do backup

```text
coordena.db
manifest.json
```

### Campos minimos do manifesto

- nome da aplicacao
- versao da aplicacao
- versao do banco
- data e hora do backup

### Regras recomendadas antes da implementacao

Validacao do backup:

- verificar se `coordena.db` existe;
- verificar se `manifest.json` existe;
- validar estrutura minima do manifesto;
- validar compatibilidade minima de versao suportada.

Protecao do banco atual:

- antes de restaurar, copiar o banco corrente para um backup preventivo datado;
- nunca sobrescrever o banco ativo sem essa copia de seguranca.

Tratamento de falha:

- restauracao deve operar sobre copia temporaria antes de promover o banco final;
- se a restauracao falhar, manter o banco anterior intacto;
- registrar mensagem clara para o usuario.

Evitar perda acidental:

- confirmar restauracao com aviso explicito;
- exibir data do backup selecionado;
- avisar que a restauracao substitui o estado atual.

### Pasta de backups

Recomendacao conceitual:

```text
<app_data_dir>/backups/
```

No alvo Windows, isso deve corresponder ao diretorio de dados do usuario, e nao a `Program Files`.

---

## 10. Atualizacao do aplicativo e preservacao dos dados

Separacao necessaria:

```text
arquivos do programa
```

e

```text
dados da coordenadora
```

### Regra para o piloto

A atualizacao manual do executavel e suficiente, desde que:

- `coordena.db` permaneça fora da pasta de instalacao;
- configuracoes locais permaneçam fora da pasta de instalacao;
- backups permaneçam fora da pasta de instalacao.

Leitura:

- nao ha necessidade de auto-update nesta fase;
- o foco e garantir que reinstalar o programa nao destrua dados.

---

## 11. Seguranca local

### Avaliacao para a primeira prova de conceito

Opcao aceitavel para o piloto:

- abertura direta da aplicacao

Sem incluir ainda:

- login remoto;
- autenticacao online;
- gestao multiusuario.

### Risco principal

Em computador compartilhado, qualquer pessoa com acesso ao usuario do sistema operacional podera abrir os dados da coordenadora.

### Medida minima recomendada nesta fase

- registrar esse risco explicitamente;
- preferir uso em maquina de trabalho individual da coordenadora;
- postergar PIN local para decisao posterior, caso o piloto mostre necessidade real.

---

## 12. Menor recorte funcional recomendavel

Escopo da prova de conceito futura:

```text
abrir aplicacao
→ listar demandas
→ criar demanda
→ editar demanda
→ concluir ou excluir
→ fechar aplicacao
→ abrir novamente
→ confirmar persistencia
```

Nao incluir ainda:

- Historico
- Reunioes
- Comunicacao
- anexos
- sincronizacao
- banco remoto
- autenticacao online
- atualizacao automatica

Leitura:

- esse recorte e pequeno, testavel e coerente com a arquitetura atual;
- ele reduz risco e permite validar o valor real da persistencia desktop.

### Criterio de validacao operacional da prova de conceito

Fluxo alvo para validacao real em Windows:

```text
instalar no Windows
→ abrir como usuario padrao
→ criar demandas
→ fechar e reabrir
→ confirmar persistencia
→ realizar backup
→ atualizar a aplicacao
→ confirmar preservacao dos dados
```

Regra:

- o uso como administrador nao deve ser aceito como condicao normal de funcionamento.

---

## 13. Riscos e bloqueios identificados

### Bloqueios atuais objetivos

- `rustc` ausente
- `cargo` ausente
- `pkg-config` ausente
- bibliotecas Linux tipicas do Tauri nao verificadas

### Bloqueios e perguntas especificas do alvo Windows

- ainda nao foi decidido se o instalador sera gerado diretamente em maquina Windows, por pipeline de CI ou por outra estrategia;
- ainda nao foi definido se o melhor formato para a escola e instalacao por maquina ou por usuario;
- ainda nao foi verificado como um Windows institucional sem privilegios administrativos impacta instalacao, atualizacao e restauracao.

### Riscos arquiteturais

- misturar comportamento web e desktop no mesmo seletor sem regras claras;
- deixar `sqlite` parecer disponivel no navegador comum;
- crescer escopo cedo demais para Historico ou Reunioes;
- acoplar backup/restauracao diretamente a componentes React.

### Riscos operacionais

- computador compartilhado sem protecao local;
- usuario confundir reinstalacao do app com perda de dados;
- ausencia de estrategia de migracao levar a quebras em atualizacoes.

### Risco de estrategia de compilacao

- assumir que compilar no Linux produzira automaticamente o instalador Windows definitivo;
- isso nao deve ser presumido sem estudo especifico da cadeia de build e empacotamento.

---

## 14. Recomendacao final

### Decisao recomendada

Avancar para a prova de conceito instalavel faz sentido, mas somente apos autorizacao explicita para preparar o ambiente.

### Justificativa

- a arquitetura de Demandas ja esta pronta para receber `SQLiteDemandRepository`;
- o repositorio nao precisa ser duplicado;
- a versao web pode ser preservada;
- o recorte funcional e pequeno o bastante para validar operacao real;
- os bloqueios atuais sao de ambiente, nao de desenho do produto.

### O que falta antes de implementar

1. autorizar instalacao/verificacao de toolchain desktop
2. instalar ou disponibilizar Rust e Cargo
3. instalar ou disponibilizar `pkg-config`
4. verificar bibliotecas Linux exigidas para Tauri
5. confirmar o bundle id e o diretorio de dados do app
6. decidir a estrategia de geracao do instalador Windows
7. validar o cenario real: "como entregar e atualizar o Coordena em um Windows institucional no qual a coordenadora nao e administradora?"

### Proxima rodada recomendada

Nome sugerido:

> Preparar controladamente o ambiente Linux para a prova de conceito Tauri, verificando cada dependencia antes da instalacao.

Mas com separacao explicita entre duas frentes:

1. ambiente Linux de desenvolvimento
2. ambiente Windows de compilacao, empacotamento e validacao operacional

Essa proxima rodada nao deve assumir que o Linux local sera suficiente para gerar o instalador Windows final.

Antes de qualquer instalacao no Linux, ela deve responder:

- a geracao do instalador Windows sera feita diretamente em uma maquina Windows?
- sera feita por pipeline de CI?
- ou por outra estrategia documentada?

### Conclusao executiva

> Sim, podemos criar uma prova de conceito instalavel do Coordena, restrita a Demandas, sem duplicar o projeto e sem comprometer a versao web atual.

Condicao:

> ainda nao neste ambiente, sem antes resolver os prerequisitos tecnicos e definir com clareza a estrategia de entrega para Windows institucional.
