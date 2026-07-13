# 🚗 Locadora de Carros — Sistema Fullstack

Sistema de gerenciamento de locadora de veículos composto por uma **API RESTful** em **NestJS + TypeORM (PostgreSQL)** e um **painel administrativo SPA** em **React + TypeScript (Vite)**.

O backend é estruturado sob os princípios de **Clean Architecture** e conceitos de **Domain-Driven Design (DDD)**, dividido em três pilares de negócio: Carros, Clientes e Reservas, protegidos por autenticação **JWT** com controle de acesso por papéis (**RBAC**).

---

## 🏛️ Arquitetura do Backend

A solução adota uma separação rígida de responsabilidades em camadas isoladas, garantindo alta testabilidade, independência de frameworks no núcleo de negócios e facilidade de manutenção.

```text
src/
├── common/             # Recursos compartilhados (DTOs de paginação)
├── auth/               # Autenticação JWT (login, estratégia Passport)
└── [modulo]/           # carros | clientes | reservas
    ├── domain/         # Núcleo de negócio: Entidades puras e interfaces de repositórios
    ├── application/    # Casos de uso: Serviços, DTOs de entrada e regras de aplicação
    ├── infrastructure/ # Detalhes técnicos: Entidades TypeORM e repositórios concretos
    └── presentation/   # Camada de entrada: Controllers HTTP e mapeamento de rotas
```

### Detalhamento das Camadas
* **Domain (Domínio):** Entidades de negócio puras e interfaces (`abstract classes`) dos repositórios. Sem dependências de frameworks ou ORMs.
* **Application (Aplicação):** Orquestra o fluxo de dados, contém os serviços (`Services`) e define os DTOs com suas regras de validação.
* **Infrastructure (Infraestrutura):** Implementa a persistência com TypeORM (mapeamento de tabelas, relacionamentos e repositórios concretos).
* **Presentation (Apresentação):** Expõe os endpoints HTTP via controllers do NestJS, gerenciando códigos de status e payloads de resposta.

## 🖥️ Arquitetura do Frontend

SPA minimalista em React 19 + TypeScript, sem bibliotecas de estado ou estilização externas (CSS puro com design tokens).

```text
frontend/src/
├── api/           # Cliente HTTP central (injeção do JWT, tratamento de erros) e tipos
├── auth/          # Contexto de autenticação (sessão via localStorage)
├── components/    # Layout (sidebar), Modal, Pagination
└── pages/         # Login, Dashboard, Carros, Clientes, Reservas (CRUD completo)
```

---

## 🔐 Autenticação e Controle de Acesso (RBAC)

* Login via `POST /auth/login` (e-mail + senha) retorna um **token JWT** (expiração configurável).
* Senhas armazenadas com hash **bcrypt**; o campo nunca é exposto nas respostas (`@Exclude` + `ClassSerializerInterceptor` global).
* O sistema é um **painel administrativo**: apenas usuários com `role = 'admin'` conseguem logar. Clientes comuns (`role = 'cliente'`) são apenas registros gerenciados.
* Como somente admins obtêm tokens, todo acesso autenticado é, por definição, administrativo — novos admins são criados/promovidos pelo próprio painel.
* Todos os endpoints exigem JWT (guard do Passport), exceto o login.

## ⚡ Estratégia de Performance: Paginação (via ORM)

Todas as listagens são paginadas no banco de dados com `findAndCount` + `skip`/`take` do TypeORM (SQL `LIMIT`/`OFFSET`), com ordenação estável por `id`:

```
GET /carros?page=2&limit=10
```
```json
{ "data": [...], "total": 42, "page": 2, "limit": 10, "lastPage": 5 }
```

* `page` ≥ 1 e `limit` entre 1 e 100 (validados via DTO; valores fora da faixa retornam 400).
* Evita trafegar a tabela inteira por requisição — o ganho cresce com o volume de dados.
* O frontend consome `total`/`lastPage` para montar os controles de navegação.

---

## 🚀 Funcionalidades e Módulos

### 1. Módulo de Carros
Gestão da frota de veículos disponíveis para locação.
* **Campos:** Marca, Modelo, Placa e Valor da Diária.
* **Regras de Negócio:**
    * Bloqueio de cadastro de veículos com a mesma placa (`409 Conflict`).
    * Validação obrigatória de marca, modelo e placa; diária sempre positiva.

### 2. Módulo de Clientes
Cadastro de clientes e usuários administrativos do sistema.
* **Campos:** Nome, CPF, CNH, E-mail, Telefone, Senha e Papel (`cliente` | `admin`).
* **Regras de Negócio:**
    * CPF e e-mail únicos na base (`409 Conflict`).
    * CPF e CNH com exatamente 11 dígitos numéricos; e-mail com formato válido.
    * Senha com mínimo de 6 caracteres, armazenada com bcrypt.
    * O papel aceita apenas os valores `cliente` ou `admin` (`@IsIn`).

### 3. Módulo de Reservas
O motor de regras de negócio do sistema, relacionando carros e clientes.
* **Campos:** Carro vinculado, Cliente vinculado, Data/Hora de Início e Data/Hora de Fim.
* **Regras de Negócio:**
    * **Consistência relacional:** valida a existência do carro e do cliente antes de agendar.
    * **Validação temporal:** a data de início deve ser anterior à data de fim.
    * **Bloqueio de conflitos:** impede reservar um carro que já possui locação com período sobreposto (`409 Conflict`).

---

## 📋 Endpoints da API

| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| POST | `/auth/login` | — | Login (somente admins) |
| GET | `/carros?page=&limit=` | 🔒 | Lista paginada de carros |
| POST | `/carros` | 🔒 | Cadastra carro |
| GET/PATCH/DELETE | `/carros/:id` | 🔒 | Busca, atualiza ou remove |
| GET | `/clientes?page=&limit=` | 🔒 | Lista paginada de clientes |
| POST | `/clientes` | 🔒 | Cadastra cliente (aceita `role`) |
| GET/PATCH/DELETE | `/clientes/:id` | 🔒 | Busca, atualiza ou remove |
| GET | `/reservas?page=&limit=` | 🔒 | Lista paginada de reservas |
| POST | `/reservas` | 🔒 | Cria reserva |
| GET/PATCH/DELETE | `/reservas/:id` | 🔒 | Busca, atualiza ou remove |

Rotas autenticadas exigem o header `Authorization: Bearer <token>`.
Uma coleção do Insomnia está disponível em [`insomnia_collection.json`](insomnia_collection.json).

---

## 🛠️ Tecnologias Utilizadas

| Backend | Frontend |
|---|---|
| Node.js (v18+) / NestJS | React 19 + TypeScript |
| TypeORM + PostgreSQL | Vite |
| Passport + JWT + bcrypt | React Router |
| class-validator / class-transformer | CSS puro (design tokens) |

---

## 📦 Instalação e Execução

### Pré-requisitos
* Node.js v18+ e PostgreSQL rodando localmente com um banco criado (ex.: `locacao_carros`).

### 1. Backend (API)

```bash
npm install
```

Crie um arquivo `.env` na raiz (veja `.env.example`):

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=locacao_carros
JWT_SECRET=uma-chave-aleatoria-longa-e-secreta
JWT_EXPIRES_IN=1d
```

```bash
npm run start:dev
# API disponível em http://localhost:3000
```

> As tabelas são criadas automaticamente na primeira execução (`synchronize: true` — apenas para desenvolvimento).

### 2. Primeiro administrador (automático)

Como todos os endpoints exigem login e apenas admins logam, um banco recém-criado ficaria inacessível (problema clássico do "primeiro usuário"). Para resolver isso, **a aplicação faz um seed automático na inicialização**: se nenhum admin existir, um padrão é criado:

```
email: admin@locadora.com
senha: admin123
```

As credenciais são configuráveis via `ADMIN_EMAIL` / `ADMIN_PASSWORD` no `.env`. **Troque a senha após o primeiro login.** A partir daí, novos admins são criados pelo próprio painel (campo **Tipo** no formulário de clientes).

### 3. Frontend (Painel)

```bash
cd frontend
npm install
npm run dev
# Painel disponível em http://localhost:5173
```

A URL da API é configurável em `frontend/.env` (`VITE_API_URL`, padrão `http://localhost:3000`).

---

## 🛡️ Defesa de Dados Globais

A API aplica proteções globais em `src/main.ts`:

* **`ValidationPipe`** — propriedades fora dos DTOs são rejeitadas (`whitelist` + `forbidNonWhitelisted`) e os payloads são convertidos para as classes corretas (`transform`).
* **`ClassSerializerInterceptor`** — campos sensíveis marcados com `@Exclude` (como a senha) são removidos de todas as respostas, inclusive em objetos aninhados.
* **CORS restrito** — apenas origens locais de desenvolvimento e a URL definida em `FRONTEND_URL` são autorizadas.
