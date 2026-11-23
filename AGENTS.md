# Level-Up — Regras do Projeto

## Visão Geral & Stack
- **Frontend**: React 19 + Vite 8 + React Router 7 + Formik/Yup + CSS Modules (`src/`).
- **Backend**: Java 21 + Spring Boot 4 + Spring Data JPA + Spring Security (JWT + BCrypt) + PostgreSQL (`backend/`).
- **Portas padrão**: Frontend `http://localhost:5173`, Backend `http://localhost:8080`, PostgreSQL `5432` (`levelup_db`).

## Estrutura do Repositório
- `src/pages/` — Páginas da aplicação (`Home`, `BazarMagico`, `Perfil`, `Tavern`, `Signin`, `Signup`, áreas da vida).
- `src/layouts/` — `RootLayout` (Header/HUD + Footer) e `AreasDaVidaLayout` (Sidebar + Painel direito).
- `src/components/` — Componentes reutilizáveis (`MissoesList`, `MissionModal`, `Calendar`, `CustomCheckbox`, `ProfileCard`).
- `src/contexts/` e `src/hooks/` — `ThemeContext`, `AreaContext` e `useAreaInfo`.
- `src/manager/` — Regras de estado no cliente (`MissionManager`, `ItemManager`).
- `src/routes/index.jsx` — Definição central de rotas da SPA.
- `public/` — Assets estáticos servidos na raiz (`banners/`, `icons/`, `logos/`).
- `backend/src/main/java/com/levelup/api/` — Camadas `config`, `controllers`, `dtos`, `entities`, `enums`, `repository`, `service`.
- `backend/src/main/resources/db/` — Scripts SQL e migrations do PostgreSQL.
- `docs/diagrams/` — Diagramas (`Diagrama_Conceitual.md`, `Diagrama_Relacional.md`); `docs/` também reúne os relatórios de Sprint.

## Idioma & Identidade Visual
- Interface, textos e mensagens de erro voltados ao usuário em **Português (pt-BR)**; identificadores de código consistentes com cada camada.
- **Tipografia oficial**: `Cormorant Garamond` (títulos), `Inter` (textos/UI) e `Press Start 2P` (elementos pixel/numéricos), que devem ser carregadas uma única vez em `index.html` (migrando eventuais `@import` legados de `.module.css` para lá).

## Regras Inegociáveis
1. **Fonte única de contrato (Front ↔ Back ↔ SQL)**: qualquer entidade, enum, coluna, rota ou campo de DTO deve bater exatamente com o schema PostgreSQL e com o payload consumido pelo React.
2. **Segurança e Privacidade**: nunca retornar `password` em DTOs ou expor entidades JPA diretamente nos controllers; segredos (`DB_PASSWORD`, `JWT_SECRET`) devem vir de variáveis de ambiente; nunca commitar `private-data.yml`, `.env` ou senhas.
3. **Transações na Economia Virtual**: operações envolvendo Gold, XP, HP, compra/venda/uso de itens ou conclusão de missões no backend devem ser atômicas (`@Transactional`).
4. **Tema Claro/Escuro e CSS Modules**: usar sempre as variáveis de `src/index.css` (`--bg-main`, `--bg-header`, `--bg-panels`, `--bg-panels-rgb`, `--border-gold`, `--text-gold`, `--text-highlight`, `--text-muted`, `--toast-*`) em vez de cores hardcoded. Nunca duplicar `@import` de Google Fonts em múltiplos `.module.css` nem colocar seletores globais (`* { ... }`) dentro de CSS Modules.
5. **Regras do React**: declarar todos os hooks (`useState`, `useEffect`, `useFormik`, etc.) antes de qualquer `return` condicional; não aninhar `<main>` dentro de `<main>`; manter atributos SVG em camelCase (`strokeWidth`, `strokeLinecap`, `strokeLinejoin`).
6. **Datas no Cliente**: evitar `toISOString().split('T')[0]` (UTC) para comparações de dia local em `UTC-3`; usar data local explícita.
7. **Revisão e Higiene do Git**: antes de commitar mudanças de código, revisar o diff com a skill `levelup-diff-review` (subagent independente read-only); adicionar arquivos explicitamente no `git add` (evitar `git add .` cego) e nunca commitar pastas duplicadas (`Level-Up-main/`), `node_modules/` ou `target/`.
