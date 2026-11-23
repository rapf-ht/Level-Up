---
name: levelup-backend-feature
description: >-
  Use this skill when creating or modifying Spring Boot entities, SQL schemas,
  DTOs, repositories, services, controllers, or security configs in backend/.
---

# Level-Up Backend Feature Workflow

Siga este fluxo ao implementar ou alterar funcionalidades na API Java 21 + Spring Boot (`backend/src/main/java/com/levelup/api/`).

## 1. Banco de Dados e Entidades JPA
- Confira `backend/src/main/resources/db/v1_db_init.sql` e `docs/diagrams/Diagrama_Relacional.md` antes de criar/alterar tabelas.
- Mapeie explicitamente `@Table(name = "...")` e `@Column(name = "...")` em cada Entity para evitar divergência entre nomes Java (`xp`, `hp`, `gc`, `classes`) e colunas SQL (`xp_amount`, `hp_amount`, `gc_amount`, `class`).
- Atenção a **ENUMs nativos do PostgreSQL** (`class_enum`, `difficulty_enum`, `item_type_enum` em `v1_db_init.sql`): `@Enumerated(EnumType.STRING)` sozinho gera `VARCHAR`, causando erro de cast em tempo de execução contra colunas ENUM nativas — alinhe explicitamente (ex.: `@JdbcTypeCode(SqlTypes.NAMED_ENUM)` no Hibernate ou `VARCHAR` + `CHECK` no SQL).
- Use Lombok (`@Getter`, `@Setter`, `@NoArgsConstructor`, `@AllArgsConstructor`) seguindo o padrão de `entities/Account.java`.
- Prefira migrations versionadas (Flyway) em vez de depender de `ddl-auto: update` em produção.

## 2. DTOs, Validação e Erros
- Prefira injeção via construtor (`private final` + `@RequiredArgsConstructor`) em novas classes em vez de `@Autowired` em campo.
- Nunca receba ou retorne entidades JPA diretamente nos controllers.
- Separe DTOs de entrada (`*RequestDTO` / `SignupDTO`, `LoginDTO`) e saída (`AccountDTO`, etc.), nunca expondo `password`.
- Use Bean Validation (`@Valid`) nos DTOs de entrada (garantindo `spring-boot-starter-validation` no `backend/pom.xml`), valide unicidade (`email` e `username`) e conversão segura de Enums antes de persistir, e centralize exceções com `@RestControllerAdvice` para retornar `400 Bad Request` ou `409 Conflict` com mensagens amigáveis (evite deixar `IllegalArgumentException` ou `DataIntegrityViolationException` virar `500`).

## 3. Services e Economia Virtual
- Coloque regras de negócio em `service/` (`@Service`).
- Toda operação de economia virtual ou progressão (compra/venda no Bazar Mágico, equipar/usar item, concluir missão, aplicar dano/level-up) deve ser anotada com `@Transactional` para garantir atomicidade (ACID).

## 4. Controllers, CORS, Segurança e Dependências
- Anote controllers REST com `@RestController` e `@RequestMapping("/api/<recurso>")`.
- Prefira configuração centralizada de CORS no `SecurityConfig` (`CorsConfigurationSource`) liberando a origem do frontend (`http://localhost:5173`), **nunca** a porta do PostgreSQL (`5432`).
- Use status HTTP semânticos: `201 Created` para criação, `200 OK` para consultas/login, `400` para validação, `401` para credenciais inválidas.
- Ao ativar autenticação JWT (`jjwt` já no `pom.xml`), carregue o segredo via variável de ambiente (`${JWT_SECRET}`), configure `SessionCreationPolicy.STATELESS` e proteja rotas privadas no `SecurityConfig.java`, liberando apenas rotas públicas como `/api/account/register` e `/api/account/login`.
- Mantenha `backend/pom.xml` enxuto: evite manter dependências de template server-side (como Thymeleaf) em uma API REST pura.

## 5. Validação
- Execute `.\mvnw.cmd test` (Windows) ou `./mvnw test` (Linux/macOS) dentro de `backend/`, observando que `application.yml` exige `DB_PASSWORD` e PostgreSQL acessível (ou um profile de teste dedicado).
