import { DIFFICULTIES } from "../data/missions";

// Valores padrão para um novo usuário
const INITIAL_STATE = {
    level: 1,
    xp: 0,
    gold: 0,
    hp: 50,
    maxHp: 50
};

/*
 * Modelo de missão
 *   type:       'habito' | 'diaria' | 'afazer'
 *   difficulty: 'facil' | 'media' | 'dificil'  (define XP, ouro e HP perdido)
 *   category:   id da área da vida
 *   dueDate:    'AAAA-MM-DD' opcional, só para afazeres
 *   status:     só afazeres mudam: 'pending' -> 'completed'
 *
 * Hábitos e diárias se repetem, então o que aconteceu fica no histórico ('history'):
 *   { id, missionId, title, category, type, kind: 'done' | 'miss', xp, gold, hp, at }
 * Sequência, XP da semana e contadores de hoje saem do histórico.
 */

function emitGameEvent(detail) {
    window.dispatchEvent(new CustomEvent('gameEvent', { detail }));
}

function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date, amount) {
    const d = startOfDay(date);
    d.setDate(d.getDate() + amount);
    return d;
}

function startOfWeek(date = new Date()) {
    const d = startOfDay(date);
    return addDays(d, -d.getDay());
}

// Dia local no formato AAAA-MM-DD
export function dayKey(date = new Date()) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${month}-${day}`;
}

function read(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function rewardOf(mission) {
    return DIFFICULTIES[mission.difficulty] ?? DIFFICULTIES.facil;
}

// Converte missões do formato antigo (daily / medium / weekly) uma única vez.
function migrate() {
    const missions = read('missions', []);
    if (!missions.some((m) => ['daily', 'medium', 'weekly'].includes(m.type))) return;

    const history = read('history', []);
    const converted = missions.map((m) => {
        const type = m.type === 'daily' ? 'diaria' : 'afazer';
        const difficulty = m.type === 'weekly' ? 'dificil' : m.type === 'medium' ? 'media' : 'facil';
        if (m.status === 'completed' && m.completedAt) {
            history.push({
                id: crypto.randomUUID(), missionId: m.id, title: m.title, category: m.category, type,
                kind: 'done', xp: m.xpReward ?? 0, gold: m.goldReward ?? 0, hp: 0, at: m.completedAt,
            });
        }
        if (m.status === 'failed') {
            history.push({
                id: crypto.randomUUID(), missionId: m.id, title: m.title, category: m.category, type,
                kind: 'miss', xp: 0, gold: 0, hp: 10, at: m.createdAt,
            });
        }
        const next = {
            id: m.id, title: m.title, type, difficulty, category: m.category, createdAt: m.createdAt,
            status: type === 'afazer' && m.status === 'completed' ? 'completed' : 'pending',
        };
        if (next.status === 'completed') next.doneAt = m.completedAt;
        return next;
    });
    write('missions', converted);
    write('history', history);
}

migrate();

export const MissionManager = {

    // -----------------------------------------
    // ESTADO DO JOGADOR
    // -----------------------------------------
    getPlayerState: () => read('gameState', { ...INITIAL_STATE }),

    savePlayerState: (state) => {
        // Regra de subir de nível: XP necessário = nível * 100
        const xpNeeded = state.level * 100;

        if (state.xp >= xpNeeded) {
            state.level += 1;
            state.xp = state.xp - xpNeeded; // Guarda o XP que sobrou
            state.hp = state.maxHp; // Cura completa ao subir
            state.gold += 50; // Bônus de nível
            emitGameEvent({ type: "levelup", level: state.level });
        }

        write('gameState', state);
    },

    // -----------------------------------------
    // MISSÕES
    // -----------------------------------------
    getMissions: () => read('missions', []),

    getHistory: () => read('history', []),

    createMission: ({ title, type = 'afazer', difficulty = 'facil', category = 'outros', dueDate = null }) => {
        const missions = MissionManager.getMissions();
        const mission = {
            id: crypto.randomUUID(),
            title,
            type,
            difficulty,
            category,
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        if (type === 'afazer' && dueDate) mission.dueDate = dueDate;
        missions.push(mission);
        write('missions', missions);
        return mission;
    },

    updateMission: (missionId, patch) => {
        write('missions', MissionManager.getMissions().map((m) => {
            if (m.id !== missionId) return m;
            const next = { ...m, ...patch };
            if (next.type !== 'afazer' || !next.dueDate) delete next.dueDate;
            return next;
        }));
    },

    deleteMission: (missionId) => {
        write('missions', MissionManager.getMissions().filter((m) => m.id !== missionId));
    },

    // Move as missões de uma área apagada para outra
    moveCategory: (from, to) => {
        write('missions', MissionManager.getMissions().map((m) => (m.category === from ? { ...m, category: to } : m)));
    },

    // Quantas vezes a missão foi feita hoje (hábitos podem ser feitos várias vezes)
    timesDoneToday: (mission) => {
        const today = dayKey();
        return MissionManager.getHistory()
            .filter((h) => h.kind === 'done' && h.missionId === mission.id && dayKey(h.at) === today).length;
    },

    isDoneToday: (mission) => {
        if (mission.type === 'afazer') return mission.status === 'completed';
        return MissionManager.timesDoneToday(mission) > 0;
    },

    // Cumpre a missão e dá a recompensa. Retorna a entrada do histórico, ou null se não havia o que fazer.
    completeMission: (missionId) => {
        const missions = MissionManager.getMissions();
        const index = missions.findIndex((m) => m.id === missionId);
        if (index === -1) return null;
        const mission = missions[index];

        if (mission.type === 'afazer' && mission.status === 'completed') return null;
        if (mission.type === 'diaria' && MissionManager.isDoneToday(mission)) return null;

        const now = new Date().toISOString();
        if (mission.type === 'afazer') {
            missions[index] = { ...mission, status: 'completed', doneAt: now };
            write('missions', missions);
        }

        const reward = rewardOf(mission);
        const entry = {
            id: crypto.randomUUID(), missionId: mission.id, title: mission.title, category: mission.category,
            type: mission.type, kind: 'done', xp: reward.xp, gold: reward.gold, hp: 0, at: now,
        };
        write('history', [...MissionManager.getHistory(), entry]);

        const player = MissionManager.getPlayerState();
        player.xp += reward.xp;
        player.gold += reward.gold;
        MissionManager.savePlayerState(player);
        // Avisa a interface (o aviso com "Desfazer" escuta este evento)
        window.dispatchEvent(new CustomEvent('missionCompleted', { detail: entry }));
        return entry;
    },

    // Desfaz uma missão cumprida por engano: tira a entrada do histórico, devolve o XP e o ouro
    // e, se for um afazer, volta ele para o quadro. Um nível já ganho não é retirado.
    undoCompletion: (entryId) => {
        const history = MissionManager.getHistory();
        const entry = history.find((h) => h.id === entryId && h.kind === 'done');
        if (!entry) return false;
        write('history', history.filter((h) => h.id !== entryId));

        if (entry.type === 'afazer') {
            write('missions', MissionManager.getMissions().map((m) => {
                if (m.id !== entry.missionId) return m;
                const next = { ...m, status: 'pending' };
                delete next.doneAt;
                return next;
            }));
        }

        const player = MissionManager.getPlayerState();
        player.xp = Math.max(0, player.xp - entry.xp);
        player.gold = Math.max(0, player.gold - entry.gold);
        write('gameState', player);
        window.dispatchEvent(new Event('playerStateUpdated'));
        return true;
    },

    // -----------------------------------------
    // ESTATÍSTICAS (derivadas do histórico)
    // -----------------------------------------
    getStreak: () => {
        const days = new Set(
            MissionManager.getHistory()
                .filter((h) => h.kind === 'done')
                .map((h) => startOfDay(h.at).getTime())
        );
        const has = (date) => days.has(date.getTime());
        const today = startOfDay(new Date());

        let cursor = has(today) ? today : addDays(today, -1);
        let current = 0;
        while (has(cursor)) {
            current += 1;
            cursor = addDays(cursor, -1);
        }

        let record = 0;
        days.forEach((time) => {
            if (has(addDays(time, -1))) return;
            let run = 0;
            let day = new Date(time);
            while (has(day)) {
                run += 1;
                day = addDays(day, 1);
            }
            record = Math.max(record, run);
        });

        const week = Array.from({ length: 7 }, (_, i) => {
            const day = addDays(startOfWeek(), i);
            return { done: has(day), today: day.getTime() === today.getTime() };
        });

        return { current, record, week };
    },

    // XP por dia da semana atual e total da semana anterior
    getWeeklyXp: (category = null) => {
        const start = startOfWeek();
        const previousStart = addDays(start, -7);
        const days = Array(7).fill(0);
        let previous = 0;

        MissionManager.getHistory()
            .filter((h) => h.kind === 'done' && (!category || h.category === category))
            .forEach((h) => {
                const day = startOfDay(h.at);
                if (day >= start) {
                    const index = Math.round((day - start) / 86400000);
                    if (index < 7) days[index] += h.xp || 0;
                } else if (day >= previousStart) {
                    previous += h.xp || 0;
                }
            });

        return { days, total: days.reduce((a, b) => a + b, 0), previous };
    },

    // -----------------------------------------
    // CASTIGO DAS DIÁRIAS (roda ao abrir o app)
    // Olha só o último dia em que o app foi aberto: cada diária que ficou sem fazer
    // naquele dia custa HP conforme a dificuldade. Ficar dias sem abrir não acumula castigo.
    // -----------------------------------------
    checkFailedDailies: () => {
        const today = dayKey();
        const lastCheck = localStorage.getItem('lastDailyCheck');
        localStorage.setItem('lastDailyCheck', today);
        if (!lastCheck || lastCheck >= today) return;

        const history = MissionManager.getHistory();
        const doneThatDay = new Set(
            history.filter((h) => h.kind === 'done' && dayKey(h.at) === lastCheck).map((h) => h.missionId)
        );
        const missed = MissionManager.getMissions().filter(
            (m) => m.type === 'diaria' && dayKey(m.createdAt) <= lastCheck && !doneThatDay.has(m.id)
        );
        if (missed.length === 0) return;

        let damageTaken = 0;
        const at = new Date(`${lastCheck}T23:59:00`).toISOString();
        missed.forEach((m) => {
            const hp = rewardOf(m).hpLoss;
            damageTaken += hp;
            history.push({
                id: crypto.randomUUID(), missionId: m.id, title: m.title, category: m.category,
                type: m.type, kind: 'miss', xp: 0, gold: 0, hp, at,
            });
        });
        write('history', history);

        const player = MissionManager.getPlayerState();
        player.hp -= damageTaken;

        // Regra de morte (requisitos): HP zerado faz perder 1 nível. O HP volta cheio.
        if (player.hp <= 0) {
            const levelLost = player.level > 1;
            player.level = Math.max(1, player.level - 1);
            player.xp = 0;
            player.hp = player.maxHp;
            emitGameEvent({ type: "death", amount: damageTaken, level: player.level, levelLost });
        } else {
            emitGameEvent({ type: "damage", amount: damageTaken, missed: missed.length });
        }

        write('gameState', player);
        window.dispatchEvent(new Event('playerStateUpdated'));
    }
};
