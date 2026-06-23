export const SHOP_CATALOG = [
  {
    id: "pocao_hp_1",
    name: "Poção HP",
    description: "Restaura 20 HP instantaneamente ao ser usada.",
    type: "pocoes",
    slot: null,
    price: 50,
    sellPrice: 25,
    icon: "/pocao.png",
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
    icon: "/pergaminho.png",
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
    icon: "/espada_curta.png",
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
    icon: "/escudo.png",
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
      return { success: false, message: "Você não possui este item." };
    }

    const equipped = ItemManager.getEquipped();
    equipped[item.slot] = itemId;
    ItemManager.saveEquipped(equipped);
    window.dispatchEvent(new Event("playerStateUpdated"));
    return { success: true, message: `${item.name} equipado!` };
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
      return { success: false, message: "Ouro insuficiente!" };
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
    return { success: true, message: `${item.name} comprado com sucesso!` };
  },

  sellItem: (itemId) => {
    const item = SHOP_CATALOG.find((i) => i.id === itemId);
    if (!item) return { success: false, message: "Item não encontrado." };

    const inv = ItemManager.getInventory();
    const existing = inv.find((i) => i.itemId === itemId);
    if (!existing || existing.quantity < 1) {
      return { success: false, message: "Você não possui este item." };
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
      message: `${item.name} vendido por ${item.sellPrice}G!`,
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
