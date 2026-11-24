---
name: levelup-quality-check
description: >-
  Use this skill before committing, opening a PR, or finishing a task to verify
  lint, build, backend tests, asset integrity, routes, and repository hygiene.
---

# Level-Up Quality & Pre-PR Check

Execute esta verificação antes de finalizar qualquer entrega ou abrir Pull Request.

## 1. Frontend
- Verifique se `node_modules/` existe; caso não exista, informe explicitamente antes de rodar os comandos ou instale conforme aprovado.
- Rode `npm run lint` na raiz e corrija erros de ESLint.
- Rode `npm run build` na raiz e confirme que o build de produção do Vite conclui sem erros.
- Verifique se todos os links `<Link to="...">` e `<NavLink to="...">` apontam para rotas declaradas em `src/routes/index.jsx`.
- Confirme que todas as imagens/ícones/banners referenciados em JSX ou CSS existem em `public/` ou `src/assets/` e que não há `@import` duplicado de Google Fonts em `.module.css`.

## 2. Backend
- Rode `.\mvnw.cmd test` (Windows) ou `./mvnw test` (Linux/macOS) dentro de `backend/` e verifique se todos os testes passam.
- Confirme que nenhum controller expõe senhas ou entidades JPA cruas e que o CORS não aponta para portas erradas (como `5432`).

## 3. Revisão Independente por Subagent
- Para mudanças não triviais, use a skill `levelup-diff-review` para delegar uma revisão read-only do diff a um subagent independente antes de commitar.

## 4. Higiene do Git
- Rode `git status -sb` e `git diff --cached --stat`.
- Faça staging explícito dos arquivos pretendidos (`git add <arquivos>`), evitando `git add .` cego.
- Garanta que não há arquivos sensíveis (`private-data.yml`, `.env`), pastas de build (`dist/`, `target/`), `node_modules/` ou pastas duplicadas (`Level-Up-main/`) no commit.
