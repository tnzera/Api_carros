Uma API RESTful robusta desenvolvida em **NestJS** e **TypeORM**, estruturada sob os princípios de **Clean Architecture** (Arquitetura Limpa) e conceitos de **Domain-Driven Design (DDD)**. O projeto foi concebido para gerenciar de forma eficiente o fluxo de locação de veículos, dividindo-se em três pilares fundamentais: Carros, Clientes e Reservas.

## 🏛️ Arquitetura do Projeto

A solução adota uma separação rígida de responsabilidades em camadas isoladas, garantindo alta testabilidade, independência de frameworks no núcleo de negócios e facilidade de manutenção.

```text
src/
└── [modulo]/
    ├── domain/         # Núcleo de negócio: Entidades puras e interfaces de repositórios
    ├── application/    # Casos de uso: Serviços, DTOs de entrada e regras de aplicação
    ├── infrastructure/ # Detalhes técnicos: Entidades TypeORM e repositórios concretos
    └── presentation/   # Camada de entrada: Controllers HTTP e mapeamento de rotas
```

### Detalhamento das Camadas:
* **Domain (Domínio):** Contém as entidades de negócio puras da aplicação e as interfaces (`abstract classes`) dos repositórios. Não possui dependências de frameworks externos ou ORMs.
* **Application (Aplicação):** Orquestra o fluxo de dados, contém os serviços (`Services`) e define os objetos de transferência de dados (DTOs) com suas respectivas regras de validação.
* **Infrastructure (Infraestrutura):** Implementa o mapeamento de dados com o banco de dados através do TypeORM (Mapeamento de tabelas, relacionamentos e persistência real).
* **Presentation (Apresentação):** Expõe os endpoints HTTP utilizando os controladores do NestJS, gerenciando os códigos de status e payloads de resposta.

---

## 🚀 Funcionalidades e Módulos

### 1. Módulo de Carros
Responsável pela gestão da frota de veículos disponíveis para locação.
* **Campos:** Marca, Modelo, Placa e Valor da Diária.
* **Regras de Negócio e Validações:**
    * Bloqueio de cadastro de veículos com a mesma placa (Conflito de dados).
    * Validação obrigatória de preenchimento para marca, modelo e placa.
    * Garantia de que o valor da diária seja sempre um número positivo.

### 2. Módulo de Clientes
Gerencia o cadastro de usuários habilitados a realizar locações.
* **Campos:** Nome, CPF, CNH, E-mail e Telefone.
* **Regras de Negócio e Validações:**
    * Impedimento de CPFs duplicados na base de dados.
    * Validação estrita de formato de e-mail.
    * Validação simplificada para CPF, CNH e Telefone, aceitando strings compostas estritamente por caracteres numéricos (facilitando integrações e testes).

### 3. Módulo de Reservas
O motor de regras de negócio do sistema, onde ocorrem os relacionamentos relacionais.
* **Campos:** Carro vinculado, Cliente vinculado, Data/Hora de Início, Data/Hora de Fim e Data de Devolução (opcional).
* **Regras de Negócio e Validações:**
    * **Consistência Relacional:** Valida se o carro e o cliente de fato existem nas respectivas bases antes de efetivar o agendamento.
    * **Validação Temporal:** A data de início da locação deve ser obrigatoriamente anterior à data de término.
    * **Bloqueio de Conflitos:** O sistema verifica a grade de horários do veículo e impede o agendamento caso o carro já possua uma locação ativa no período selecionado.
    * **Status Dinâmico (`estaAtrasado`):** A entidade de domínio calcula em tempo real se o prazo de entrega foi ultrapassado sem a necessidade de persistir flags booleanas estáticas no banco de dados, evitando processamento assíncrono desnecessário.

---

## 🛠️ Tecnologias Utilizadas

* **Runtime:** [Node.js](https://nodejs.org/) (v18+)
* **Framework:** [NestJS](https://nestjs.com/)
* **ORM:** [TypeORM](https://typeorm.io/)
* **Banco de Dados:** PostgreSQL / MySQL (Configurável via TypeORM)
* **Validação:** `class-validator` & `class-transformer`

---

## 📦 Instalação e Execução

1. Clone o repositório para o seu ambiente local:
   ```bash
   git clone <url-do-repositorio>
   cd api_cars
   ```

2. Instale as dependências do projeto:
   ```bash
   npm install
   ```

3. Certifique-se de configurar as credenciais do seu banco de dados no arquivo `src/app.module.ts` (ou utilize variáveis de ambiente `.env` apropriadas).

4. Execute a aplicação em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```
   A API estará disponível por padrão em: `http://localhost:3000`.

---

## 🛡️ Defesa de Dados Globais

A API utiliza uma estratégia de validação global na raiz do projeto (`src/main.ts`) através do `ValidationPipe`. Isso garante que:
* Propriedades não mapeadas nos DTOs sejam automaticamente filtradas e descartadas (`whitelist: true`).
* Requisições contendo propriedades maliciosas ou desconhecidas sejam rejeitadas imediatamente (`forbidNonWhitelisted: true`).
* Os payloads de entrada sejam automaticamente tipados e convertidos para as instâncias corretas das classes de transferência (`transform: true`).