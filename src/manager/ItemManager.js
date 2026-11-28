import { spriteIcon } from "../data/spriteArt";

// sprite: camada do avatar (src/data/sprites.js). layerSrc (opcional): PNG 32x32 que substitui o sprite.
export const SHOP_CATALOG = [
  {
    id: "pocao_hp_1",
    name: "Poção HP",
    description: "Restaura 20 HP instantaneamente ao ser usada.",
    type: "pocoes",
    slot: null,
    price: 50,
    sellPrice: 25,
    icon: "/ui/pocao.png",
    effect: { stat: "hp", value: 20 },
  },
  {
    id: "pergaminho_xp_1",
    name: "Pergaminho de XP",
    description: "Concede 50 XP ao ser usado.",
    type: "pocoes",
    slot: null,
    price: 150,
    sellPrice: 75,
    icon: "/ui/pergaminho.png",
    effect: { stat: "xp", value: 50 },
  },
  {
    id: "espada_curta_1",
    name: "Espada curta",
    description: "Uma lâmina leve para iniciantes.",
    type: "armas",
    slot: "arma",
    price: 350,
    sellPrice: 175,
    icon: "/ui/espada.png",
    sprite: "espada_curta",
    effect: null,
  },
  {
    id: "escudo_madeira_1",
    name: "Escudo de madeira",
    description: "Proteção básica feita de carvalho.",
    type: "armaduras",
    slot: "armadura",
    price: 200,
    sellPrice: 100,
    icon: "/ui/escudo.png",
    sprite: "escudo_madeira",
    effect: null,
  },
  {
    id: "elmo_ferro_1",
    name: "Elmo de ferro",
    description: "Protege a cabeça e impõe respeito na guilda.",
    type: "armaduras",
    slot: "capacete",
    price: 250,
    sellPrice: 125,
    icon: spriteIcon("elmo_ferro"),
    sprite: "elmo_ferro",
    effect: null,
  },
  {
    id: "chapeu_mago_1",
    name: "Chapéu de mago",
    description: "Pontudo, roxo e com estrelas. Não dá poderes, mas dá estilo.",
    type: "aparencia",
    slot: "capacete",
    price: 300,
    sellPrice: 150,
    icon: spriteIcon("chapeu_mago"),
    sprite: "chapeu_mago",
    effect: null,
  },
  {
    id: "calca_viajante_1",
    name: "Calça de viajante",
    description: "Tecido verde e resistente para longas caminhadas.",
    type: "aparencia",
    slot: "calca",
    price: 120,
    sellPrice: 60,
    icon: spriteIcon("calca_viajante"),
    sprite: "calca_viajante",
    effect: null,
  },
  {
    id: "botas_couro_1",
    name: "Botas de couro",
    description: "Para quem não para de andar.",
    type: "armaduras",
    slot: "bota",
    price: 150,
    sellPrice: 75,
    icon: spriteIcon("botas_couro"),
    sprite: "botas_couro",
    effect: null,
  },
  {
    id: "cenario_floresta_1",
    name: "Cenário: floresta",
    description: "Céu aberto e árvores atrás do seu personagem.",
    type: "aparencia",
    slot: "cenario",
    price: 400,
    sellPrice: 200,
    icon: spriteIcon("cenario_floresta"),
    sprite: "cenario_floresta",
    effect: null,
  },
  {
    id: "cenario_taverna_1",
    name: "Cenário: taverna",
    description: "Paredes de madeira e uma janela acesa.",
    type: "aparencia",
    slot: "cenario",
    price: 400,
    sellPrice: 200,
    icon: spriteIcon("cenario_taverna"),
    sprite: "cenario_taverna",
    effect: null,
  },
  {
    id: "pet_slime_1",
    name: "Slime de estimação",
    description: "Pequeno, verde e sempre ao seu lado.",
    type: "mascotes",
    slot: "pet",
    price: 500,
    sellPrice: 250,
    icon: spriteIcon("pet_slime"),
    sprite: "pet_slime",
    effect: null,
  },
];

export const EQUIPMENT_SLOTS = [
  { id: "capacete", label: "capacete", side: "left" },
  { id: "armadura", label: "armadura", side: "left" },
  { id: "calca", label: "calça", side: "left" },
  { id: "bota", label: "bota", side: "left" },
  { id: "arma", label: "arma", side: "right" },
  { id: "cenario", label: "cenário", side: "right" },
  { id: "pet", label: "pet", side: "right" },
  { id: "casa", label: "casa", side: "right" },
];

export const ITEM_TYPE_LABELS = {
  armaduras: "Armaduras",
  armas: "Armas",
  aparencia: "Aparência",
  casas: "Casas",
  ovos: "Ovos",
  mascotes: "Mascotes",
  pocoes: "Poções",
};

export const ItemManager = {
  getInventory: () => {
    const inv = localStorage.getItem("inventory");
    return inv ? JSON.parse(inv) : [];
  },

  saveInventory: (inventory) => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  },

  getItemQuantity: (itemId) => {
    const inv = ItemManager.getInventory();
    const entry = inv.find((i) => i.itemId === itemId);
    return entry ? entry.quantity : 0;
  },

  getEquipped: () => {
    const raw = localStorage.getItem("equipped");
    if (raw) return JSON.parse(raw);
    // Estado inicial vazio
    const empty = {};
    EQUIPMENT_SLOTS.forEach((s) => {
      empty[s.id] = null;
    });
    return empty;
  },

  saveEquipped: (equipped) => {
    localStorage.setItem("equipped", JSON.stringify(equipped));
  },

  equipItem: (itemId) => {
    const item = SHOP_CATALOG.find((i) => i.id === itemId);
    if (!item || !item.slot)
      return { success: false, message: "Este item não pode ser equipado." };

    if (ItemManager.getItemQuantity(itemId) < 1) {
      return { success: false, message: "Você não tem esse item." };
    }

    const equipped = ItemManager.getEquipped();
    equipped[item.slot] = itemId;
    ItemManager.saveEquipped(equipped);
    window.dispatchEvent(new Event("playerStateUpdated"));
    return { success: true, message: `Item equipado: ${item.name}.` };
  },

  unequipSlot: (slotId) => {
    const equipped = ItemManager.getEquipped();
    equipped[slotId] = null;
    ItemManager.saveEquipped(equipped);
    window.dispatchEvent(new Event("playerStateUpdated"));
    return { success: true };
  },

  getEquippedItemInSlot: (slotId) => {
    const equipped = ItemManager.getEquipped();
    const itemId = equipped[slotId];
    if (!itemId) return null;
    return SHOP_CATALOG.find((i) => i.id === itemId) || null;
  },

  buyItem: (itemId) => {
    const item = SHOP_CATALOG.find((i) => i.id === itemId);
    if (!item) return { success: false, message: "Item não encontrado." };

    const stateRaw = localStorage.getItem("gameState");
    const player = stateRaw ? JSON.parse(stateRaw) : null;
    if (!player) return { success: false, message: "Jogador não encontrado." };

    if (player.gold < item.price) {
      return { success: false, message: "Ouro insuficiente. Cumpra mais missões para juntar o valor." };
    }

    player.gold -= item.price;
    localStorage.setItem("gameState", JSON.stringify(player));

    const inv = ItemManager.getInventory();
    const existing = inv.find((i) => i.itemId === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      inv.push({ itemId, quantity: 1, acquiredAt: new Date().toISOString() });
    }
    ItemManager.saveInventory(inv);

    window.dispatchEvent(new Event("playerStateUpdated"));
    return { success: true, message: item.slot ? `Compra concluída: ${item.name} está na sua mochila. Equipe pelo inventário.` : `Compra concluída: ${item.name} está na sua mochila.` };
  },

  sellItem: (itemId) => {
    const item = SHOP_CATALOG.find((i) => i.id === itemId);
    if (!item) return { success: false, message: "Item não encontrado." };

    const inv = ItemManager.getInventory();
    const existing = inv.find((i) => i.itemId === itemId);
    if (!existing || existing.quantity < 1) {
      return { success: false, message: "Você não tem esse item." };
    }

    const stateRaw = localStorage.getItem("gameState");
    const player = stateRaw ? JSON.parse(stateRaw) : null;
    if (!player) return { success: false, message: "Jogador não encontrado." };

    player.gold += item.sellPrice;
    localStorage.setItem("gameState", JSON.stringify(player));

    existing.quantity -= 1;
    const updatedInv =
      existing.quantity === 0 ? inv.filter((i) => i.itemId !== itemId) : inv;
    ItemManager.saveInventory(updatedInv);

    const equipped = ItemManager.getEquipped();
    if (
      item.slot &&
      equipped[item.slot] === itemId &&
      existing.quantity === 0
    ) {
      equipped[item.slot] = null;
      ItemManager.saveEquipped(equipped);
    }

    window.dispatchEvent(new Event("playerStateUpdated"));
    return {
      success: true,
      message: `Você vendeu ${item.name} por ${item.sellPrice} de ouro.`,
    };
  },

  getInventoryWithDetails: () => {
    const inv = ItemManager.getInventory();
    return inv
      .map((entry) => {
        const catalogItem = SHOP_CATALOG.find((i) => i.id === entry.itemId);
        if (!catalogItem) return null;
        return { ...catalogItem, quantity: entry.quantity };
      })
      .filter(Boolean);
  },
};
