-- ENUMs
CREATE TYPE class_enum AS ENUM ('GUERREIRO', 'MAGO', 'LADINO');
CREATE TYPE difficulty_enum AS ENUM ('FACIL', 'NORMAL', 'DIFICIL');
CREATE TYPE item_type_enum AS ENUM ('PET', 'CASA', 'ROUPA', 'EQUIPAMENTO');

-- Tabelas
CREATE TABLE Account (
    id_account SERIAL PRIMARY KEY,
    username   VARCHAR(50) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    level      INT DEFAULT 1,
    xp_amount  INT DEFAULT 0,
    hp_amount  INT DEFAULT 100,
    gc_amount  INT DEFAULT 0,
    class      class_enum NOT NULL
);

CREATE TABLE Quest (
    id_quest    SERIAL PRIMARY KEY,
    title       VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    xp_reward   INT DEFAULT 0,
    gc_amount   INT DEFAULT 0,
    difficulty  difficulty_enum NOT NULL
);

CREATE TABLE Item (
    id_item  SERIAL PRIMARY KEY,
    id_quest INT,
    gc_price INT NOT NULL,
    name     VARCHAR(100) NOT NULL,
    type     item_type_enum NOT NULL
);

CREATE TABLE Inventory (
    id_inventory SERIAL PRIMARY KEY,
    id_item      INT NOT NULL,
    id_account   INT NOT NULL,
    equipped     BOOLEAN DEFAULT FALSE,
    acquired_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Accomplish (
    id_quest   INT NOT NULL,
    id_account INT NOT NULL,
    PRIMARY KEY (id_quest, id_account)
);

-- Foreign Keys
ALTER TABLE Item ADD FOREIGN KEY (id_quest) REFERENCES Quest (id_quest);
ALTER TABLE Inventory ADD FOREIGN KEY (id_item) REFERENCES Item (id_item);
ALTER TABLE Inventory ADD FOREIGN KEY (id_account) REFERENCES Account (id_account);
ALTER TABLE Accomplish ADD FOREIGN KEY (id_quest) REFERENCES Quest (id_quest);
ALTER TABLE Accomplish ADD FOREIGN KEY (id_account) REFERENCES Account (id_account);

-- Índices
CREATE INDEX idx_inventory_account ON Inventory(id_account);
CREATE INDEX idx_accomplish_account ON Accomplish(id_account);