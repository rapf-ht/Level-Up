---
name: levelup-fullstack-contract
description: >-
  Use this skill when aligning data models, enums, API payloads, routes, or
  item/quest catalogs across the React frontend, Spring Boot backend, and PostgreSQL schema.
---

# Level-Up Fullstack Contract Sync

Use esta skill sempre que uma mudança tocar mais de uma camada (Frontend ↔ Backend ↔ PostgreSQL) para evitar quebras de contrato.

## 1. Regra de Fonte Única & Alinhamento de Domínio
Ao encontrar divergência entre `backend/src/main/resources/db/v1_db_init.sql`, `docs/diagrams/Diagrama_Relacional.md`, `backend/.../enums/*.java` e `src/`, sincronize todas as camadas juntas (ou pergunte ao usuário qual taxonomia prevalece) em vez de alterar apenas um lado.

Antes de codar, verifique se os valores são idênticos nas 3 camadas:
- **Classes de Jogador (`ClassPlayer`)**:
  - Conferir `backend/.../enums/ClassPlayer.java`, `v1_db_init.sql`, `docs/diagrams/Diagrama_Relacional.md` e os botões de `src/pages/Signup.jsx`.
- **Dificuldade / Tipo de Missão**:
  - Frontend (`daily`, `medium`, `weekly`) ↔ Backend/SQL (`FACIL`, `NORMAL`, `DIFICIL`) — documentar e centralizar o mapeamento explícito.
- **Tipos de Item**:
  - Frontend (`src/manager/ItemManager.js`: `armaduras`, `armas`, `aparencia`, `casas`, `ovos`, `mascotes`, `pocoes`) ↔ SQL (`PET`, `CASA`, `ROUPA`, `EQUIPAMENTO`) ↔ DER (`PET`, `FUNDO`, `ROUPA`, `EFEITO`). Nunca crie uma nova categoria só em um lado.
- **Atributos do Jogador**:
  - Alinhar valores iniciais (`hp`/`maxHp` = `100`, `level` = `1`, `xp` = `0`, `gc`/`gold` = `0`) entre `Account.java`, `v1_db_init.sql` e `MissionManager.js`.

## 2. Mapeamento de Campos e Rotas
Mantenha a correspondência explícita entre banco, DTO e frontend:

| Banco PostgreSQL (`Account`) | DTO / JSON Backend (`AccountDTO`) | Estado Frontend |
| :--- | :--- | :--- |
| `id_account` | `idAccount` | `idAccount` |
| `xp_amount` | `xp` | `xp` |
| `hp_amount` | `hp` | `hp` |
| `gc_amount` | `gc` | `gold` |
| `class` | `classPlayer` | `classPlayer` |

- **Rotas SPA vs Endpoints REST**: confira se as rotas declaradas em `src/routes/index.jsx` e os links em `RootLayout.jsx` (desktop/mobile) e `Signin.jsx`/`Signup.jsx` existem e batem com os recursos REST (`/api/account/*` já implementado; `/api/quests/*`, `/api/items/*` e `/api/inventory/*` como recursos-alvo previstos em `v1_db_init.sql`).

## 3. Contrato de API REST & Verificação
1. Documente URL, método HTTP, headers (`Authorization: Bearer <token>`), payload de request e DTO de response.
2. Garanta que os nomes de propriedades JSON do DTO batam exatamente com o que o frontend lê/envia (ex.: `username`, `email`, `password`, `classPlayer`).
3. Centralize chamadas HTTP em um módulo de serviço/API no frontend (ex.: `src/services/api.js`) com base URL configurável via `import.meta.env.VITE_API_URL`.
4. Teste o fluxo ponta a ponta: criação/envio no frontend → validação e persistência no controller/service → retorno JSON → atualização reativa da UI.
