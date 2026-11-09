import { useEffect, useState } from "react";
import styles from "./BazarMagico.module.css";
import { ItemManager, SHOP_CATALOG } from "../manager/ItemManager";
import { useGameData } from "../hooks/useGameData";
import { CheckIcon } from "../components/PixelIcons";

const FILTERS = [
  { value: null, label: "TODOS" },
  { value: "pocoes", label: "POÇÕES", tag: "POÇÃO" },
  { value: "armas", label: "ARMAS", tag: "ARMA" },
  { value: "armaduras", label: "ARMADURAS", tag: "ARMADURA" },
  { value: "aparencia", label: "APARÊNCIA", tag: "APARÊNCIA" },
  { value: "mascotes", label: "MASCOTES", tag: "MASCOTE" },
  { value: "ovos", label: "OVOS", tag: "OVO" },
  { value: "casas", label: "CASAS", tag: "CASA" },
];

const tagFor = (type) => FILTERS.find((filter) => filter.value === type)?.tag ?? type.toUpperCase();

function ItemCard({ item, owned, price, priceShort, action }) {
  return (
    <article className={`panel ${styles.card}`}>
      <div className={styles.picture}>
        <img src={item.icon} alt={item.name} className={priceShort ? styles.dimmed : undefined} />
        <span className={styles.tag}>{tagFor(item.type)}</span>
        {owned > 0 && <span className={styles.owned}>VOCÊ TEM {owned}</span>}
      </div>
      <div className={styles.body}>
        <h2 className={styles.name}>{item.name}</h2>
        <p className={styles.description}>{item.description}</p>
        <div className={styles.footer}>
          <span className={`${styles.price} ${priceShort ? styles.priceShort : ""}`}>
            <img src="/ui/coin.svg" alt="" width="18" height="18" className="pixel-img" />
            <span className="sr-only">Preço:</span>
            {price}
          </span>
          {action}
        </div>
      </div>
    </article>
  );
}

export default function BazarMagico() {
  const { player } = useGameData();
  const [mode, setMode] = useState("comprar");
  const [filter, setFilter] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const matches = (item) => !filter || item.type === filter;
  const shopItems = SHOP_CATALOG.filter(matches);
  const sellItems = ItemManager.getInventoryWithDetails().filter(matches);

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <p className="eyebrow">LOJA</p>
          <h1 className="title">Bazar Mágico</h1>
          <p className="lead">Troque o ouro das suas missões por itens e equipamentos.</p>
        </div>
        <div role="tablist" aria-label="Modo" className={styles.modes}>
          {[["comprar", "Comprar"], ["vender", "Vender"]].map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={mode === value}
              className={`${styles.mode} ${mode === value ? styles.modeActive : ""}`}
              onClick={() => setMode(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <nav aria-label="Tipo de item" className={styles.filters}>
        {FILTERS.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={filter === item.value}
            className={`${styles.filter} ${filter === item.value ? styles.filterActive : ""}`}
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {mode === "comprar" && (
        shopItems.length === 0 ? (
          <p className="empty">Nenhum item deste tipo à venda no momento.</p>
        ) : (
          <div className={styles.grid}>
            {shopItems.map((item) => {
              const missing = item.price - player.gold;
              return (
                <ItemCard
                  key={item.id}
                  item={item}
                  owned={ItemManager.getItemQuantity(item.id)}
                  price={item.price}
                  priceShort={missing > 0}
                  action={
                    missing > 0 ? (
                      <button type="button" className="btn btn-sm" disabled>Faltam {missing} G</button>
                    ) : (
                      <button
                        type="button"
                        className={`btn btn-sm btn-primary ${styles.buy}`}
                        onClick={() => setToast(ItemManager.buyItem(item.id))}
                      >
                        Comprar
                      </button>
                    )
                  }
                />
              );
            })}
          </div>
        )
      )}

      {mode === "vender" && (
        sellItems.length === 0 ? (
          <p className="empty">Você ainda não tem itens deste tipo. Compre no Bazar para vender depois.</p>
        ) : (
          <div className={styles.grid}>
            {sellItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                owned={item.quantity}
                price={item.sellPrice}
                action={
                  <button
                    type="button"
                    className="btn btn-sm btn-outline"
                    onClick={() => setToast(ItemManager.sellItem(item.id))}
                  >
                    Vender
                  </button>
                }
              />
            ))}
          </div>
        )
      )}

      {toast && (
        <div role="status" className={`toast ${toast.success ? "" : "toast-error"}`}>
          {toast.success && <CheckIcon size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
}
