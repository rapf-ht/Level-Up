import { useState, useEffect } from "react";
import styles from "./BazarMagico.module.css";
import { MissionManager } from "../manager/MissionManager";
import {
  ItemManager,
  SHOP_CATALOG,
  ITEM_TYPE_LABELS,
} from "../manager/ItemManager";

const FILTER_TYPES = Object.keys(ITEM_TYPE_LABELS);

export default function BazarMagico() {
  const [activeTab, setActiveTab] = useState("compra");
  const [activeFilter, setActiveFilter] = useState(null);
  const [player, setPlayer] = useState(MissionManager.getPlayerState());
  const [inventory, setInventory] = useState([]);
  const [toast, setToast] = useState(null); 

  useEffect(() => {
    const sync = () => {
      setPlayer(MissionManager.getPlayerState());
      setInventory(ItemManager.getInventoryWithDetails());
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

  function showToast(message, success) {
    setToast({ message, success });
  }

  function handleBuy(itemId) {
    const result = ItemManager.buyItem(itemId);
    showToast(result.message, result.success);
  }

  function handleSell(itemId) {
    const result = ItemManager.sellItem(itemId);
    showToast(result.message, result.success);
  }

  const shopItems = activeFilter
    ? SHOP_CATALOG.filter((i) => i.type === activeFilter)
    : SHOP_CATALOG;

  const sellItems = activeFilter
    ? inventory.filter((i) => i.type === activeFilter)
    : inventory;

  const qty = (itemId) => ItemManager.getItemQuantity(itemId);

  const xpNeeded = player.level * 100;
  const hpPct = Math.min((player.hp / player.maxHp) * 100, 100);
  const xpPct = Math.min((player.xp / xpNeeded) * 100, 100);

  return (
    <div className={styles.page}>
      {/*  Banner  */}
      <div className={styles.banner}>
        <img
          src="/banners/banner_bazar.png"
          alt="Bazar Mágico"
          className={styles.bannerImg}
        />
      </div>

      {/*  Toast  */}
      {toast && (
        <div
          className={`${styles.toast} ${toast.success ? styles.toastSuccess : styles.toastError}`}
        >
          {toast.message}
        </div>
      )}

      <div className={styles.layout}>
        {/*  SIDEBAR  */}
        <aside className={styles.sidebar}>
          {/* Perfil */}
          <div className={styles.profileCard}>
            <img
              src="/avatar-icon.png"
              alt="Avatar"
              className={styles.avatar}
            />
            <p className={styles.profileName}>Dev_BR</p>
            <p className={styles.profileLevel}>Level {player.level}</p>
            <div className={styles.bars}>
              <div className={styles.barRow}>
                <span className={styles.barLabel}>HP</span>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFillHp}
                    style={{ width: `${hpPct}%` }}
                  />
                </div>
              </div>
              <div className={styles.barRow}>
                <span className={`${styles.barLabel} ${styles.xpColor}`}>
                  XP
                </span>
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
            <p className={styles.filterSubtitle}>Tipo</p>
            <div className={styles.filterList}>
              <label className={styles.filterItem}>
                <input
                  type="radio"
                  name="filter"
                  checked={activeFilter === null}
                  onChange={() => setActiveFilter(null)}
                  className={styles.radio}
                />
                <span>Todos</span>
              </label>
              {FILTER_TYPES.map((type) => (
                <label key={type} className={styles.filterItem}>
                  <input
                    type="radio"
                    name="filter"
                    checked={activeFilter === type}
                    onChange={() => setActiveFilter(type)}
                    className={styles.radio}
                  />
                  <span>{ITEM_TYPE_LABELS[type]}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/*  CONTEÚDO  */}
        <main className={styles.main}>
          {/*  Header tabs + saldo */}
          <div className={styles.shopHeader}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === "compra" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("compra")}
              >
                Compra
              </button>
              <button
                className={`${styles.tab} ${activeTab === "venda" ? styles.tabActive : ""}`}
                onClick={() => setActiveTab("venda")}
              >
                Venda
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

          {/* Grid de itens */}
          {activeTab === "compra" && (
            <>
              {shopItems.length === 0 ? (
                <p className={styles.empty}>Nenhum item nesta categoria.</p>
              ) : (
                <div className={styles.grid}>
                  {shopItems.map((item) => {
                    const owned = qty(item.id);
                    const canAfford = player.gold >= item.price;
                    return (
                      <div key={item.id} className={styles.itemCard}>
                        {owned > 0 && (
                          <span className={styles.ownedBadge}>{owned}x</span>
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
                        <p className={styles.itemDesc}>{item.description}</p>
                        <button
                          className={`${styles.buyBtn} ${!canAfford ? styles.buyBtnDisabled : ""}`}
                          onClick={() => handleBuy(item.id)}
                          disabled={!canAfford}
                          title={
                            !canAfford
                              ? "Ouro insuficiente"
                              : `Comprar por ${item.price}G`
                          }
                        >
                          {item.price}G
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === "venda" && (
            <>
              {sellItems.length === 0 ? (
                <p className={styles.empty}>
                  Seu inventário está vazio.{" "}
                  <button
                    className={styles.linkBtn}
                    onClick={() => setActiveTab("compra")}
                  >
                    Compre alguns itens!
                  </button>
                </p>
              ) : (
                <div className={styles.grid}>
                  {sellItems.map((item) => (
                    <div key={item.id} className={styles.itemCard}>
                      <span className={styles.ownedBadge}>
                        {item.quantity}x
                      </span>
                      <img
                        src={item.icon}
                        alt={item.name}
                        className={styles.itemIcon}
                        onError={(e) => {
                          e.currentTarget.src = "/pocao.png";
                        }}
                      />
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemDesc}>{item.description}</p>
                      <button
                        className={`${styles.buyBtn} ${styles.sellBtn}`}
                        onClick={() => handleSell(item.id)}
                        title={`Vender por ${item.sellPrice}G`}
                      >
                        Vender — {item.sellPrice}G
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}