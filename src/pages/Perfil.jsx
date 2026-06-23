import { useState, useEffect } from "react";
import styles from "./Perfil.module.css";
import { MissionManager } from "../manager/MissionManager";
import {
  ItemManager,
  SHOP_CATALOG,
  EQUIPMENT_SLOTS,
  ITEM_TYPE_LABELS,
} from "../manager/ItemManager";

const PLAYER_NAME = "Jggranito";
const PLAYER_AVATAR = "/avatar-icon.png";
const PLAYER_CHARACTER = "/avatar.png";

const FILTER_TYPES = Object.keys(ITEM_TYPE_LABELS);

function computeStats(player) {
  const missions = MissionManager.getMissions();
  const completed = missions.filter((m) => m.status === "completed");
  const failed = missions.filter((m) => m.status === "failed");
  const totalXp = completed.reduce((acc, m) => acc + (m.xpReward || 0), 0);
  const totalGold = completed.reduce((acc, m) => acc + (m.goldReward || 0), 0);

  return [
    { label: "Nível atual", value: player.level },
    { label: "XP total acumulado", value: `${totalXp} XP` },
    { label: "Ouro acumulado", value: `${totalGold} G` },
    { label: "Missões concluídas", value: completed.length },
    { label: "Missões falhadas", value: failed.length },
    { label: "Total de missões", value: missions.length },
    { label: "Ouro em carteira", value: `${player.gold} G` },
    { label: "HP atual", value: `${player.hp} / ${player.maxHp}` },
  ];
}

export default function Perfil() {
  const [activeTab, setActiveTab] = useState("inventario");
  const [activeFilter, setActiveFilter] = useState(null);
  const [player, setPlayer] = useState(MissionManager.getPlayerState());
  const [inventory, setInventory] = useState([]);
  const [equipped, setEquipped] = useState(ItemManager.getEquipped());
  const [toast, setToast] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const sync = () => {
      setPlayer(MissionManager.getPlayerState());
      setInventory(ItemManager.getInventoryWithDetails());
      setEquipped(ItemManager.getEquipped());
    };
    sync();
    window.addEventListener("playerStateUpdated", sync);
    return () => window.removeEventListener("playerStateUpdated", sync);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(msg, success) {
    setToast({ message: msg, success });
  }

  function handleSlotClick(slotId) {
    const currentItem = ItemManager.getEquippedItemInSlot(slotId);
    if (currentItem) {
      if (selectedSlot === slotId) {
        const res = ItemManager.unequipSlot(slotId);
        if (res.success) showToast(`${currentItem.name} removido.`, true);
        setSelectedSlot(null);
      } else {
        setSelectedSlot(slotId);
      }
    } else {
      setSelectedSlot(selectedSlot === slotId ? null : slotId);
    }
  }

  function handleEquip(itemId) {
    const res = ItemManager.equipItem(itemId);
    showToast(res.message, res.success);
    setSelectedSlot(null);
  }

  function handleUnequip(slotId) {
    const item = ItemManager.getEquippedItemInSlot(slotId);
    ItemManager.unequipSlot(slotId);
    if (item) showToast(`${item.name} desequipado.`, true);
    setSelectedSlot(null);
  }

  const equipableForSlot = selectedSlot
    ? inventory.filter((i) => i.slot === selectedSlot)
    : [];

  const visibleInventory = activeFilter
    ? inventory.filter((i) => i.type === activeFilter)
    : inventory;

  const xpNeeded = player.level * 100;
  const hpPct = Math.min((player.hp / player.maxHp) * 100, 100);
  const xpPct = Math.min((player.xp / xpNeeded) * 100, 100);

  const leftSlots = EQUIPMENT_SLOTS.filter((s) => s.side === "left");
  const rightSlots = EQUIPMENT_SLOTS.filter((s) => s.side === "right");

  return (
    <div className={styles.page}>
      {/*  Toast  */}
      {toast && (
        <div
          className={`${styles.toast} ${toast.success ? styles.toastSuccess : styles.toastError}`}
        >
          {toast.message}
        </div>
      )}

      {/*  Título  */}
      <h1 className={styles.pageTitle}>Perfil</h1>

      {/*  PAINEL DO PERSONAGEM  */}
      <div className={styles.characterPanel}>
        {/* Coluna esquerda — slots */}
        <div className={styles.slotColumn}>
          {leftSlots.map((slot) => {
            const item = ItemManager.getEquippedItemInSlot(slot.id);
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                className={`${styles.slot} ${item ? styles.slotFilled : ""} ${isSelected ? styles.slotSelected : ""}`}
                onClick={() => handleSlotClick(slot.id)}
                title={
                  item
                    ? `${item.name} — clique para desequipar`
                    : `Slot: ${slot.label}`
                }
              >
                {item ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={styles.slotIcon}
                  />
                ) : (
                  <span className={styles.slotLabel}>[{slot.label}]</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Avatar central */}
        <div className={styles.characterCenter}>
          <img
            src={PLAYER_CHARACTER}
            alt="Personagem"
            className={styles.characterImg}
          />
        </div>

        {/* Coluna direita — slots */}
        <div className={styles.slotColumn}>
          {rightSlots.map((slot) => {
            const item = ItemManager.getEquippedItemInSlot(slot.id);
            const isSelected = selectedSlot === slot.id;
            return (
              <button
                key={slot.id}
                className={`${styles.slot} ${item ? styles.slotFilled : ""} ${isSelected ? styles.slotSelected : ""}`}
                onClick={() => handleSlotClick(slot.id)}
                title={
                  item
                    ? `${item.name} — clique para desequipar`
                    : `Slot: ${slot.label}`
                }
              >
                {item ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={styles.slotIcon}
                  />
                ) : (
                  <span className={styles.slotLabel}>[{slot.label}]</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Popup de itens equipáveis para o slot selecionado */}
      {selectedSlot && (
        <div className={styles.equipPopup}>
          <div className={styles.equipPopupHeader}>
            <p className={styles.equipPopupTitle}>
              Equipar no slot <strong>{selectedSlot}</strong>
            </p>
            {ItemManager.getEquippedItemInSlot(selectedSlot) && (
              <button
                className={styles.unequipBtn}
                onClick={() => handleUnequip(selectedSlot)}
              >
                Desequipar atual
              </button>
            )}
            <button
              className={styles.equipPopupClose}
              onClick={() => setSelectedSlot(null)}
            >
              ✕
            </button>
          </div>
          {equipableForSlot.length === 0 ? (
            <p className={styles.equipEmpty}>
              Nenhum item no inventário para este slot.
            </p>
          ) : (
            <div className={styles.equipGrid}>
              {equipableForSlot.map((item) => (
                <button
                  key={item.id}
                  className={`${styles.equipOption} ${equipped[item.slot] === item.id ? styles.equipOptionActive : ""}`}
                  onClick={() => handleEquip(item.id)}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={styles.equipOptionIcon}
                  />
                  <span>{item.name}</span>
                  {equipped[item.slot] === item.id && (
                    <span className={styles.equippedTag}>✓ Equipado</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/*  PAINEL INFERIOR  */}
      <div className={styles.lowerPanel}>
        {/*  Sidebar  */}
        <aside className={styles.sidebar}>
          {/* Mini perfil */}
          <div className={styles.profileCard}>
            <img src={PLAYER_AVATAR} alt="Avatar" className={styles.avatar} />
            <p className={styles.profileName}>{PLAYER_NAME}</p>
            <p className={styles.profileLevel}>Level {player.level}</p>
            <div className={styles.bars}>
              <div className={styles.barRow}>
                <span className={styles.barLabelHp}>HP</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFillHp}
                    style={{ width: `${hpPct}%` }}
                  />
                </div>
              </div>
              <div className={styles.barRow}>
                <span className={styles.barLabelXp}>XP</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFillXp}
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Filtrar</p>
            <p className={styles.filterSub}>Tipo</p>
            <div className={styles.filterList}>
              <label className={styles.filterItem}>
                <input
                  type="radio"
                  name="pf"
                  checked={activeFilter === null}
                  onChange={() => setActiveFilter(null)}
                  className={styles.radio}
                />
                <span>Todos</span>
              </label>
              {FILTER_TYPES.map((t) => (
                <label key={t} className={styles.filterItem}>
                  <input
                    type="radio"
                    name="pf"
                    checked={activeFilter === t}
                    onChange={() => setActiveFilter(t)}
                    className={styles.radio}
                  />
                  <span>{ITEM_TYPE_LABELS[t]}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/*  Conteúdo principal  */}
        <main className={styles.main}>
          {/* Header tabs + saldo */}
          <div className={styles.tabsRow}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === "inventario" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("inventario")}
              >
                Inventário
              </button>
              <button
                className={`${styles.tab} ${activeTab === "estatistica" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("estatistica")}
              >
                Estatística
              </button>
            </div>
            <div className={styles.balanceBadge}>
              <img
                src="/icons/sword_icon.svg"
                alt=""
                className={styles.badgeIcon}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className={styles.badgeStat}>4</span>
              <img
                src="/icons/Coin_icon.svg"
                alt="ouro"
                className={styles.badgeIcon}
              />
              <span className={styles.badgeGold}>{player.gold}</span>
            </div>
          </div>

          {/*  Aba Inventário  */}
          {activeTab === "inventario" && (
            <>
              {visibleInventory.length === 0 ? (
                <p className={styles.empty}>
                  {activeFilter
                    ? "Nenhum item desta categoria no inventário."
                    : "Inventário vazio. Vá ao Bazar Mágico!"}
                </p>
              ) : (
                <div className={styles.grid}>
                  {visibleInventory.map((item) => {
                    const isEquipped =
                      item.slot && equipped[item.slot] === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`${styles.itemCard} ${isEquipped ? styles.itemCardEquipped : ""}`}
                      >
                        {item.quantity > 1 && (
                          <span className={styles.qtyBadge}>
                            {item.quantity}x
                          </span>
                        )}
                        {isEquipped && (
                          <span className={styles.equippedBadge}>✓</span>
                        )}
                        <img
                          src={item.icon}
                          alt={item.name}
                          className={styles.itemIcon}
                          onError={(e) => {
                            e.currentTarget.src = "/pocao.png";
                          }}
                        />
                        <p className={styles.itemName}>{item.name}</p>
                        {item.slot ? (
                          <button
                            className={`${styles.actionBtn} ${isEquipped ? styles.actionBtnUnequip : ""}`}
                            onClick={() =>
                              isEquipped
                                ? handleUnequip(item.slot)
                                : handleEquip(item.id)
                            }
                          >
                            {isEquipped ? "Desequipar" : "Equipar"}
                          </button>
                        ) : (
                          <span className={styles.noSlotTag}>{item.type}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/*  Aba Estatística  */}
          {activeTab === "estatistica" && (
            <div className={styles.statsGrid}>
              {computeStats(player).map((stat) => (
                <div key={stat.label} className={styles.statCard}>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
