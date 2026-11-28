// Jogadores de exemplo para a Taverna e o perfil público.
// Quando o backend tiver ranking, este arquivo vira uma chamada à API.

export const ACHIEVEMENTS = {
  primeira: { title: "Primeira missão", description: "Cumpriu a primeira missão." },
  semana: { title: "Semana cheia", description: "7 dias seguidos cumprindo missões." },
  mes: { title: "Mês de ferro", description: "30 dias seguidos cumprindo missões." },
  cem: { title: "Cem missões", description: "Cumpriu 100 missões." },
  rico: { title: "Bolsa pesada", description: "Juntou 1.000 de ouro." },
  guilda: { title: "Fundador", description: "Criou uma guilda." },
  estudos: { title: "Rato de biblioteca", description: "50 missões de Estudos." },
  saude: { title: "Corpo são", description: "50 missões de Saúde." },
};

export const PLAYERS = [
  { id: "ana.rpg", equipped: { capacete: "chapeu_mago_1", calca: "calca_viajante_1", cenario: "cenario_taverna_1", pet: "pet_slime_1" }, name: "Ana", playerClass: "Mago", level: 14, xp: 6820, streak: 41, completed: 212, guild: "Guilda dos Estudos", friend: true, achievements: ["primeira", "semana", "mes", "cem", "estudos", "guilda"] },
  { id: "lucas_m", equipped: { capacete: "elmo_ferro_1", armadura: "escudo_madeira_1", arma: "espada_curta_1", bota: "botas_couro_1" }, name: "Lucas", playerClass: "Guerreiro", level: 12, xp: 5410, streak: 18, completed: 174, guild: "Corredores da Manhã", friend: true, achievements: ["primeira", "semana", "cem", "saude", "guilda"] },
  { id: "carol_l", equipped: { capacete: "chapeu_mago_1", cenario: "cenario_floresta_1" }, name: "Carol", playerClass: "Mago", level: 11, xp: 4975, streak: 9, completed: 160, guild: "Leitores Noturnos", friend: false, achievements: ["primeira", "semana", "cem", "estudos"] },
  { id: "rafa.dev", equipped: { arma: "espada_curta_1", bota: "botas_couro_1", calca: "calca_viajante_1" }, name: "Rafa", playerClass: "Ladino", level: 10, xp: 4380, streak: 26, completed: 131, guild: "Clube da Economia", friend: true, achievements: ["primeira", "semana", "cem", "rico", "guilda"] },
  { id: "bia.c", equipped: { pet: "pet_slime_1", cenario: "cenario_floresta_1" }, name: "Bia", playerClass: "Ladino", level: 8, xp: 3120, streak: 5, completed: 97, guild: "República Organizada", friend: false, achievements: ["primeira", "semana", "rico"] },
  { id: "teo", equipped: { armadura: "escudo_madeira_1" }, name: "Teo", playerClass: "Guerreiro", level: 6, xp: 2045, streak: 3, completed: 64, guild: null, friend: false, achievements: ["primeira", "semana"] },
  { id: "jggranito", equipped: { arma: "espada_curta_1", armadura: "escudo_madeira_1" }, name: "Jggranito", playerClass: "Guerreiro", level: 5, xp: 1680, streak: 7, completed: 52, guild: "Projeto Integrador 3B", friend: false, me: true, achievements: ["primeira", "semana", "guilda"] },
  { id: "malu", equipped: { capacete: "chapeu_mago_1" }, name: "Malu", playerClass: "Mago", level: 4, xp: 1210, streak: 12, completed: 38, guild: null, friend: true, achievements: ["primeira", "semana"] },
];

export function getPlayer(id) {
  return PLAYERS.find((player) => player.id === id) ?? null;
}

export function getRanking({ friendsOnly = false } = {}) {
  return PLAYERS.filter((player) => !friendsOnly || player.friend || player.me).sort((a, b) => b.xp - a.xp);
}
