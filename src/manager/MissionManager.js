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
            alert(`🎉 Nível Acima! Você alcançou o Nível ${state.level}!`);
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
                alert("💀 Você perdeu todo seu HP! O progresso do nível atual foi zerado e você perdeu 25% do seu ouro.");
                player.hp = player.maxHp;
                player.xp = 0;
                player.gold = Math.floor(player.gold * 0.75);
            } else {
                alert(`⚠️ Você tomou ${damageTaken} de dano por não completar suas diárias ontem!`);
            }
            
            MissionManager.savePlayerState(player);
            localStorage.setItem('missions', JSON.stringify(updatedMissions));
        }
    }
};