
<table align="center">
<tr>

<td align="center" width="25%">
<img src="imagens/ufma.png" width="140">
</td>

<td align="center" width="50%">

<strong>Universidade Federal do Maranhão (UFMA)</strong><br>
Centro de Ciências Exatas e Tecnologia<br>
Curso de Engenharia da Computação<br>
Disciplinas: Projeto e Desenvolvimento de Software | Banco de Dados<br><br>

<strong>Discentes:</strong><br>
Renata Costa Rocha<br>
Raphael Câmara Sá<br>
Luis Eduardo Baima do Lago Melonio Junior

</td>

<td align="center" width="25%">
<img src="imagens/fixer.png" width="140">
</td>

</tr>
</table>

<hr>
<p align="center">
  <table align="center">
    <tr>
      <td style="border: 4px solid #0a1f44; padding: 12px;">
        <img src="imagens/fixer.png" alt="FIXER" width="450">
      </td>
    </tr>
  </table>
</p>
<h1 align="center">FIXER</h1>

<p align="center">
  <em>
    Plataforma web para gestão de manutenção de ativos, controle de ordens de serviço,
    acompanhamento de indicadores operacionais, rastreabilidade de intervenções e apoio à
    tomada de decisão em ambientes industriais, organizacionais e acadêmicos.
  </em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-MVP%20Funcional-blue?style=flat-square">
  <img src="https://img.shields.io/badge/Projeto-Acadêmico-green?style=flat-square">
  <img src="https://img.shields.io/badge/Área-Gestão%20de%20Manutenção-orange?style=flat-square">
  <img src="https://img.shields.io/badge/React-TypeScript-blue?style=flat-square">
  <img src="https://img.shields.io/badge/Vite-Frontend-purple?style=flat-square">
  <img src="https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=flat-square">
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square">
  <img src="https://img.shields.io/badge/GitHub-Versionamento-black?style=flat-square">
</p>

---

## 1. Descrição do Projeto

O **FIXER** é uma plataforma web desenvolvida para apoiar a **gestão de manutenção de ativos**, reunindo em um único sistema funcionalidades para cadastro de equipamentos, controle de ordens de manutenção, acompanhamento de status, histórico de intervenções, indicadores operacionais, relatórios e dashboards específicos para diferentes perfis de usuário.

A proposta do sistema consiste em oferecer uma solução centralizada para o gerenciamento do ciclo de vida da manutenção, permitindo que gestores e técnicos acompanhem, registrem e controlem as atividades relacionadas a ativos físicos.

O projeto foi desenvolvido no contexto acadêmico das disciplinas de **Projeto e Desenvolvimento de Software** e **Banco de Dados**, do curso de **Engenharia da Computação** da **Universidade Federal do Maranhão**, com o objetivo de aplicar conceitos de desenvolvimento web, modelagem de dados, arquitetura de software, autenticação, persistência de dados, versionamento e documentação técnica.

O sistema contempla uma interface moderna e responsiva, desenvolvida com **React**, **TypeScript**, **Vite**, **Tailwind CSS** e integração com **Supabase PostgreSQL**.

---

## 2. Contexto do Projeto

A manutenção de ativos é uma atividade essencial em empresas, indústrias, instituições públicas, ambientes acadêmicos, operações logísticas, unidades hospitalares, sistemas prediais e demais organizações que dependem de equipamentos físicos para manter suas atividades funcionando.

Em muitos cenários, o controle da manutenção ainda é realizado por meio de:

- planilhas manuais;
- mensagens em aplicativos;
- documentos físicos;
- registros descentralizados;
- controles informais;
- histórico incompleto;
- acompanhamento visual limitado;
- baixa rastreabilidade das intervenções.

Esse tipo de gestão dificulta a tomada de decisão, reduz a previsibilidade das manutenções e aumenta os riscos de falhas inesperadas.

Nesse contexto, o **FIXER** surge como uma proposta de solução digital para centralizar as informações de manutenção, organizar o fluxo das ordens, acompanhar os responsáveis, visualizar indicadores e apoiar a gestão operacional dos ativos.

---

## 3. Tema

O tema do projeto é:

> **Gestão de manutenção de ativos com controle de ordens de serviço, rastreabilidade operacional e apoio à tomada de decisão.**

A proposta considera que a manutenção eficiente exige organização, registro histórico, acompanhamento de indicadores e separação clara entre as responsabilidades de gestores e técnicos.

O sistema busca transformar o processo de manutenção em um fluxo mais estruturado, permitindo que as demandas sejam registradas, avaliadas, executadas, concluídas e encerradas formalmente.

---

## 4. Problema Identificado

A ausência de um sistema integrado de manutenção pode provocar diversos problemas operacionais.

Entre os principais problemas identificados, destacam-se:

- dificuldade para registrar e acompanhar ordens de manutenção;
- ausência de histórico confiável das intervenções;
- falhas inesperadas em equipamentos;
- dificuldade para saber quais ordens estão pendentes, em execução ou encerradas;
- baixa rastreabilidade das ações realizadas por técnicos;
- dependência de controles manuais;
- falta de indicadores para tomada de decisão;
- dificuldade em priorizar ordens críticas;
- comunicação pouco estruturada entre gestor e técnico;
- dificuldade para acompanhar ativos que exigem atenção;
- ausência de visão consolidada sobre a operação de manutenção;
- dificuldade em diferenciar execução técnica e encerramento gerencial;
- perda de informações sobre registros técnicos e motivos de falha.

Do ponto de vista de Projeto e Desenvolvimento de Software, esses problemas indicam a necessidade de uma aplicação com boa organização de fluxo, banco de dados, controle de perfis, interface clara e persistência das informações.

---

## 5. Solução Proposta

O **FIXER** propõe uma plataforma web integrada para gestão de manutenção de ativos, com foco em organização, rastreabilidade e apoio à decisão.

A aplicação reúne em um único ambiente:

- autenticação de usuários;
- separação entre perfil gestor e perfil técnico;
- dashboard executivo para gestores;
- dashboard operacional para técnicos;
- cadastro e consulta de ativos;
- criação e acompanhamento de ordens de manutenção;
- atribuição de responsáveis;
- controle de status das ordens;
- registro de atividades técnicas;
- conclusão da execução pelo técnico;
- encerramento formal pelo gestor;
- histórico de manutenção;
- relatórios operacionais;
- indicadores de desempenho;
- configurações de perfil;
- suporte a tema claro e escuro;
- integração com Supabase PostgreSQL.

A solução foi construída com uma interface modular, buscando facilitar a navegação, reduzir a carga cognitiva do usuário e destacar as informações mais importantes em cada etapa do processo.

---

## 6. Objetivo Geral

Desenvolver uma plataforma web funcional para **gestão integrada de ativos e manutenção**, permitindo o controle de ordens de serviço, o acompanhamento de indicadores, a organização do histórico de intervenções e o apoio à tomada de decisão por gestores e técnicos.

---

## 7. Objetivos Específicos

O projeto possui os seguintes objetivos específicos:

- desenvolver uma interface web funcional e navegável;
- implementar autenticação de usuários;
- diferenciar perfis de acesso entre gestor e técnico;
- permitir o cadastro e consulta de ativos;
- permitir a criação de ordens de manutenção;
- permitir a atribuição de ordens a responsáveis técnicos;
- implementar fluxo de validação, execução e encerramento de ordens;
- permitir que o técnico registre atividades realizadas;
- permitir que o técnico conclua a execução da ordem;
- permitir que o gestor encerre formalmente a ordem;
- organizar histórico de intervenções;
- apresentar indicadores operacionais;
- criar dashboards específicos por perfil;
- integrar a aplicação ao Supabase PostgreSQL;
- aplicar conceitos de Banco de Dados;
- aplicar boas práticas de Projeto e Desenvolvimento de Software;
- utilizar Git e GitHub para versionamento;
- documentar o projeto de forma clara e estruturada.

---

## 8. Público-Alvo

O FIXER foi projetado para usuários envolvidos em processos de manutenção de ativos, tais como:

- gestores de manutenção;
- técnicos de manutenção;
- engenheiros de manutenção;
- analistas operacionais;
- empresas industriais;
- empresas de facilities;
- instituições públicas;
- instituições privadas;
- equipes de manutenção predial;
- operações logísticas;
- ambientes acadêmicos;
- setores responsáveis por equipamentos, máquinas ou infraestrutura.

---

## 9. Justificativa

A criação do **FIXER** justifica-se pela necessidade de soluções digitais que melhorem a gestão de manutenção de ativos.

A manutenção é uma área estratégica, pois impacta diretamente na disponibilidade dos equipamentos, na produtividade das operações, na segurança dos usuários e nos custos organizacionais. Quando a manutenção é controlada de forma manual ou descentralizada, torna-se mais difícil identificar falhas recorrentes, acompanhar responsáveis, priorizar demandas e manter registros confiáveis.

A utilização de uma plataforma web integrada permite:

- centralizar informações sobre ativos;
- organizar o fluxo de ordens;
- registrar intervenções técnicas;
- acompanhar decisões gerenciais;
- melhorar a comunicação entre gestor e técnico;
- reduzir perda de informações;
- apoiar decisões com indicadores;
- estruturar o histórico de manutenção;
- melhorar a confiabilidade dos ativos.

Além disso, o projeto apresenta relevância acadêmica por integrar conceitos de **Engenharia de Software**, **Banco de Dados**, **Desenvolvimento Web**, **Interface de Usuário**, **Controle de Versão** e **Gestão da Manutenção**.

---

## 10. Mapas de Personas

As personas foram definidas para orientar as decisões de interface, navegação, linguagem visual e priorização das funcionalidades do sistema.

---

### 10.1 Persona 1 — Gestora de Manutenção

| Campo | Descrição |
|---|---|
| Nome | Renata Rocha |
| Idade | 32 anos |
| Perfil | Gestora responsável pelo acompanhamento de ativos, ordens e indicadores de manutenção |
| Objetivo | Ter uma visão consolidada da operação, acompanhar ordens ativas e tomar decisões com base em dados |
| Dores | Falta de visibilidade sobre ordens em execução, dificuldade para priorizar demandas e ausência de histórico organizado |
| Necessidades | Dashboard executivo, indicadores, painel de atribuições, relatórios e controle de encerramento |
| Funcionalidades relacionadas | Dashboard do Gestor, Atribuições, Ordens, Relatórios, Histórico e Ativos |

---

### 10.2 Persona 2 — Técnico de Manutenção

| Campo | Descrição |
|---|---|
| Nome | João da Silva |
| Idade | 38 anos |
| Perfil | Técnico responsável pela execução das ordens de manutenção atribuídas |
| Objetivo | Visualizar suas ordens, registrar atividades e concluir execuções com clareza |
| Dores | Dificuldade para saber quais ordens estão pendentes, em execução ou aguardando conclusão |
| Necessidades | Painel operacional, tela Minhas Ordens, botões claros de registrar atividade e concluir execução |
| Funcionalidades relacionadas | Dashboard do Técnico, Minhas Ordens, Registro de Atividade, Conclusão Técnica e Histórico |

---

## 11. Requisitos do Sistema

### 11.1 Requisitos Funcionais

| Código | Requisito |
|---|---|
| RF01 | O sistema deve permitir login de usuários |
| RF02 | O sistema deve permitir cadastro de usuários |
| RF03 | O sistema deve permitir recuperação de senha |
| RF04 | O sistema deve diferenciar usuários gestores e técnicos |
| RF05 | O sistema deve exibir dashboard específico para gestor |
| RF06 | O sistema deve exibir dashboard específico para técnico |
| RF07 | O sistema deve permitir cadastro de ativos |
| RF08 | O sistema deve permitir consulta de ativos |
| RF09 | O sistema deve permitir criação de ordens de manutenção |
| RF10 | O sistema deve permitir atribuição de ordens a técnicos |
| RF11 | O sistema deve permitir controle de status da ordem |
| RF12 | O sistema deve permitir aprovação de ordens |
| RF13 | O sistema deve permitir início da execução pelo técnico |
| RF14 | O sistema deve permitir registro de atividade técnica |
| RF15 | O sistema deve permitir conclusão da execução pelo técnico |
| RF16 | O sistema deve permitir encerramento formal pelo gestor |
| RF17 | O sistema deve permitir consulta de histórico |
| RF18 | O sistema deve apresentar indicadores de manutenção |
| RF19 | O sistema deve apresentar relatórios |
| RF20 | O sistema deve permitir edição de perfil do usuário |
| RF21 | O sistema deve permitir alternância entre tema claro e escuro |
| RF22 | O sistema deve permitir busca por informações relevantes |
| RF23 | O sistema deve permitir visualizar ordens por responsável |
| RF24 | O sistema deve exibir ordens ativas que exigem atenção |

---

### 11.2 Requisitos Não Funcionais

| Código | Requisito |
|---|---|
| RNF01 | A interface deve ser clara e organizada |
| RNF02 | O sistema deve oferecer feedback visual para ações do usuário |
| RNF03 | O sistema deve utilizar cores para indicar status, riscos e prioridades |
| RNF04 | A navegação deve ser consistente entre os módulos |
| RNF05 | O sistema deve reduzir a carga cognitiva do usuário |
| RNF06 | O front-end deve ser executável em ambiente web |
| RNF07 | O sistema deve utilizar persistência de dados via Supabase PostgreSQL |
| RNF08 | A interface deve ser responsiva em diferentes resoluções |
| RNF09 | O sistema deve separar responsabilidades por perfil |
| RNF10 | O sistema deve utilizar componentes reutilizáveis |
| RNF11 | O sistema deve preservar dados sensíveis em variáveis de ambiente |
| RNF12 | O sistema deve permitir manutenção incremental por versionamento |

---

## 12. Arquitetura da Informação

A arquitetura da informação do FIXER foi organizada de forma modular, com base nos principais fluxos de uso dos perfis gestor e técnico.

```text
FIXER
│
├── Autenticação
│   ├── Login
│   ├── Cadastro
│   └── Recuperação de Senha
│
├── Dashboard
│   ├── Dashboard do Gestor
│   │   ├── Indicadores gerais
│   │   ├── Ativos monitorados
│   │   ├── Ordens em andamento
│   │   ├── Painel executivo
│   │   └── Atalhos operacionais
│   │
│   └── Dashboard do Técnico
│       ├── Ordens atribuídas
│       ├── Ordens pendentes
│       ├── Ordens em execução
│       ├── Ordens aguardando conclusão
│       └── Histórico técnico
│
├── Ativos
│   ├── Lista de Ativos
│   ├── Cadastro de Ativo
│   ├── Edição de Ativo
│   ├── Status Operacional
│   └── Relação com Ordens
│
├── Ordens de Manutenção
│   ├── Nova Ordem
│   ├── Lista de Ordens
│   ├── Detalhes da Ordem
│   ├── Validação
│   ├── Aprovação
│   ├── Execução
│   ├── Registro de Atividade
│   ├── Conclusão Técnica
│   └── Encerramento Gerencial
│
├── Atribuições
│   ├── A Validar
│   ├── A Encerrar
│   ├── A Priorizar
│   ├── A Revisar
│   ├── Próxima Decisão Recomendada
│   ├── Ordens por Responsável
│   └── Ordens Ativas que Exigem Atenção
│
├── Histórico
│   ├── Ordens Encerradas
│   ├── Ordens Canceladas
│   ├── Ordens Reprovadas
│   └── Registros Técnicos
│
├── Relatórios
│   ├── Indicadores
│   ├── Métricas Operacionais
│   ├── Análise de Ativos
│   └── Visão Gerencial
│
└── Configurações
    ├── Perfil do Usuário
    ├── Foto
    ├── Dados Profissionais
    ├── Preferências
    └── Tema
```

---

## 13. Fluxo Principal de Uso

```text
Usuário acessa o sistema
        ↓
Realiza login
        ↓
Sistema identifica o perfil
        ↓
┌───────────────────────────────┬───────────────────────────────┐
│ Gestor                        │ Técnico                       │
│                               │                               │
│ Visualiza dashboard executivo │ Visualiza painel operacional  │
│ Acompanha ativos              │ Consulta ordens atribuídas    │
│ Cria/valida ordens            │ Inicia execução               │
│ Atribui técnico               │ Registra atividade            │
│ Monitora execução             │ Conclui execução técnica      │
│ Encerra ordem                 │ Consulta histórico            │
└───────────────────────────────┴───────────────────────────────┘
        ↓
Histórico, relatórios e acompanhamento de indicadores
```

---

## 14. Status das Ordens de Manutenção

O sistema organiza as ordens por status, permitindo acompanhar sua evolução no fluxo operacional.

| Status | Descrição |
|---|---|
| Rascunho | Ordem ainda não enviada para validação |
| Em validação | Ordem aguardando análise do gestor |
| Aprovada | Ordem liberada para execução técnica |
| Reprovada | Ordem recusada ou devolvida para revisão |
| Em execução | Ordem em atendimento pelo técnico |
| Aguardando encerramento | Execução concluída pelo técnico e aguardando encerramento do gestor |
| Encerrada | Ordem finalizada formalmente |
| Cancelada | Ordem cancelada |

---

## 15. Tipos de Manutenção

O sistema contempla três tipos principais de manutenção.

### 15.1 Manutenção Corretiva

Manutenção realizada após a ocorrência de uma falha.

Exemplo:

```text
Equipamento apresentou defeito e precisa de reparo.
```

---

### 15.2 Manutenção Preventiva

Manutenção realizada de forma planejada, com o objetivo de evitar falhas.

Exemplo:

```text
Inspeção periódica, limpeza, lubrificação ou substituição programada.
```

---

### 15.3 Manutenção Preditiva

Manutenção baseada no acompanhamento de sinais, condições ou comportamento do equipamento.

Exemplo:

```text
Monitoramento de temperatura, vibração, ruído ou desempenho.
```

---

## 16. Indicadores de Desempenho

O FIXER utiliza conceitos da Engenharia de Manutenção para apoiar a análise dos ativos.

### 16.1 MTBF — Mean Time Between Failures

O **MTBF** representa o tempo médio entre falhas consecutivas de um ativo.

```text
MTBF = Tempo Total de Operação / Número de Falhas
```

Esse indicador auxilia na avaliação da confiabilidade do equipamento.

---

### 16.2 MTTR — Mean Time To Repair

O **MTTR** representa o tempo médio necessário para reparar um equipamento.

```text
MTTR = Tempo Total de Reparo / Número de Reparos
```

Esse indicador auxilia na avaliação da eficiência da manutenção.

---

### 16.3 Disponibilidade

A disponibilidade representa o percentual de tempo em que o ativo permanece operacional.

```text
Disponibilidade = MTBF / (MTBF + MTTR)
```

Quanto maior a disponibilidade, maior a capacidade operacional do ativo.

---

## 17. Diagramas do Projeto

Os diagramas foram utilizados para representar a estrutura, o comportamento e os fluxos principais do sistema FIXER. Eles auxiliam na compreensão da arquitetura da solução, das entidades envolvidas, dos estados das ordens de manutenção e das interações entre usuários e sistema.

Os arquivos podem ser organizados na pasta:

```text
imagens/diagramas/
```

Sim — o arquivo que você mandou ainda estava com caminhos antigos, tipo `imagens/diagramas/...` e `imagens/prints/...`. Corrigi para o caminho real da sua pasta: `frontend_v2/public/telas/...`. 

Copie este bloco completo:

````markdown
---

## 17. Diagramas do Projeto

Os diagramas foram utilizados para representar a estrutura, o comportamento e os fluxos principais do sistema **FIXER**. Eles auxiliam na compreensão da arquitetura da solução, das entidades envolvidas, dos estados das ordens de manutenção, dos fluxos operacionais e das interações entre usuários e sistema.

Os arquivos dos diagramas estão organizados na pasta:

```text
frontend_v2/public/telas/
````

---

### 17.1 Diagrama de Casos de Uso

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/diagramacasodeuso.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 1.</strong> Diagrama de casos de uso do FIXER.</em>
</p>

<br>

#### Análise do Diagrama de Casos de Uso

O diagrama de casos de uso representa as principais interações entre os atores do sistema e as funcionalidades disponíveis. No FIXER, os atores principais são o **gestor** e o **técnico**.

O gestor interage com funcionalidades relacionadas à administração da manutenção, como cadastro de ativos, criação e validação de ordens, acompanhamento de indicadores, consulta ao histórico, análise de relatórios e encerramento formal de ordens.

Já o técnico interage com funcionalidades operacionais, como consulta de ordens atribuídas, início de execução, registro de atividade e conclusão técnica.

Esse diagrama evidencia a separação de responsabilidades entre os perfis, reforçando que o gestor possui uma visão gerencial, enquanto o técnico atua diretamente na execução das atividades de manutenção.

---

### 17.2 Diagrama de Classes

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/diagramadeclasse.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 2.</strong> Diagrama de classes do FIXER.</em>
</p>

<br>

#### Análise do Diagrama de Classes

O diagrama de classes apresenta a estrutura lógica das principais entidades do sistema e seus relacionamentos. Entre as classes centrais do FIXER, destacam-se **Usuário**, **Gestor**, **Técnico**, **Ativo**, **Ordem de Manutenção**, **Manutenção**, **Dashboard** e **Notificação**.

A classe **Usuário** representa os perfis que acessam o sistema, podendo exercer papel de gestor ou técnico. A classe **Ativo** representa os equipamentos ou recursos físicos acompanhados pela plataforma. A classe **Ordem de Manutenção** concentra informações como tipo de manutenção, prioridade, status, responsável, descrição, datas e registros associados.

Esse diagrama demonstra que a ordem de manutenção é o elemento central do sistema, pois conecta ativos, responsáveis, registros técnicos, status e histórico operacional.

---

### 17.3 Diagrama de Estados da Ordem de Manutenção

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/diagramadeestado.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 3.</strong> Diagrama de estados das ordens de manutenção.</em>
</p>

<br>

#### Análise do Diagrama de Estados

O diagrama de estados representa o ciclo de vida de uma ordem de manutenção dentro do sistema. A ordem pode iniciar como **rascunho**, seguir para **em validação**, ser **aprovada** ou **reprovada**, entrar em **execução**, passar para **aguardando encerramento** e, por fim, ser **encerrada**.

Esse fluxo é importante porque separa claramente a execução técnica da decisão gerencial. O técnico pode iniciar e concluir a execução da ordem, mas o encerramento formal permanece sob responsabilidade do gestor.

O estado **aguardando encerramento** funciona como uma etapa intermediária entre a conclusão técnica e a finalização administrativa da ordem, aumentando a rastreabilidade e reduzindo ambiguidades no processo.

---

### 17.4 Diagrama de Atividades

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/diagramadeatividades.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 4.</strong> Diagrama de atividades do fluxo de manutenção.</em>
</p>

<br>

#### Análise do Diagrama de Atividades

O diagrama de atividades descreve o fluxo operacional do processo de manutenção no FIXER. Ele demonstra as etapas percorridas desde a criação da ordem até seu encerramento.

O fluxo inicia com a identificação de uma necessidade de manutenção, seguida pelo registro da ordem, validação do gestor, atribuição ao técnico, execução da atividade, registro do serviço realizado, conclusão técnica e encerramento pelo gestor.

Esse diagrama permite compreender a sequência lógica das ações e evidencia os pontos de decisão existentes no processo, como aprovação, reprovação, execução e encerramento.

---

### 17.5 Modelo Entidade-Relacionamento

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/diagramaentidaderelacionamento.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 5.</strong> Modelo entidade-relacionamento do FIXER.</em>
</p>

<br>

#### Análise do Modelo Entidade-Relacionamento

O modelo entidade-relacionamento representa a organização dos dados utilizados pelo sistema. Ele demonstra como as informações de usuários, ativos, ordens, registros e histórico se relacionam.

No contexto do FIXER, a entidade **Ativo** se relaciona com a entidade **Ordem de Manutenção**, pois uma ordem é criada para atender uma necessidade associada a determinado equipamento ou recurso físico.

A entidade **Usuário** se relaciona com as ordens por meio do responsável técnico ou do gestor que acompanha a decisão. Dessa forma, o modelo contribui para a organização da persistência dos dados, evitando duplicidade de informações e facilitando consultas futuras.

---

### 17.6 Modelo Relacional ou Modelo Físico

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/diagramamodelorelacional.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 6.</strong> Modelo relacional ou físico do banco utilizado pelo FIXER.</em>
</p>

<br>

#### Análise do Modelo Relacional

O modelo relacional traduz as entidades do sistema em tabelas, campos, chaves primárias e relacionamentos. Ele representa a estrutura utilizada para armazenar informações no banco de dados.

No FIXER, tabelas como **work_orders**, **assets**, **activity_records**, **order_history**, **reports** e tabelas relacionadas aos usuários permitem persistir os dados necessários para funcionamento do sistema.

A definição adequada dos campos é importante para garantir consistência, rastreabilidade e recuperação eficiente das informações. Esse modelo também apoia a implementação no **Supabase PostgreSQL**, servindo como base para a criação das tabelas e para as operações de consulta, inserção e atualização realizadas pela aplicação.

---

### 17.7 Diagrama de Sequência

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/diagramadesequencia.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 7.</strong> Diagrama de sequência do fluxo de execução e encerramento de uma ordem.</em>
</p>

<br>

#### Análise do Diagrama de Sequência

O diagrama de sequência apresenta a comunicação entre usuário, interface, serviços da aplicação e banco de dados durante uma operação específica.

No fluxo de execução de uma ordem, o técnico acessa suas ordens, seleciona uma ordem aprovada, inicia a execução, registra uma atividade e conclui o serviço.

Em seguida, o sistema atualiza o status da ordem para **aguardando encerramento**, permitindo que o gestor realize o encerramento formal. Esse diagrama evidencia a troca de mensagens entre os componentes e ajuda a compreender como o front-end, a lógica da aplicação e o banco de dados interagem durante o processo.

---

## 18. Wireframes

Os wireframes representam a estrutura inicial das telas, permitindo planejar a disposição dos elementos antes da implementação visual final. Eles foram utilizados para organizar a hierarquia visual das informações, definir áreas de interação e validar a navegação antes da construção das telas finais.

Os arquivos de wireframe estão organizados na pasta:

```text
frontend_v2/public/telas/
```

---

### 18.1 Wireframe — Tela de Login

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/wireframelogin.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 8.</strong> Wireframe da tela de login do FIXER.</em>
</p>

<br>

#### Análise do Wireframe

O wireframe da tela de login organiza os elementos essenciais de autenticação, como campos de e-mail, senha, botão de entrada, acesso ao cadastro e recuperação de senha.

A estrutura prioriza simplicidade e foco na ação principal, evitando excesso de informações e conduzindo o usuário diretamente ao acesso do sistema.

---

### 18.2 Wireframe — Dashboard do Gestor

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/wireframedashboardgestor.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 9.</strong> Wireframe do dashboard do gestor.</em>
</p>

<br>

#### Análise do Wireframe

O wireframe do dashboard do gestor organiza os indicadores em cards e estabelece uma área de visão geral da manutenção.

Essa tela foi pensada para permitir leitura rápida da situação operacional e acesso aos módulos principais, como ativos, ordens, atribuições, histórico e relatórios.

---

### 18.3 Wireframe — Dashboard do Técnico

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/wireframetecnico.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 10.</strong> Wireframe do dashboard do técnico.</em>
</p>

<br>

#### Análise do Wireframe

O wireframe do dashboard do técnico prioriza as ordens atribuídas ao usuário.

A organização da tela busca reduzir dúvidas sobre o que precisa ser iniciado, o que está em execução e o que aguarda conclusão. Assim, o técnico consegue visualizar suas responsabilidades de forma direta e objetiva.

---

### 18.4 Wireframe — Ordens de Manutenção

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/wireframeordemanut.png" width="700">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 11.</strong> Wireframe do módulo de ordens de manutenção.</em>
</p>

<br>

#### Análise do Wireframe

O wireframe do módulo de ordens estrutura a listagem das ordens, seus status, prioridades e ações disponíveis.

Ele apoia a definição da hierarquia visual necessária para que o usuário identifique rapidamente a situação de cada ordem, os responsáveis, os prazos e as ações permitidas em cada etapa do processo.

---

## 19. Projeto Visual e Protótipo

O projeto visual do **FIXER** foi desenvolvido com foco em clareza, hierarquia visual, separação de responsabilidades e facilidade de navegação.

A interface foi construída considerando:

* dashboards por perfil;
* navegação lateral persistente;
* cards informativos;
* uso de cores por status;
* botões de ação claros;
* agrupamento visual das informações;
* diferenciação entre gestor e técnico;
* suporte a tema claro e escuro;
* organização visual compatível com sistemas de gestão profissional;
* identidade visual moderna, com contraste forte, tons escuros e destaque em azul/ciano.

---

## 20. MVP Funcional

O MVP funcional foi desenvolvido como uma aplicação web executável, com foco na demonstração dos fluxos principais do sistema e na validação prática da proposta.

O projeto contempla:

* login;
* cadastro;
* recuperação de senha;
* dashboard do gestor;
* dashboard do técnico;
* cadastro de ativos;
* consulta de ativos;
* ordens de manutenção;
* atribuições do gestor;
* minhas ordens do técnico;
* histórico;
* relatórios;
* configurações;
* registro de atividade técnica;
* conclusão de execução;
* integração com Supabase PostgreSQL.

---

### 20.1 Tela do MVP — Login

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/login.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 12.</strong> Tela de login do FIXER, permitindo acesso ao sistema por gestores e técnicos.</em>
</p>

<br>

A tela de login representa o ponto inicial de acesso ao sistema. Nela, o usuário informa suas credenciais para entrar na plataforma. O sistema identifica o perfil do usuário e direciona a experiência para o fluxo adequado.

Funcionalidades contempladas nesta tela:

* autenticação;
* acesso ao sistema;
* diferenciação de perfil;
* recuperação de senha;
* cadastro de usuário.

---

### 20.2 Tela do MVP — Recuperação de Senha

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/recuperar.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 13.</strong> Tela de recuperação de senha, permitindo que o usuário solicite instruções para redefinir seu acesso ao sistema.</em>
</p>

<br>

A tela de recuperação de senha permite que o usuário solicite redefinição de acesso, melhorando a autonomia e a segurança da experiência de autenticação.

Funcionalidades contempladas nesta tela:

* solicitação de redefinição de senha;
* campo para e-mail;
* retorno ao login;
* apoio à continuidade do acesso;
* reforço da segurança do sistema.

---

### 20.3 Tela do MVP — Cadastro de Usuário

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/cadastrousuario.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 14.</strong> Tela de cadastro de usuário do FIXER, permitindo a criação de uma nova conta e definição inicial do tipo de usuário.</em>
</p>

<br>

A tela de cadastro permite o registro de novos usuários na plataforma, contemplando informações básicas para acesso e identificação do perfil.

Funcionalidades contempladas nesta tela:

* criação de conta;
* inserção de dados do usuário;
* definição inicial do tipo de usuário;
* criação de credenciais;
* integração com autenticação.

---

### 20.4 Tela do MVP — Dashboard do Gestor

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/dashboardgestor.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 15.</strong> Dashboard executivo do gestor, com visão geral dos indicadores, situação das ordens, disponibilidade operacional e acesso aos módulos principais.</em>
</p>

<br>

O dashboard do gestor concentra as principais informações operacionais em uma visão executiva. A tela apresenta cards de indicadores, gráficos, atalhos e informações consolidadas para acompanhamento da manutenção.

Funcionalidades contempladas nesta tela:

* visão geral da manutenção;
* cards de indicadores;
* acompanhamento de ordens;
* acesso a ativos;
* acesso a relatórios;
* acesso à tela de atribuições;
* busca global;
* alternância de tema;
* informações do perfil do gestor.

---

### 20.5 Tela do MVP — Análise Geral da Manutenção

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/analise.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 16.</strong> Tela de análise geral da manutenção, contendo diagnóstico executivo, indicadores consolidados, gráfico de tendência operacional e visão da disponibilidade do sistema.</em>
</p>

<br>

A tela de análise geral apresenta uma visão consolidada da operação de manutenção. Ela permite ao gestor acompanhar indicadores essenciais, como ativos cadastrados, ordens registradas, disponibilidade e pendências.

Essa tela apoia a tomada de decisão ao reunir informações executivas em um painel único, facilitando a identificação de riscos, gargalos e necessidades de ação.

Funcionalidades contempladas nesta tela:

* diagnóstico executivo;
* indicadores consolidados;
* gráfico de tendência operacional;
* visão da disponibilidade;
* apoio à tomada de decisão;
* geração de PDF.

---

### 20.6 Tela do MVP — Painel de Atribuições do Gestor

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/painelgestor.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 17.</strong> Painel de atribuições do gestor, com cards compactos, próxima decisão recomendada e acompanhamento de pendências operacionais.</em>
</p>

<br>

O painel de atribuições foi criado para apoiar o gestor no acompanhamento das ordens ativas que exigem decisão, validação, encerramento ou priorização.

Funcionalidades contempladas nesta tela:

* leitura rápida de prioridades;
* análise da próxima decisão;
* acompanhamento de técnicos;
* agrupamento por responsável;
* acesso rápido às ordens;
* apoio ao controle gerencial.

---

### 20.7 Tela do MVP — Atribuições do Gestor

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/atribuicoes.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 18.</strong> Tela de atribuições do gestor, apresentando ordens que exigem decisão, responsável técnico e situação atual da demanda.</em>
</p>

<br>

A tela de atribuições permite que o gestor acompanhe as ordens que dependem de decisão ou acompanhamento gerencial.

A tela apresenta:

* ordens a validar;
* ordens a encerrar;
* ordens a priorizar;
* ordens a revisar;
* próxima decisão recomendada;
* ordens por responsável;
* ordens ativas que exigem atenção.

---

### 20.8 Tela do MVP — Dashboard do Técnico

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/dashboardtecnico.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 19.</strong> Dashboard operacional do técnico, com foco nas ordens atribuídas, tarefas em execução, ordens aguardando conclusão e histórico recente.</em>
</p>

<br>

O dashboard do técnico apresenta uma visão operacional das demandas atribuídas ao usuário técnico. A tela destaca ordens pendentes, ordens em execução, ordens aguardando conclusão e histórico.

Funcionalidades contempladas nesta tela:

* resumo das ordens do técnico;
* visualização de ordens em execução;
* acesso direto à tela Minhas Ordens;
* indicação de ordens aguardando conclusão;
* organização das tarefas do técnico;
* separação entre fluxo operacional e visão gerencial.

---

### 20.9 Tela do MVP — Minhas Ordens do Técnico

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/minhasordens.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 20.</strong> Tela Minhas Ordens, com acompanhamento das ordens atribuídas ao técnico, status da execução e ações de registro e conclusão.</em>
</p>

<br>

A tela **Minhas Ordens** permite ao técnico acompanhar suas demandas e executar ações diretamente relacionadas à manutenção.

Funcionalidades contempladas nesta tela:

* visualização das ordens atribuídas;
* separação por status;
* ordens pendentes;
* ordens em execução;
* ordens concluídas;
* acompanhamento de produtividade;
* recomendação operacional;
* acesso à execução da ordem.

---

### 20.10 Tela do MVP — Ordens de Manutenção

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/ordens.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 21.</strong> Tela de ordens de manutenção, com cards de resumo, filtros por status, busca e listagem das ordens cadastradas.</em>
</p>

<br>

A tela de ordens de manutenção permite gerenciar, filtrar e acompanhar o ciclo das ordens registradas no sistema.

Funcionalidades contempladas nesta tela:

* listagem das ordens;
* busca por ativo, descrição, responsável ou data;
* filtros por status;
* visualização de prioridade;
* acompanhamento do ciclo da ordem;
* criação de nova ordem;
* identificação de ordens em execução, encerradas ou que exigem ação.

---

### 20.11 Tela do MVP — Ordens de Manutenção do Gestor

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/ordensgestor.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 22.</strong> Tela de ordens do gestor, com acompanhamento detalhado do ciclo de manutenção, status da ordem e fluxo operacional.</em>
</p>

<br>

O módulo de ordens do gestor permite acompanhar o fluxo de manutenção de forma completa, desde a criação até o encerramento formal.

Funcionalidades contempladas nesta tela:

* criação de ordem;
* definição de prioridade;
* definição do tipo de manutenção;
* atribuição de responsável;
* aprovação;
* reprovação;
* acompanhamento da execução;
* encerramento formal;
* visualização de detalhes.

---

### 20.12 Tela do MVP — Cadastro e Consulta de Ativos

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/cadastroconsultaativo.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 23.</strong> Tela de cadastro de ativo, com campos para identificação do equipamento, localização e status operacional.</em>
</p>

<br>

O módulo de cadastro de ativos permite registrar equipamentos ou recursos físicos monitorados pela manutenção.

Funcionalidades contempladas nesta tela:

* cadastro de ativos;
* definição de código do ativo;
* inserção de nome do equipamento;
* registro da localização;
* indicação do status operacional;
* organização dos ativos para posterior associação com ordens de manutenção.

---

### 20.13 Tela do MVP — Lista de Ativos

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/listaativos.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 24.</strong> Tela de lista de ativos cadastrados, com cards de resumo, campo de busca, status operacional e ações de gerenciamento.</em>
</p>

<br>

A tela de lista de ativos permite visualizar, consultar e acompanhar a situação dos ativos cadastrados no sistema.

Funcionalidades contempladas nesta tela:

* listagem de ativos;
* busca por código, nome, localização ou status;
* resumo quantitativo dos ativos;
* acompanhamento de ativos operacionais;
* acompanhamento de ativos em manutenção;
* acompanhamento de ativos indisponíveis;
* edição de informações dos ativos.

---

### 20.14 Tela do MVP — Registro de Atividade Técnica

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/registrotecnico.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 25.</strong> Área de registro técnico da ordem, permitindo registrar atividade realizada e concluir a execução para envio ao encerramento gerencial.</em>
</p>

<br>

O registro de atividade permite que o técnico documente as ações realizadas durante a manutenção, garantindo rastreabilidade e histórico técnico.

Funcionalidades contempladas nesta tela:

* registro da atividade realizada;
* acompanhamento da execução;
* conclusão técnica;
* envio da ordem para encerramento do gestor;
* preservação dos registros técnicos;
* apoio à rastreabilidade operacional.

---

### 20.15 Tela do MVP — Histórico de Manutenções

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/historicodema.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 26.</strong> Tela de histórico de manutenções, reunindo ordens encerradas, canceladas e registros anteriores de manutenção.</em>
</p>

<br>

O histórico permite consultar registros de manutenção, ordens concluídas, canceladas ou reprovadas, favorecendo a rastreabilidade das intervenções.

Funcionalidades contempladas nesta tela:

* histórico de ordens;
* registros técnicos;
* consulta por status;
* rastreabilidade;
* apoio à análise de recorrência;
* visualização de detalhes das manutenções anteriores.

---

### 20.16 Tela do MVP — Relatórios

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/relatorios.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 27.</strong> Tela de relatórios do FIXER, com indicadores consolidados, saúde operacional, relatórios disponíveis e opção de exportação em PDF.</em>
</p>

<br>

A tela de relatórios apresenta informações consolidadas para análise da operação de manutenção.

Funcionalidades contempladas nesta tela:

* indicadores consolidados;
* visão gerencial;
* acompanhamento de ativos;
* análise das ordens;
* relatórios disponíveis;
* exportação em PDF;
* apoio à tomada de decisão.

---

### 20.17 Tela do MVP — Configurações do Usuário

<br>

<p align="center">
  <table align="center">
    <tr>
      <td align="center">
        <img src="frontend_v2/public/telas/configuracoes.png" width="800">
      </td>
    </tr>
  </table>
</p>

<br>

<p align="center">
  <em><strong>Figura 28.</strong> Tela de configurações do usuário, com edição de perfil, foto, identificação, preferências e segurança do sistema.</em>
</p>

<br>

A tela de configurações permite a atualização de informações do usuário, dados profissionais, foto e preferências visuais.

Funcionalidades contempladas nesta tela:

* edição de nome;
* edição de área;
* edição de função;
* atualização de foto;
* gerenciamento de notificações;
* preferências de interface;
* segurança e permissões;
* tema claro e escuro.

---

## 21. Integrações Implementadas

### 21.1 Integração com Supabase PostgreSQL

O FIXER utiliza **Supabase PostgreSQL** como solução de banco de dados e backend-as-a-service.

A integração permite:

* autenticação de usuários;
* controle de sessão;
* armazenamento de ativos;
* armazenamento de ordens de manutenção;
* atualização de status;
* recuperação de registros;
* armazenamento de observações técnicas;
* armazenamento de motivos de reprovação;
* armazenamento de notas de encerramento;
* persistência do histórico operacional.

Embora o projeto tenha caráter acadêmico, a integração com Supabase amplia a robustez da solução, permitindo persistência real de dados e aproximando o sistema de uma aplicação prática.

---


### 21.2 Integração com GitHub

O projeto utiliza GitHub para hospedagem do repositório, controle de versão e organização das melhorias.

O fluxo utilizado inclui:

- branches separadas para desenvolvimento;
- commits descritivos;
- Pull Requests;
- merge controlado na branch principal;
- rastreamento das alterações realizadas.

---

## 22. Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| React | Construção da interface web |
| TypeScript | Tipagem e organização do código |
| Vite | Ambiente de desenvolvimento front-end |
| Tailwind CSS | Estilização da interface |
| React Router | Navegação entre páginas |
| Lucide React | Ícones da aplicação |
| Supabase | Autenticação e persistência de dados |
| PostgreSQL | Banco de dados relacional |
| Git | Controle de versão |
| GitHub | Hospedagem do repositório |
| Visual Studio Code | Ambiente de desenvolvimento |
| Figma | Prototipação visual |
| Draw.io | Diagramas e documentação visual |

---

## 23. Estrutura do Projeto

```text
fixer/
│
├── backend/
│
├── frontend/
│
├── frontend_v2/
│   ├── public/
│   │   ├── profile.jpg
│   │   └── tecnico.jpg
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── AssetForm.tsx
│   │   │   │   ├── AssetsList.tsx
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── ForgotPassword.tsx
│   │   │   │   ├── GestorAtribuicoes.tsx
│   │   │   │   ├── GestorDashboard.tsx
│   │   │   │   ├── GestorOrdens.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── MaintenanceHistory.tsx
│   │   │   │   ├── Register.tsx
│   │   │   │   ├── Reports.tsx
│   │   │   │   ├── Root.tsx
│   │   │   │   ├── SettingsPage.tsx
│   │   │   │   ├── TecnicoDashboard.tsx
│   │   │   │   └── TecnicoOrdens.tsx
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.tsx
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   └── ordersStore.ts
│   │   │   │
│   │   │   └── routes.tsx
│   │   │
│   │   └── lib/
│   │       └── supabase.ts
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── imagens/
│   ├── ufma.png
│   ├── fixer.png
│   ├── profile.jpeg
│   ├── prints/
│   ├── diagramas/
│   └── wireframes/
│
├── README.md
└── .gitignore
```

---

## 24. Como Clonar o Repositório

Clone o repositório:

```bash
git clone https://github.com/ahcorataner/fixer.git
```

Acesse a pasta do projeto:

```bash
cd fixer
```

---

## 25. Como Executar o Projeto

O front-end principal do projeto está localizado na pasta:

```bash
frontend_v2
```

Acesse a pasta correta:

```bash
cd frontend_v2
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

Acesse no navegador:

```text
http://localhost:5173
```

---

## 26. Observação Importante sobre Execução

O comando `npm run dev` deve ser executado dentro da pasta `frontend_v2`.

Caso o comando seja executado na raiz do projeto, poderá aparecer o erro:

```text
Missing script: "dev"
```

Forma correta:

```bash
cd frontend_v2
npm run dev
```

---

## 27. Variáveis de Ambiente

Para executar a integração com o Supabase, é necessário criar um arquivo `.env.local` dentro da pasta `frontend_v2`.

Exemplo:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

O arquivo `.env.local` não deve ser enviado ao GitHub.

A URL do Supabase deve estar no formato:

```text
https://seu-projeto.supabase.co
```

Não deve ser utilizada com `/rest/v1/` no final.

---

## 28. Relação com Projeto e Desenvolvimento de Software

O desenvolvimento do FIXER contempla práticas associadas à Engenharia de Software, tais como:

- levantamento de requisitos;
- definição de problema;
- modelagem de solução;
- separação de responsabilidades;
- componentização;
- controle de rotas;
- versionamento;
- melhoria incremental;
- uso de Pull Requests;
- organização de código;
- documentação;
- integração com banco de dados;
- validação prática da interface.

---

## 29. Relação com Interface e Usabilidade

Embora o projeto esteja vinculado às disciplinas de Projeto e Desenvolvimento de Software e Banco de Dados, a interface do FIXER também considera princípios de usabilidade.

Entre os princípios considerados, destacam-se:

- **Visibilidade do status do sistema:** uso de badges, cards e indicadores;
- **Correspondência com o mundo real:** uso de termos familiares à manutenção, como ativo, ordem, execução e encerramento;
- **Controle e liberdade do usuário:** botões de ação, retorno e navegação lateral;
- **Consistência visual:** componentes reutilizados entre telas;
- **Prevenção de erros:** separação entre conclusão técnica e encerramento gerencial;
- **Reconhecimento em vez de memorização:** menus persistentes e labels claros;
- **Flexibilidade e eficiência:** busca, filtros e atalhos;
- **Design estético e organizado:** hierarquia visual, agrupamento e contraste;
- **Apoio à tomada de decisão:** indicadores e próxima decisão recomendada.

---

## 30. Aspectos de Usabilidade

O sistema busca reduzir a carga cognitiva do usuário por meio de:

- organização modular das funcionalidades;
- navegação lateral fixa;
- dashboards específicos por perfil;
- uso de cards informativos;
- diferenciação visual por cores;
- badges de status;
- agrupamento de ordens por situação;
- separação entre ações do gestor e do técnico;
- botões claros de ação;
- indicação de ordens aguardando conclusão;
- destaque para próxima decisão recomendada;
- organização das ordens por responsável;
- suporte a tema claro e escuro.

---

## 31. Diferenciais da Proposta

Entre os diferenciais do FIXER, destacam-se:

- separação entre visão gerencial e visão técnica;
- fluxo completo de ordem de manutenção;
- dashboards personalizados por perfil;
- painel de atribuições do gestor;
- tela Minhas Ordens para técnicos;
- registro de atividades técnicas;
- conclusão técnica separada do encerramento gerencial;
- indicadores de manutenção;
- integração com Supabase PostgreSQL;
- interface moderna com React, TypeScript e Tailwind;
- organização modular do projeto;
- melhoria incremental por branch e Pull Request;
- aplicação acadêmica com potencial de uso real.

---

## 32. Limitações do MVP

Embora o FIXER apresente funcionalidades relevantes, ainda se trata de um MVP acadêmico em desenvolvimento.

Algumas limitações incluem:

- necessidade de testes com usuários reais;
- necessidade de validação em ambiente operacional real;
- possibilidade de aprimoramento da responsividade mobile;
- necessidade de regras mais avançadas para cálculo de indicadores;
- ausência de integração com sensores IoT nesta versão;
- ausência de notificações automáticas em tempo real;
- relatórios ainda passíveis de expansão;
- controle de permissões ainda pode ser aprimorado;
- necessidade de auditoria mais detalhada das ações do usuário;
- necessidade de tratamento mais robusto para anexos, fotos e documentos.

---

## 33. Implementações Futuras

Como possibilidades de evolução do FIXER, destacam-se:

- integração com sensores IoT;
- alertas automáticos de manutenção preventiva;
- notificações em tempo real;
- geração de relatórios em PDF;
- exportação de indicadores;
- controle de estoque de peças;
- calendário de manutenção preventiva;
- cálculo automático de MTBF e MTTR;
- gráficos avançados de desempenho;
- versão mobile;
- testes de usabilidade;
- auditoria de ações por usuário;
- permissões mais detalhadas por perfil;
- integração com sistemas externos;
- monitoramento preditivo com dados de sensores;
- criação de anexos para ordens de manutenção;
- assinatura ou validação digital do encerramento;
- deploy futuro em plataforma de hospedagem como Vercel;
- implantação em ambiente de produção.

---

## 34. Controle de Versão

O projeto utiliza Git e GitHub para versionamento.

Fluxo utilizado:

```text
main
│
└── melhorias-interface
    └── Pull Request
        └── merge na main
```

Boas práticas adotadas:

- não realizar alterações diretamente na `main`;
- criar branches para melhorias;
- realizar commits descritivos;
- abrir Pull Requests;
- revisar alterações antes do merge;
- manter histórico de evolução do projeto.

---

## 35. Como Contribuir

Para contribuir com o projeto:

1. Crie uma branch a partir da `main`:

```bash
git checkout -b nome-da-sua-branch
```

2. Faça as alterações necessárias.

3. Adicione os arquivos:

```bash
git add .
```

4. Faça o commit:

```bash
git commit -m "Descrição da alteração"
```

5. Envie para o GitHub:

```bash
git push origin nome-da-sua-branch
```

6. Abra um Pull Request para a branch `main`.

---

## 36. Contribuição Acadêmica

A principal contribuição deste projeto consiste na aplicação prática de conceitos de **Projeto e Desenvolvimento de Software** e **Banco de Dados** no desenvolvimento de uma plataforma web funcional para gestão de manutenção.

O projeto demonstra como requisitos, personas, arquitetura da informação, banco de dados, componentização, autenticação, versionamento e documentação podem ser articulados para criar uma solução tecnológica com potencial de uso real.

Além disso, o FIXER evidencia a importância da organização da informação e da rastreabilidade em sistemas de manutenção, contribuindo para uma visão mais estruturada da gestão de ativos.

---

## 37. Licença

Este projeto possui finalidade acadêmica e foi desenvolvido no contexto das disciplinas de **Projeto e Desenvolvimento de Software** e **Banco de Dados**, do curso de **Engenharia da Computação** da **Universidade Federal do Maranhão (UFMA)**.

O código-fonte, a documentação, as telas e os materiais disponibilizados neste repositório destinam-se a fins educacionais, de estudo, pesquisa e apresentação acadêmica.

---

## 38. Contato

Para dúvidas, sugestões ou informações relacionadas ao projeto:

<p>
<strong>Renata Costa Rocha</strong><br>
📧 renata.rocha@discente.ufma.br<br>
Universidade Federal do Maranhão (UFMA)<br>
Curso de Engenharia da Computação
</p>

<p>
<strong>Raphael Câmara Sá</strong><br>
📧 raphael.sa@discente.ufma.br<br>
Universidade Federal do Maranhão (UFMA)<br>
Curso de Engenharia da Computação
</p>

<p>
<strong>Luis Eduardo Baima do Lago Melonio Junior</strong><br>
📧 leblmjunior@hotmail.com<br>
Universidade Federal do Maranhão (UFMA)<br>
Curso de Engenharia da Computação
</p>

---

