````markdown
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
  <strong>Luis Eduardo Baima do Lago Melonio Junior</strong><br>
</p>

<hr>

<p align="center">
  <em>
    Este repositório apresenta o desenvolvimento do <strong>FIXER,</strong> uma plataforma voltada à 
    <strong>gestão de manutenção de ativos</strong>, idealizada no contexto acadêmico das disciplinas de 
    <strong>Projeto e Desenvolvimento de Software</strong> e <strong>Banco de Dados</strong>, do curso de 
    Engenharia da Computação da Universidade Federal do Maranhão.
    <br><br>
    A proposta do projeto consiste em oferecer uma solução centralizada para o gerenciamento do ciclo de vida 
    de ativos físicos, com ênfase em estratégias de <strong>manutenção preventiva, corretiva e preditiva,</strong>
    contribuindo para a redução de falhas operacionais, otimização de custos, melhoria da confiabilidade dos ativos 
    e apoio à tomada de decisão.
    <br><br>
    O desenvolvimento do sistema contempla aspectos de modelagem, organização funcional, prototipação, autenticação, 
    construção de interface web, integração com banco de dados e documentação, representando uma aplicação prática 
    dos conhecimentos adquiridos ao longo das disciplinas.
  </em>
</p>

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Em_Desenvolvimento-blue?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/Projeto-Acadêmico-green?style=flat-square" alt="Projeto Acadêmico">
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Git-Version_Control-orange?style=flat-square" alt="Git">
  <img src="https://img.shields.io/badge/GitHub-Repositório-black?style=flat-square&logo=github" alt="GitHub">
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
  <h3 align="center">Plataforma de Gestão e Confiabilidade de Ativos</h3>
</p>

---

## 1. Descrição do Projeto

O **FIXER** é uma plataforma web desenvolvida para apoiar a **gestão de manutenção de ativos**, reunindo em um único sistema informações relevantes para acompanhamento, controle, planejamento e análise das atividades de manutenção.

A proposta busca substituir abordagens predominantemente reativas por uma gestão mais estruturada, baseada em organização de dados, monitoramento de indicadores, registro de informações e acompanhamento do desempenho dos ativos.

A aplicação foi desenvolvida com uma interface moderna e responsiva, permitindo que o usuário acesse funcionalidades relacionadas à autenticação, visualização de indicadores, acompanhamento de manutenções e organização de informações essenciais para a gestão dos ativos.

---

## 2. Objetivo

O principal objetivo deste projeto é desenvolver uma solução digital para gestão integrada de ativos, permitindo maior controle sobre os processos de manutenção e fornecendo informações que auxiliem a tomada de decisão.

Entre os objetivos específicos, destacam-se:

- Desenvolver uma aplicação web para gestão de ativos;
- Permitir o acompanhamento de manutenções preventivas, corretivas e preditivas;
- Organizar informações históricas sobre intervenções realizadas;
- Disponibilizar indicadores de desempenho relacionados à manutenção;
- Reduzir falhas inesperadas e custos operacionais;
- Melhorar a confiabilidade e disponibilidade dos ativos;
- Aplicar conceitos de desenvolvimento de software e banco de dados em um projeto prático.

---

## 3. Problema Abordado

Em muitos contextos organizacionais, a manutenção ainda ocorre de maneira predominantemente reativa. Ou seja, os equipamentos são corrigidos apenas após a ocorrência de falhas, o que pode ocasionar diversos prejuízos operacionais.

Entre os principais problemas observados, destacam-se:

- Falhas inesperadas em equipamentos;
- Interrupções da operação e perda de produtividade;
- Custos elevados com intervenções emergenciais;
- Ausência de histórico estruturado de manutenção;
- Dificuldade no planejamento de revisões, inspeções e substituições de componentes;
- Baixa previsibilidade sobre o desempenho dos ativos;
- Dificuldade para acompanhamento de indicadores gerenciais.

Diante desse cenário, o **FIXER** surge como uma proposta de solução para ampliar o controle, a confiabilidade e a eficiência na gestão de ativos e manutenções.

---

## 4. Funcionalidades Principais

Entre as principais funcionalidades implementadas ou previstas para o sistema, destacam-se:

- Login de usuários;
- Cadastro de novos usuários;
- Recuperação de senha;
- Controle de sessão do usuário autenticado;
- Dashboard principal;
- Exibição de indicadores de manutenção;
- Visualização de dados de MTBF;
- Visualização de dados de MTTR;
- Exibição da disponibilidade dos ativos;
- Acompanhamento de ativos por status;
- Listagem de manutenções recentes;
- Cronograma visual de manutenções;
- Interface lateral de navegação;
- Identificação do usuário logado;
- Estrutura para futura gestão completa de ativos e ordens de manutenção.

---

## 5. Indicadores de Manutenção

O sistema contempla indicadores importantes para análise da confiabilidade e desempenho dos ativos.

### 5.1. MTBF — Mean Time Between Failures

O **MTBF** representa o tempo médio entre falhas de um ativo. Esse indicador permite avaliar a confiabilidade de equipamentos e sistemas.

Quanto maior o MTBF, maior tende a ser o tempo de funcionamento do ativo antes da ocorrência de uma nova falha.

### 5.2. MTTR — Mean Time To Repair

O **MTTR** representa o tempo médio necessário para reparar um ativo após a ocorrência de uma falha.

Quanto menor o MTTR, mais eficiente tende a ser o processo de manutenção e menor o tempo de indisponibilidade do equipamento.

### 5.3. Disponibilidade

A **disponibilidade** indica o percentual de tempo em que o ativo permanece disponível para uso.

Esse indicador auxilia na análise da eficiência operacional dos equipamentos e no acompanhamento da capacidade da organização em manter seus ativos funcionando.

---

## 6. Público-Alvo

O sistema é direcionado principalmente para:

- Indústrias e empresas com ativos físicos;
- Gestores de manutenção;
- Engenheiros e equipes técnicas;
- Empresas de facilities e serviços técnicos;
- Operações logísticas e de transporte;
- Organizações que necessitam controlar equipamentos, máquinas e estruturas operacionais.

---

## 7. Tecnologias Utilizadas

O projeto foi desenvolvido utilizando tecnologias voltadas ao desenvolvimento web moderno, com foco em interface, autenticação, integração com banco de dados e organização do código.

As principais tecnologias utilizadas são:

- **React** — biblioteca JavaScript utilizada para construção da interface da aplicação;
- **Vite** — ferramenta utilizada para criação, desenvolvimento e build do projeto frontend;
- **JavaScript** — linguagem principal utilizada no desenvolvimento da aplicação;
- **Tailwind CSS** — framework CSS utilizado para estilização da interface;
- **Supabase** — plataforma utilizada para autenticação de usuários e integração com banco de dados;
- **Axios** — biblioteca utilizada para realização de requisições HTTP;
- **ESLint** — ferramenta utilizada para análise e padronização do código;
- **Git** — sistema de controle de versão;
- **GitHub** — plataforma utilizada para hospedagem e versionamento do repositório.

---

## 8. Organização do Projeto

A estrutura principal do repositório está organizada da seguinte forma:

```bash
fixer/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   └── supabaseClient.js
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── postcss.config.js
│   └── tailwind.config.js
├── imagens/
├── README.md
├── diagrama de estado.png
├── Diagrama_de_Classes_com_Mtodos_-_Fixer (1).png
└── Parte 1_RenataCosta_RaphaelSá_LuisEduardo.pdf
````

Essa organização visa favorecer a clareza, manutenção e continuidade do projeto, separando os arquivos de código-fonte, imagens, documentação e materiais de modelagem.

---

## 9. Como Clonar o Repositório

Para obter uma cópia local do projeto, execute o comando abaixo:

```bash
git clone https://github.com/ahcorataner/fixer.git
```

Em seguida, acesse a pasta do projeto:

```bash
cd fixer
```

---

## 10. Como Executar o Projeto

Para executar a aplicação localmente, é necessário ter o **Node.js** instalado no computador.

### 10.1. Acessar a pasta do frontend

```bash
cd frontend
```

### 10.2. Instalar as dependências

```bash
npm install
```

### 10.3. Executar o projeto em modo de desenvolvimento

```bash
npm run dev
```

Após executar o comando, o Vite exibirá no terminal o endereço local da aplicação, geralmente:

```bash
http://localhost:5173/
```

Basta copiar esse endereço e abrir no navegador.

---

## 11. Scripts Disponíveis

Dentro da pasta `frontend`, estão disponíveis os seguintes comandos:

### Executar em ambiente de desenvolvimento

```bash
npm run dev
```

Inicializa o servidor de desenvolvimento da aplicação.

### Gerar versão de produção

```bash
npm run build
```

Gera os arquivos otimizados para produção.

### Visualizar a versão de produção

```bash
npm run preview
```

Permite visualizar localmente a versão de produção gerada.

### Verificar padronização do código

```bash
npm run lint
```

Executa a análise do código utilizando o ESLint.

---

## 12. Autenticação

O sistema utiliza o **Supabase** para autenticação de usuários.

As funcionalidades de autenticação incluem:

* Login com e-mail e senha;
* Cadastro de novos usuários;
* Recuperação de senha por e-mail;
* Controle de sessão do usuário autenticado;
* Identificação do usuário no sistema;
* Integração com dados complementares de perfil.

---

## 13. Telas do Sistema

O sistema conta com telas voltadas para acesso, cadastro e visualização das principais informações da plataforma.

### 13.1. Tela de Login

Tela inicial da aplicação, na qual o usuário informa suas credenciais de acesso para entrar no sistema.

### 13.2. Tela de Cadastro

Tela destinada à criação de uma nova conta de usuário, com campos relacionados às informações pessoais e credenciais de acesso.

### 13.3. Tela de Recuperação de Senha

Tela que permite ao usuário solicitar instruções para redefinição de senha por meio do e-mail cadastrado.

### 13.4. Dashboard

Tela principal exibida após o login, contendo indicadores, informações sobre ativos, manutenções recentes, disponibilidade dos equipamentos e cronograma de manutenção.

---

## 14. Protótipos, Imagens e Modelagem

As imagens, protótipos e materiais visuais do projeto estão armazenados na pasta:

```bash
imagens/
```

O repositório também contém documentos relacionados à modelagem do sistema, incluindo:

* Diagrama de classes;
* Diagrama de estado;
* Documentação acadêmica do projeto;
* Imagens de apoio;
* Materiais visuais da plataforma.

Exemplo de uso de imagem no README:

<p align="center">
  <img src="imagens/exemplo.png" alt="Protótipo do sistema FIXER" width="750">
</p>

Esses arquivos auxiliam na compreensão da estrutura, comportamento e proposta geral da aplicação.

---

## 15. Status do Projeto

O projeto encontra-se em desenvolvimento acadêmico.

As funcionalidades implementadas até o momento concentram-se principalmente na estrutura do frontend, autenticação de usuários e dashboard inicial.

Novas funcionalidades poderão ser acrescentadas conforme a evolução do projeto e o aprofundamento da integração com banco de dados.

---

## 16. Possíveis Melhorias Futuras

Entre as melhorias que podem ser implementadas em versões futuras, destacam-se:

* Cadastro completo de ativos;
* Cadastro e controle de ordens de manutenção;
* Histórico detalhado de intervenções;
* Filtros por tipo de ativo, status e período;
* Relatórios gerenciais;
* Controle de permissões por tipo de usuário;
* Notificações de manutenções programadas;
* Gráficos dinâmicos de indicadores;
* Painel administrativo para gestores;
* Integração mais ampla com banco de dados;
* Geração de relatórios em PDF;
* Controle de peças, setores e responsáveis técnicos.

---

## 17. Considerações Finais

O desenvolvimento do **FIXER** representa uma aplicação prática de conceitos de análise, modelagem, banco de dados e desenvolvimento de software voltados à solução de problemas reais no contexto da manutenção de ativos.

Além do caráter acadêmico, o projeto possui potencial de aplicabilidade em ambientes organizacionais que demandam maior controle, rastreabilidade, confiabilidade e eficiência operacional.

---

## 18. Licença

Este projeto possui finalidade **acadêmica**, sendo desenvolvido no contexto das disciplinas de **Projeto e Desenvolvimento de Software** e **Banco de Dados** do curso de Engenharia da Computação da Universidade Federal do Maranhão.

---

## 19. Contato

Para dúvidas, sugestões ou informações relacionadas ao projeto:

* **Renata Costa Rocha**
  📧 [renata.rocha@discente.ufma.br](mailto:renata.rocha@discente.ufma.br)

* **Raphael Câmara Sá**
  📧 [raphael.sa@discente.ufma.br](mailto:raphael.sa@discente.ufma.br)

* **Luis Eduardo Baima do Lago Melonio Junior**
  📧 [leblmjunior@hotmail.com](mailto:leblmjunior@hotmail.com)

```
```
