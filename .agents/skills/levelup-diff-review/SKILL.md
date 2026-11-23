---
name: levelup-diff-review
description: >-
  Use this skill to delegate an independent, read-only code review of modified
  or newly created files to a separate reviewer subagent before committing or
  opening a PR in the Level-Up repository.
---

# Level-Up Diff Review (Subagent Independente)

Use esta skill para que um **subagent separado e somente leitura** revise os arquivos modificados ou recém-criados com contexto limpo, reduzindo viés de autoria antes de commitar ou abrir PR.

## Passo 1 — Coletar escopo e diff (agente principal)
1. Rode `git status --short`, `git diff` (unstaged) e `git diff --staged` (staged) — ou `git diff main...HEAD` ao revisar uma branch inteira.
2. Liste todos os arquivos modificados e novos pretendidos para o commit (excluindo artefatos/pastas não relacionados, como `Level-Up-main/`).
3. Se houver arquivos novos (*untracked*) relevantes ao commit, inclua seus caminhos explicitamente no prompt, pois `git diff` não exibe arquivos ainda não adicionados ao índice.

## Passo 2 — Delegar revisão ao subagent somente leitura (`invoke_subagent`)
Chame `invoke_subagent` com os parâmetros:
- `TypeName`: `"research"` (subagent built-in somente leitura — envie explicitamente a lista de arquivos e o diff no `Prompt`).
- `Role`: `"Level-Up Diff Reviewer"`
- `Model`: `"inherit"`
- `Prompt`: inclua obrigatoriamente:
  1. A lista exata dos caminhos de arquivos alterados/criados e o diff coletado.
  2. Instrução para ler `AGENTS.md` e ler integralmente os arquivos alterados (além de arquivos de contrato impactados, como `src/routes/index.jsx`, `src/index.css`, `backend/src/main/resources/db/v1_db_init.sql` ou DTOs/Entities) via `read_file`.
  3. Os critérios obrigatórios de revisão do Level-Up:
     - **Bugs e Runtime**: Rules of Hooks no React (hooks antes de `return` condicional), cleanup de listeners/timers, datas locais vs UTC (`UTC-3`), percentuais de barras (`Math.min(..., 100)`), tratamento de `null`/exceções e `@Transactional` no Java.
     - **Segurança**: ausência de `password` em DTOs, entidades JPA não expostas em controllers, CORS correto (`http://localhost:5173`, nunca `5432`) e nenhum segredo commitado.
     - **Contrato Front ↔ Back ↔ SQL**: alinhamento de enums, nomes de colunas SQL/JPA, payloads JSON e rotas válidas.
     - **UI, Tema e Assets**: uso das variáveis CSS de `src/index.css`, ausência de `@import` duplicado de Google Fonts ou `*` global em CSS Modules, ausência de `<main>` aninhado, atributos SVG em camelCase e existência dos assets em `public/`.
     - **Aderência a Skills/Docs** (ao revisar `.agents/` ou `AGENTS.md`): frontmatter YAML válido (`name` igual à pasta, `description` em 3ª pessoa), instruções sem contradições e caminhos de arquivos reais.
     - **Higiene do Git**: nada de arquivos sensíveis (`private-data.yml`, `.env`), `node_modules/`, `target/` ou pastas duplicadas (`Level-Up-main/`) no escopo do commit.
  4. O formato de saída exigido do subagent:
     - **Escopo revisado** (arquivos lidos)
     - **Achados por severidade**: `Crítico (bloqueante)`, `Importante`, `Sugestão` — cada item com `arquivo:linha`, explicação objetiva do risco e correção proposta.
     - **Veredito**: `APROVADO`, `APROVADO COM RESSALVAS` ou `AJUSTES OBRIGATÓRIOS`.

## Passo 3 — Atuar sobre o veredito (agente principal)
- Se o veredito for `AJUSTES OBRIGATÓRIOS` ou houver achados `Crítico` ou `Importante` procedentes: aplique as correções nos arquivos pelo agente principal e envie o diff atualizado ao **mesmo** subagent via `send_message` (usando o `conversationId` retornado por `invoke_subagent`) para revalidação rápida.
- Se o veredito for `APROVADO` (ou houver apenas sugestões menores opcionais): prossiga para a verificação final (`levelup-quality-check`) e commit.

## Regras da Skill
- O subagent revisor nunca edita arquivos; ele apenas inspeciona e reporta.
- Não abra um novo subagent a cada rodada de ajuste: reutilize o mesmo `conversationId` via `send_message`.
