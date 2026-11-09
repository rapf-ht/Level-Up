// Valores padrão para um novo usuário
const INITIAL_STATE = {
    level: 1,
    xp: 0,
    gold: 0,
    hp: 50,
    maxHp: 50
};

// Recompensas pré-definidas
const MISSION_REWARDS = {
    daily: { xp: 10, gold: 5 },
    medium: { xp: 30, gold: 15 },
    weekly: { xp: 100, gold: 50 }
};

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

export const MissionManager = {
    
    // -----------------------------------------
    // GERENCIAMENTO DE ESTADO DO JOGADOR
    // -----------------------------------------
    getPlayerState: () => {
        const state = localStorage.getItem('gameState');
        return state ? JSON.parse(state) : INITIAL_STATE;
    },

    savePlayerState: (state) => {
        // Regra de Subir de Nível: XP Necessário = Nível * 100
        const xpNeeded = state.level * 100;
        
        if (state.xp >= xpNeeded) {
            state.level += 1;
            state.xp = state.xp - xpNeeded; // Guarda o XP que sobrou
            state.hp = state.maxHp; // Cura completa ao upar
            state.gold += 50; // Bônus de nível
            emitGameEvent({ type: "levelup", level: state.level });
        }

        localStorage.setItem('gameState', JSON.stringify(state));
    },

    // -----------------------------------------
    // GERENCIAMENTO DE MISSÕES
    // -----------------------------------------
    getMissions: () => {
        const missions = localStorage.getItem('missions');
        return missions ? JSON.parse(missions) : [];
    },

    // Cria uma nova missão (Ex: Ir à academia, Lavar a louça)
    createMission: (title, type = 'daily', category = 'geral') => {
        const missions = MissionManager.getMissions();
        const rewards = MISSION_REWARDS[type];

        const newMission = {
            id: crypto.randomUUID(), // Gera um ID único
            title: title,
            type: type, // 'daily', 'medium', 'weekly'
            category: category, // 'saude', 'estudos', 'financas', 'casa', etc.
            status: 'pending', // 'pending', 'completed'
            xpReward: rewards.xp,
            goldReward: rewards.gold,
            createdAt: new Date().toISOString()
        };

        missions.push(newMission);
        localStorage.setItem('missions', JSON.stringify(missions));
        return newMission;
    },

    // Completa a missão e dá as recompensas
    completeMission: (missionId) => {
        const missions = MissionManager.getMissions();
        const missionIndex = missions.findIndex(m => m.id === missionId);

        if (missionIndex === -1 || missions[missionIndex].status === 'completed') return;

        // Atualiza a missão para completada
        missions[missionIndex].status = 'completed';
        missions[missionIndex].completedAt = new Date().toISOString();
        localStorage.setItem('missions', JSON.stringify(missions));

        // Dá os recursos ao jogador
        const player = MissionManager.getPlayerState();
        player.xp += missions[missionIndex].xpReward;
        player.gold += missions[missionIndex].goldReward;
        
        MissionManager.savePlayerState(player);
    },

    // Função utilitária para filtrar missões por categoria diretamente no front
    getMissionsByCategory: (category) => {
        const missions = MissionManager.getMissions();
        return missions.filter(mission => mission.category === category);
    },

    // -----------------------------------------
    // ESTATÍSTICAS (derivadas das missões concluídas)
    // -----------------------------------------
    getStreak: () => {
        const days = new Set(
            MissionManager.getMissions()
                .filter((m) => m.status === 'completed' && m.completedAt)
                .map((m) => startOfDay(m.completedAt).getTime())
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

        MissionManager.getMissions()
            .filter((m) => m.status === 'completed' && m.completedAt && (!category || m.category === category))
            .forEach((m) => {
                const day = startOfDay(m.completedAt);
                if (day >= start) {
                    const index = Math.round((day - start) / 86400000);
                    if (index < 7) days[index] += m.xpReward || 0;
                } else if (day >= previousStart) {
                    previous += m.xpReward || 0;
                }
            });

        return { days, total: days.reduce((a, b) => a + b, 0), previous };
    },

    // -----------------------------------------
    // SISTEMA DE PUNIÇÃO (Rodar ao carregar o app)
    // -----------------------------------------
    checkFailedDailies: () => {
        const missions = MissionManager.getMissions();
        let player = MissionManager.getPlayerState();
        let damageTaken = 0;
        
        const today = new Date().toISOString().split('T')[0];

        const updatedMissions = missions.map(mission => {
            // Se for diária, estiver pendente e foi criada antes de hoje = Falhou
            const missionDate = mission.createdAt.split('T')[0];
            
            if (mission.type === 'daily' && mission.status === 'pending' && missionDate < today) {
                mission.status = 'failed';
                damageTaken += 10; // -10 HP por diária ignorada
            }
            return mission;
        });

        if (damageTaken > 0) {
            player.hp -= damageTaken;
            
            // Regra de Morte
            if (player.hp <= 0) {
                emitGameEvent({ type: "death", amount: damageTaken });
                player.hp = player.maxHp;
                player.xp = 0;
                player.gold = Math.floor(player.gold * 0.75);
            } else {
                emitGameEvent({ type: "damage", amount: damageTaken });
            }
            
            MissionManager.savePlayerState(player);
            localStorage.setItem('missions', JSON.stringify(updatedMissions));
            window.dispatchEvent(new Event('playerStateUpdated'));
        }
    }
};