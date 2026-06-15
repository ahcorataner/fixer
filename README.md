<p align="center">
  <img src="imagens/ufma.png" alt="UFMA" width="180">
</p>

<p align="center">
  <strong>Universidade Federal do Maranhão</strong><br>
  <strong>Centro de Ciências Exatas e Tecnologias</strong><br>
  <strong>Curso de Engenharia da Computação</strong><br>
  <strong>Disciplinas: Projeto e Desenvolvimento de Software | Banco de Dados</strong><br><br>

  <strong>Discentes:</strong><br>
  <strong>Renata Costa Rocha</strong><br>
  <strong>Raphael Câmara Sá</strong><br>
  <strong>Luis Eduardo Baima do Lago Melonio Junior</strong>
</p>

<hr>

<p align="center">
  <em>
    Este repositório apresenta o desenvolvimento do <strong>FIXER</strong>, uma plataforma voltada à
    <strong>gestão de manutenção de ativos</strong>, idealizada no contexto acadêmico das disciplinas de
    <strong>Projeto e Desenvolvimento de Software</strong> e <strong>Banco de Dados</strong>, do curso de
    Engenharia da Computação da Universidade Federal do Maranhão.
    <br><br>
    A proposta do projeto consiste em oferecer uma solução centralizada para o gerenciamento do ciclo de vida
    de ativos físicos, com ênfase em estratégias de <strong>manutenção corretiva, preventiva e preditiva</strong>,
    contribuindo para a redução de falhas operacionais, otimização de custos e melhoria da confiabilidade dos ativos.
    <br><br>
    O desenvolvimento do sistema contempla aspectos de modelagem, banco de dados, arquitetura de software,
    prototipação, desenvolvimento web e documentação técnica, representando uma aplicação prática dos conhecimentos
    adquiridos ao longo da graduação.
  </em>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-blue?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Projeto-Acadêmico-green?style=flat-square" alt="Projeto Acadêmico">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square" alt="React">
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=flat-square" alt="Node.js">
  <img src="https://img.shields.io/badge/Banco-PostgreSQL-blue?style=flat-square" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/GitHub-Repositório-black?style=flat-square" alt="GitHub">
</p>

---

<p align="center">
  <table align="center">
    <tr>
      <td style="border: 4px solid #0a1f44; padding: 12px;">
        <img src="imagens/fixer.png" alt="FIXER" width="450">
      </td>
    </tr>
  </table>
</p>

<p align="center">
  <h3 align="center">Sistema de Gestão e Confiabilidade de Ativos</h3>
  <p align="center">
    <em>Sistema Integrado de Gestão de Ativos e Manutenção.</em>
  </p>
</p>

---

# 1. Descrição do Projeto

O **FIXER** é uma plataforma desenvolvida para apoiar a **gestão de manutenção de ativos**, reunindo em um único sistema informações relevantes para acompanhamento, controle e planejamento das atividades de manutenção.

A proposta busca substituir abordagens reativas por uma gestão mais estruturada, baseada em monitoramento contínuo, organização do histórico de intervenções e acompanhamento de indicadores de desempenho.

O sistema oferece recursos para gerenciamento de ativos, ordens de manutenção, histórico de intervenções e indicadores de confiabilidade, contribuindo para a melhoria da disponibilidade operacional e da tomada de decisão.

---

# 2. Objetivos

O principal objetivo deste projeto é:

- Desenvolver uma solução para gestão integrada de ativos;
- Permitir o acompanhamento de manutenções corretivas, preventivas e preditivas;
- Organizar informações históricas sobre intervenções realizadas;
- Auxiliar a tomada de decisão por meio de indicadores de desempenho;
- Reduzir falhas inesperadas e custos operacionais;
- Melhorar a disponibilidade e confiabilidade dos ativos.

---

# 3. Problema Abordado

Em muitos contextos organizacionais, a manutenção ainda ocorre de maneira predominantemente reativa, o que ocasiona:

- Falhas inesperadas em equipamentos;
- Interrupções da operação e perda de produtividade;
- Custos elevados com intervenções emergenciais;
- Ausência de histórico estruturado de manutenção;
- Dificuldade no planejamento de revisões, inspeções e substituições de componentes;
- Falta de indicadores confiáveis para tomada de decisão.

Diante desse cenário, o **FIXER** surge como uma proposta de solução para ampliar o controle e a confiabilidade na gestão dos ativos.

---

# 4. Funcionalidades Implementadas

Atualmente o sistema contempla:

## Autenticação

- Login de usuários;
- Cadastro de usuários;
- Recuperação de senha;
- Controle de perfis de acesso.

## Dashboard

### Gestor

- Visualização geral dos indicadores;
- Controle dos ativos cadastrados;
- Monitoramento das ordens de manutenção;
- Acompanhamento dos indicadores de desempenho.

### Técnico

- Painel personalizado;
- Visualização das ordens atribuídas;
- Histórico de atividades;
- Acompanhamento das tarefas em execução.

## Gestão de Ativos

- Cadastro de ativos;
- Consulta de ativos;
- Organização das informações dos equipamentos;
- Controle do status operacional.

## Ordens de Manutenção

- Registro de ordens de manutenção;
- Controle de status;
- Acompanhamento das intervenções;
- Associação de ativos.

## Histórico

- Registro das atividades executadas;
- Consulta histórica das manutenções;
- Rastreabilidade das intervenções realizadas.

---

# 5. Indicadores de Desempenho

O sistema contempla indicadores amplamente utilizados na Engenharia de Manutenção.

## MTBF (Mean Time Between Failures)

Tempo médio entre falhas consecutivas de um ativo.

```text
MTBF = Tempo Total de Operação / Número de Falhas
```

## MTTR (Mean Time To Repair)

Tempo médio necessário para reparar um equipamento.

```text
MTTR = Tempo Total de Reparo / Número de Reparos
```

## Disponibilidade

Percentual de tempo em que o equipamento permanece operacional.

```text
Disponibilidade = MTBF / (MTBF + MTTR)
```

Os indicadores são apresentados no dashboard do sistema e possuem explicação detalhada para auxiliar os usuários na interpretação dos resultados.

---

# 6. Público-Alvo

O sistema é direcionado principalmente para:

- Indústrias e empresas com ativos físicos;
- Gestores de manutenção;
- Engenheiros de manutenção;
- Técnicos de manutenção;
- Empresas de facilities;
- Empresas prestadoras de serviços técnicos;
- Operações logísticas e de transporte.

---

# 7. Tecnologias

O desenvolvimento do **FIXER** utiliza tecnologias modernas para construção de aplicações web.

## Frontend

- React;
- TypeScript;
- Vite;
- React Router;
- Tailwind CSS;
- Lucide React.

## Backend

- Node.js;
- Express.

## Banco de Dados

- PostgreSQL.

## Controle de Versão

- Git;
- GitHub.

## Ferramentas de Desenvolvimento

- Visual Studio Code;
- Figma;
- Draw.io.

---

# 8. Organização do Projeto

```text
fixer/
│
├── backend/
│
├── frontend/
│
├── frontend_v2/
│
├── imagens/
│   ├── fixer.png
│   ├── ufma.png
│   └── diagramas
│
├── README.md
└── .gitignore
```

A estrutura contempla:

- Backend da aplicação;
- Frontend original;
- Nova interface baseada em prototipação Figma;
- Imagens institucionais e diagramas;
- Documentação do projeto.

---

# 9. Como Clonar o Repositório

```bash
git clone https://github.com/ahcorataner/fixer.git
```

Em seguida:

```bash
cd fixer
```

---

# 10. Como Executar o Projeto

## Frontend

Acesse a pasta:

```bash
cd frontend_v2
```

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

---

## Backend

Acesse:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Execute o servidor:

```bash
npm start
```

---

# 11. Protótipos e Imagens

Os materiais gráficos e protótipos utilizados no desenvolvimento encontram-se armazenados na pasta:

```bash
imagens/
```

Entre os materiais disponíveis destacam-se:

- Logo institucional da UFMA;
- Logo do sistema FIXER;
- Diagramas UML;
- Diagramas de Estados;
- Protótipos desenvolvidos no Figma.

Exemplo:

<p align="center">
  <img src="imagens/fixer.png" alt="Logo do Sistema FIXER" width="450">
</p>

---

# 12. Trabalhos Futuros

Entre as evoluções previstas para o projeto destacam-se:

- Integração completa com banco de dados PostgreSQL;
- Dashboard analítico avançado;
- Geração de relatórios;
- Notificações automáticas;
- Controle de manutenção preventiva;
- Integração com sensores IoT;
- Aplicação mobile;
- Exportação de indicadores em PDF.

---

# 13. Considerações Finais

O desenvolvimento do **FIXER** representa uma aplicação prática dos conceitos de Engenharia de Software, Banco de Dados, Desenvolvimento Web e Gestão da Manutenção.

Além do caráter acadêmico, o sistema apresenta potencial de utilização em ambientes industriais e organizacionais que demandam maior controle operacional, rastreabilidade e confiabilidade dos ativos.

O projeto demonstra a aplicação integrada dos conhecimentos adquiridos ao longo do curso de Engenharia da Computação da Universidade Federal do Maranhão.

---

# 14. Licença

Este projeto possui finalidade **acadêmica**, sendo desenvolvido no contexto das disciplinas de **Projeto e Desenvolvimento de Software** e **Banco de Dados** do curso de Engenharia da Computação da UFMA.

---

# 15. Contato

Para dúvidas, sugestões ou informações relacionadas ao projeto:

### Renata Costa Rocha

📧 <renata.rocha@discente.ufma.br>

### Raphael Câmara Sá

📧 <raphael.sa@discente.ufma.br>

### Luis Eduardo Baima do Lago Melonio Junior

📧 <leblmjunior@hotmail.com>

---

<p align="center">
  <strong>FIXER</strong><br>
  Gestão de Manutenção<br><br>
  <em>Sistema Integrado de Gestão de Ativos e Manutenção.</em>
</p>