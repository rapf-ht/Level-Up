---
name: levelup-frontend-feature
description: >-
  Use this skill when creating or modifying React pages, layouts, components,
  hooks, managers, routes, or CSS Modules in the Level-Up frontend (src/).
---

# Level-Up Frontend Feature Workflow

Siga este fluxo ao construir ou ajustar telas e componentes em `src/`.

## 1. Roteamento e Layouts
- Registre todas as novas rotas em `src/routes/index.jsx`.
- Páginas de **Áreas da Vida** devem ficar aninhadas sob `/areas-da-vida` (`AreasDaVidaLayout`), chamar `useAreaInfo(title, icon, banner)` no topo do componente e renderizar `<MissoesList categoryFilter="<area>" />`.
- Telas de autenticação (`Signin`, `Signup`) não devem exibir o HUD/navbar do usuário logado.
- Não aninhe `<main>` dentro de subpáginas quando `RootLayout` ou `AreasDaVidaLayout` já renderiza a tag `<main>`.

## 2. Estado, Formulários e Eventos
- Hooks (`useState`, `useEffect`, `useRef`, `useFormik`) devem **sempre** vir antes de qualquer `return` condicional (ex.: `if (!isOpen) return null;` deve ficar depois de todos os hooks).
- Formulários com validação usam **Formik + Yup** (como em `src/components/MissionModal.jsx`, garantindo que `useFormik` e demais hooks fiquem **ANTES** de qualquer `return` condicional).
- Nos gerenciadores de estado (`MissionManager`, `ItemManager`):
  - Sempre retorne cópias de `INITIAL_STATE` (`{ ...INITIAL_STATE }`), nunca a referência direta da constante.
  - Garanta que `gameState` esteja inicializado no `localStorage` antes de operações da loja.
  - No cálculo de subida de nível, use `while (state.xp >= state.level * 100)` (recalculando o XP necessário a cada nível dentro do laço) em vez de `if` para suportar ganhos altos de XP.
  - Ao atualizar XP, HP, Gold, missões ou inventário no cliente, dispare `window.dispatchEvent(new Event("playerStateUpdated"))` e sincronize ouvintes (`ProfileCard`, `RootLayout`, `Home`, `BazarMagico`, `Perfil`) via `useEffect` com cleanup (`removeEventListener`).
- Use chaves (`key`) realmente únicas em `.map()` (evite letras repetidas como `["D", "S", "T", "Q", "Q", "S", "S"]`).
- Evite interpolar `null` em `className` (`isActive ? styles.active : ""`).
- Escreva atributos SVG em camelCase (`strokeWidth`, `strokeLinecap`, `strokeLinejoin`).
- Centralize chamadas HTTP ao integrar com a API e evite hardcode de nome/métricas do jogador (como `"Jggranito"` ou `"Dev_BR"`).
- Calcule barras de progresso com percentual limitado: `Math.min((valor / maximo) * 100, 100)`.
- Para comparações de data diária (como punições), use data local (`new Date()`), nunca `toISOString().split("T")[0]` (UTC).

## 3. Estilização (CSS Modules + Tema)
- Crie estilos escopados em `<Componente>.module.css` sem seletores globais (`* { ... }`).
- Evite `width: 100vw` em headers fixos (prefira `width: 100%`) e `height: 100vh` em containers com scroll (prefira `min-height: 100vh`).
- Use exclusivamente as variáveis CSS de `src/index.css` (`--bg-main`, `--bg-header`, `--bg-panels`, `--bg-panels-rgb`, `--border-gold`, `--text-gold`, `--text-highlight`, `--text-muted`, `--toast-*`) para manter compatibilidade com `[data-theme="light"]` e tema escuro.
- **Não** adicione `@import` de Google Fonts nos `.module.css`; garanta que as fontes sejam carregadas uma única vez em `index.html` (se `index.html` ainda não tiver os `<link>` das fontes, migre os `@import` existentes nos `.module.css` antes de removê-los).
- Em `<img>` com fallback `onError`, limpe `e.currentTarget.onerror = null` antes de trocar o `src` para evitar loop infinito.

## 4. Validação
1. Rode `npm run lint` na raiz do projeto (avisando caso `node_modules` não esteja instalado).
2. Rode `npm run build` para garantir bundle limpo pelo Vite.
3. Confira se todo asset `/...` referenciado existe em `public/`.
