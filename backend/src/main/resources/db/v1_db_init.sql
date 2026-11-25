-- Tabelas (ENUMs representados como VARCHAR + CHECK para compatibilidade direta com JPA @Enumerated(EnumType.STRING))
CREATE TABLE Account (
    id_account SERIAL PRIMARY KEY,
    username   VARCHAR(50) NOT NULL UNIQUE,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    level      INT NOT NULL DEFAULT 1,
    xp_amount  INT NOT NULL DEFAULT 0,
    hp_amount  INT NOT NULL DEFAULT 100,
    gc_amount  INT NOT NULL DEFAULT 0,
    class      VARCHAR(20) NOT NULL CHECK (class IN ('GUERREIRO', 'MAGO', 'LADINO'))
);

CREATE TABLE Quest (
    id_quest    SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    xp_reward   INT NOT NULL DEFAULT 0,
    gc_amount   INT NOT NULL DEFAULT 0,
    difficulty  VARCHAR(20) NOT NULL CHECK (difficulty IN ('NOVATO', 'VETERANO', 'LENDARIO')),
    category    VARCHAR(30) NOT NULL DEFAULT 'OUTROS' CHECK (category IN ('SAUDE', 'ESTUDOS', 'AGENDA', 'PLANEJAMENTO', 'ORGANIZACAO', 'LAZER', 'FINANCAS', 'OUTROS')),
    id_account  INT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE Item (
    id_item  SERIAL PRIMARY KEY,
    id_quest INT,
    gc_price INT NOT NULL,
    name     VARCHAR(100) NOT NULL,
    type     VARCHAR(20) NOT NULL CHECK (type IN ('PET', 'CASA', 'ROUPA', 'EQUIPAMENTO'))
);

CREATE TABLE Inventory (
    id_inventory SERIAL PRIMARY KEY,
    id_item      INT NOT NULL,
    id_account   INT NOT NULL,
    equipped     BOOLEAN DEFAULT FALSE,
    acquired_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Accomplish (
    id_quest     INT NOT NULL,
    id_account   INT NOT NULL,
    status       VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    xp_earned    INT NOT NULL DEFAULT 0,
    gc_earned    INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    failed_at    TIMESTAMP,
    PRIMARY KEY (id_quest, id_account)
);

-- Foreign Keys
ALTER TABLE Quest ADD FOREIGN KEY (id_account) REFERENCES Account (id_account) ON DELETE CASCADE;
ALTER TABLE Item ADD FOREIGN KEY (id_quest) REFERENCES Quest (id_quest) ON DELETE SET NULL;
ALTER TABLE Inventory ADD FOREIGN KEY (id_item) REFERENCES Item (id_item) ON DELETE CASCADE;
ALTER TABLE Inventory ADD FOREIGN KEY (id_account) REFERENCES Account (id_account) ON DELETE CASCADE;
ALTER TABLE Accomplish ADD FOREIGN KEY (id_quest) REFERENCES Quest (id_quest) ON DELETE CASCADE;
ALTER TABLE Accomplish ADD FOREIGN KEY (id_account) REFERENCES Account (id_account) ON DELETE CASCADE;

-- Índices
CREATE INDEX idx_quest_account ON Quest(id_account);
CREATE INDEX idx_inventory_account ON Inventory(id_account);
CREATE INDEX idx_accomplish_account ON Accomplish(id_account);
CREATE INDEX idx_accomplish_status ON Accomplish(id_account, status);
