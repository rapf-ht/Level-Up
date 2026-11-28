import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Perfil.module.css";
import { ItemManager, EQUIPMENT_SLOTS } from "../manager/ItemManager";
import { useGameData } from "../hooks/useGameData";
import { getProfile } from "../data/profile";
import { PlayerBars } from "../components/PixelBar";
import { CheckIcon, CloseIcon } from "../components/PixelIcons";
import { Avatar } from "../components/Avatar";
import { EmptyState } from "../components/EmptyState";

const BACKPACK_SIZE = 24;

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Slot({ slot, selected, onSelect }) {
  const item = ItemManager.getEquippedItemInSlot(slot.id);
  const name = capitalize(slot.label);
  return (
    <button
      type="button"
      aria-label={`${name}: ${item ? item.name : "vazio"}`}
      aria-expanded={selected}
      className={`${styles.slot} ${item ? styles.slotFilled : ""} ${selected ? styles.slotSelected : ""}`}
      onClick={() => onSelect(selected ? null : slot.id)}
    >
      {item ? <img src={item.icon} alt="" /> : capitalize(slot.label)}
    </button>
  );
}

export default function Perfil() {
  const { player, history } = useGameData();
  const profile = getProfile();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const inventory = ItemManager.getInventoryWithDetails();
  const equipped = ItemManager.getEquipped();
  const completed = history.filter((h) => h.kind === "done");
  const failed = history.filter((h) => h.kind === "miss");
  const totalXp = completed.reduce((sum, h) => sum + (h.xp || 0), 0);
  const totalGold = completed.reduce((sum, h) => sum + (h.gold || 0), 0);

  const stats = [
    { label: "XP acumulado", value: totalXp },
    { label: "Ouro acumulado", value: `${totalGold} G`, color: "var(--gold)" },
    { label: "Missões cumpridas", value: completed.length, color: "var(--ok-text)" },
    { label: "Diárias esquecidas", value: failed.length, color: "var(--hp-text)" },
    { label: "Ouro em carteira", value: `${player.gold} G`, color: "var(--gold)" },
  ];

  const left = EQUIPMENT_SLOTS.filter((slot) => slot.side === "left");
  const right = EQUIPMENT_SLOTS.filter((slot) => slot.side === "right");
  const slotItems = inventory.filter((item) => item.slot === selectedSlot);
  const inSlot = selectedSlot ? ItemManager.getEquippedItemInSlot(selectedSlot) : null;
  const selectedLabel = EQUIPMENT_SLOTS.find((slot) => slot.id === selectedSlot)?.label;

  function equip(item) {
    setToast(ItemManager.equipItem(item.id));
    setSelectedSlot(null);
  }

  function unequip(slotId, item) {
    ItemManager.unequipSlot(slotId);
    setToast({ success: true, message: `Item removido: ${item.name}.` });
    setSelectedSlot(null);
  }

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">{profile.playerClass} de nível {player.level}</p>
          <h1 className="title">{profile.name}</h1>
        </div>
        <div className={styles.headActions}>
          <Link to="/premium" className="btn btn-outline">Virar Patrono</Link>
          <Link to="/configuracoes" className="btn">Configurações</Link>
        </div>
      </section>

      <div className={styles.top}>
        <section aria-label="Equipamento" className={`frame ${styles.equipment}`}>
          <div className={styles.stageRow}>
            <div className={styles.slots}>
              {left.map((slot) => (
                <Slot key={slot.id} slot={slot} selected={selectedSlot === slot.id} onSelect={setSelectedSlot} />
              ))}
            </div>
            <div className={styles.stage}>
              <Avatar equipped={equipped} size={256} label={`Seu personagem, ${profile.playerClass}`} className={styles.avatar} />
            </div>
            <div className={styles.slots}>
              {right.map((slot) => (
                <Slot key={slot.id} slot={slot} selected={selectedSlot === slot.id} onSelect={setSelectedSlot} />
              ))}
            </div>
          </div>

          {selectedSlot && (
            <div className={styles.picker}>
              <div className={styles.pickerHead}>
                <h2 className={styles.pickerTitle}>{capitalize(selectedLabel)}</h2>
                <button type="button" aria-label="Fechar" className={styles.pickerClose} onClick={() => setSelectedSlot(null)}>
                  <CloseIcon size={14} />
                </button>
              </div>
              {slotItems.length === 0 ? (
                <EmptyState art="mochila" compact size={48}>Você não tem itens para este espaço. Compre um no Bazar.</EmptyState>
              ) : (
                <div className={styles.pickerItems}>
                  {slotItems.map((item) =>
                    inSlot?.id === item.id ? (
                      <button key={item.id} type="button" className="btn btn-sm" onClick={() => unequip(selectedSlot, item)}>
                        <img src={item.icon} alt="" width="24" height="24" />
                        Desequipar {item.name}
                      </button>
                    ) : (
                      <button key={item.id} type="button" className="btn btn-sm btn-outline" onClick={() => equip(item)}>
                        <img src={item.icon} alt="" width="24" height="24" />
                        Equipar {item.name}
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        <section className={`panel ${styles.attributes}`}>
          <h2 className="h2">Atributos</h2>
          <PlayerBars player={player} />
          <dl className={styles.statList}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statRow}>
                <dt>{stat.label}</dt>
                <dd style={stat.color ? { color: stat.color } : undefined}>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className={`panel ${styles.backpack}`}>
        <div className={styles.backpackHead}>
          <h2 className="h2">Mochila</h2>
          <span className="meta">{inventory.length} de {BACKPACK_SIZE} espaços</span>
        </div>
        <div className={styles.backpackGrid}>
          {inventory.map((item) => {
            const isEquipped = item.slot && equipped[item.slot] === item.id;
            const content = (
              <>
                <img src={item.icon} alt="" />
                <span className={styles.quantity}>{item.quantity}</span>
                {isEquipped && <span className={styles.equippedMark}><CheckIcon size={10} /></span>}
              </>
            );
            const label = `${item.name}, ${item.quantity} ${item.quantity === 1 ? "unidade" : "unidades"}`;
            return item.slot ? (
              <button
                key={item.id}
                type="button"
                aria-label={`${label}. ${isEquipped ? "Desequipar" : "Equipar"}`}
                title={item.name}
                className={`slot ${styles.cell} ${styles.cellAction}`}
                data-equipped={isEquipped ? "true" : undefined}
                onClick={() => (isEquipped ? unequip(item.slot, item) : equip(item))}
              >
                {content}
              </button>
            ) : (
              <div key={item.id} role="img" aria-label={label} title={item.name} className={`slot ${styles.cell}`}>
                {content}
              </div>
            );
          })}
          {Array.from({ length: Math.max(BACKPACK_SIZE - inventory.length, 0) }, (_, i) => (
            <div key={i} className={`slot slot-empty ${styles.cellEmpty}`} />
          ))}
        </div>
      </section>

      {toast && (
        <div role="status" className={`toast ${toast.success ? "" : "toast-error"}`}>
          {toast.success && <CheckIcon size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
