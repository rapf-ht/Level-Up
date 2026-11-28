// Tipos de missão (Análise: Hábitos, Diárias e Afazeres) e níveis de dificuldade.

export const MISSION_TYPES = {
  habito: {
    label: "Hábito",
    plural: "Hábitos",
    badge: "badge-habito",
    hint: "Algo que você quer fazer com mais frequência. Registre sempre que fizer e ganhe XP. Não há prazo nem penalidade.",
  },
  diaria: {
    label: "Diária",
    plural: "Diárias",
    badge: "badge-diaria",
    hint: "Aparece todos os dias. Cumpri-la mantém sua sequência; esquecê-la custa HP.",
  },
  afazer: {
    label: "Afazer",
    plural: "Afazeres",
    badge: "badge-afazer",
    hint: "Uma tarefa feita uma única vez. O prazo é opcional.",
  },
};

export const TYPE_ORDER = ["habito", "diaria", "afazer"];

export const DIFFICULTIES = {
  facil: { label: "Fácil", xp: 10, gold: 5, hpLoss: 5 },
  media: { label: "Média", xp: 20, gold: 10, hpLoss: 10 },
  dificil: { label: "Difícil", xp: 40, gold: 20, hpLoss: 15 },
};

export const DIFFICULTY_ORDER = ["facil", "media", "dificil"];
