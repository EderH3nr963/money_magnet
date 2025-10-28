# MoneyMagnet

Aplicação web de gestão financeira para ME(Micro-Empreendedores) construída com React + Vite + TypeScript, autenticação via Supabase e UI com Tailwind CSS. Permite gerenciar transações, importar planilhas, visualizar métricas e editar informações de perfil com uma experiência moderna e responsiva.

## Visão Geral
- Gestão de transações com listagem, edição e exclusão (com confirmação).
- Importação de planilhas `.xlsx/.xls` com validação de colunas e pré-visualização em tabela.
- Dashboard com métricas atuais, distribuição de receitas e série mensal (serviço de analytics).
- Autenticação e gerenciamento de conta (login, registro, esqueci a senha, atualização de senha).
- Edição de perfil (e‑mail e nome de usuário) com validação e feedback.

## Tecnologias
- Frontend: `React`, `Vite`, `TypeScript`
- Estilo: `Tailwind CSS`
- Backend‑as‑a‑Service: `Supabase` (auth e dados)
- Utilitários: `xlsx` para leitura de planilhas

## Pré‑requisitos
- `Node.js` 18+ e `Yarn` (ou `npm`)
- Projeto no Supabase com autenticação habilitada
- Variáveis de ambiente configuradas em `.env`

## Configuração do Ambiente
Crie um arquivo `.env` na raiz com:

```
VITE_SUPABASE_URL=<sua_url_do_supabase>
VITE_SUPABASE_ANON_KEY=<sua_chave_anon_do_supabase>
```

Confirme o uso dessas variáveis em `src/api/supabaseClient.ts`.

## Instalação e Execução
- Instalar dependências: `yarn`
- Ambiente de desenvolvimento: `yarn dev` (acessar `http://localhost:5173/`)
- Build de produção: `yarn build`
- Preview do build: `yarn preview`

## Estrutura do Projeto (principais pastas)
```
src/
  App.tsx                 # Rotas públicas e protegidas
  api/supabaseClient.ts   # Cliente Supabase
  components/             # Componentes reutilizáveis (NavBar, Footer, etc.)
  context/AuthContext.tsx # Contexto de autenticação
  pages/                  # Páginas da aplicação
  services/               # Serviços (auth, transações, usuários, analytics)
  types/transactions.ts   # Tipos fortes para transações
  data/transactions.ts    # Dados de exemplo (opcional para testes)
```

## Rotas Principais
- `/login` e `/register` — autenticação
- `/forgot-password` — pública, envia e‑mail de reset de senha
- `/settings` — configurações do usuário
- `/edit-profile` — protegida, edição de e‑mail e nome de usuário
- `/transactions` — listagem de transações
- `/transactions/:id/edit` — edição de transação por ID
- `/import-csv` — importação de planilha com validação e pré‑visualização

## Importação de Planilha (`ImportCSV`)
Formatos suportados: `.xlsx` e `.xls`. A planilha deve conter exatamente estas colunas:

- `id` — número único (ex.: `1`)
- `description` — texto (ex.: `Compra de mercado`)
- `amount` — número (ex.: `150.30`, `-80.00`)
- `date` — data no formato `YYYY-MM-DD` (ex.: `2025-01-20`)
- `category` — texto (ex.: `Alimentação`)
- `status` — texto (ex.: `Pago` ou `Pendente`)

Exemplo de conteúdo (CSV equivalente):

```
id,description,amount,date,category,status
1,Supermercado,-150.30,2025-01-20,Alimentação,Pago
2,Salário,3000.00,2025-01-15,Renda,Pago
3,Combustível,-80.00,2025-01-18,Transporte,Pendente
```

Ao importar, a página valida colunas obrigatórias, verifica dados incompletos e mostra uma tabela com indicadores visuais antes de confirmar a importação.

## Serviços e Tipos
- `src/services/transactionService.ts` — operações com transações (listar, buscar por ID, etc.)
- `src/services/userServices.ts` — atualização de e‑mail e username do usuário
- `src/services/analytics.ts` — cálculos de métricas atuais, distribuição e série mensal
- `src/types/transactions.ts` — interface `Transaction` e tipos relacionados

## Páginas de Edição
- `src/pages/EditPerfil.tsx` — formulário com campos de e‑mail e username, validação e feedback.
- `src/pages/EditTransaction.tsx` — carrega a transação por ID e exibe/edita seus dados com UX semelhante ao `EditPerfil`.

## Desenvolvimento
- Recomenda‑se manter a lógica de cálculo em `src/services/analytics.ts` e reutilizar nas páginas.
- Tipos em `src/types/transactions.ts` ajudam a prevenir erros de integração.
- Proteger rotas com `AuthContext` e verificar `user` antes de acessar páginas sensíveis.

## Dicas e Erros Comuns
- Sem `.env`: verifique `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- Colunas inválidas na importação: confirme nomes exatos e o formato `date`.
- `amount` como texto: converta para número antes de enviar ao backend.
- Rota não encontrada: confirme a adição em `src/App.tsx`.

## Próximos Passos (Opcional)
- Upload de avatar no perfil e atualização no Supabase.
- Validação de disponibilidade de username.
- Importação direta para o Supabase com mapeamento de categorias.
- Filtros, paginação e ordenação avançada em `Transactions`.
- Testes unitários para `analytics.ts` e serviços críticos.

---
Se precisar, posso ajustar o README para refletir mudanças futuras (novas rotas, serviços ou integrações).

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
