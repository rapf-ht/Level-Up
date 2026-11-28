import { useEffect, useState } from "react";
import styles from "./BazarMagico.module.css";
import { EQUIPMENT_SLOTS, ItemManager, SHOP_CATALOG } from "../manager/ItemManager";
import { useGameData } from "../hooks/useGameData";
import { CheckIcon } from "../components/PixelIcons";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EmptyState } from "../components/EmptyState";

// Categorias do Bazar, pelo lugar onde o item vai: consumível, no corpo, atrás do personagem ou ao lado dele.
const CATEGORIES = [
  { value: null, label: "Todos" },
  { value: "pocoes", label: "Poções" },
  { value: "equipamentos", label: "Equipamentos" },
  { value: "cenarios", label: "Cenários" },
  { value: "mascotes", label: "Mascotes" },
];

function categoryOf(item) {
  if (!item.slot) return "pocoes";
  if (item.slot === "cenario") return "cenarios";
  if (item.slot === "pet") return "mascotes";
  if (item.slot === "casa") return "casas";
  return "equipamentos";
}

// Etiqueta do cartão: o espaço do equipamento (Capacete, Arma...) ou a categoria
function tagFor(item) {
  if (!item.slot) return "Poção";
  if (item.slot === "cenario") return "Cenário";
  if (item.slot === "pet") return "Mascote";
  const label = EQUIPMENT_SLOTS.find((slot) => slot.id === item.slot)?.label ?? item.slot;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function ItemCard({ item, owned, price, priceShort, action }) {
  return (
    <article className={`panel ${styles.card}`}>
      <div className={`shelf ${styles.picture}`}>
        <img src={item.icon} alt={item.name} className={priceShort ? styles.dimmed : undefined} />
        <span className={styles.tag}>{tagFor(item)}</span>
        {owned > 0 && <span className={styles.owned}>Você tem {owned}</span>}
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
  const [pending, setPending] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    // Avisos com botão ficam mais tempo na tela, para dar tempo de usar o botão
    const timer = setTimeout(() => setToast(null), toast.equipId ? 7000 : 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const matches = (item) => !filter || categoryOf(item) === filter;
  const inventory = ItemManager.getInventoryWithDetails();
  const source = mode === "comprar" ? SHOP_CATALOG : inventory;
  const countIn = (value) => source.filter((item) => !value || categoryOf(item) === value).length;
  const shopItems = SHOP_CATALOG.filter(matches);
  const sellItems = inventory.filter(matches);

  return (
    <div className="page">
      <section className="page-head">
        <div>
          <h1 className="title">Bazar Mágico</h1>
          <p className="lead">Troque o ouro das suas missões por poções, armas, roupas e mascotes.</p>
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

      <nav aria-label="Categorias" className={styles.filters}>
        {CATEGORIES.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={filter === item.value}
            className={`${styles.filter} ${filter === item.value ? styles.filterActive : ""}`}
            onClick={(event) => {
              setFilter(item.value);
              // No celular a faixa de categorias rola para o lado: traz a escolhida para a vista
              event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" });
            }}
          >
            {item.label} <span className={styles.filterCount}>{countIn(item.value)}</span>
          </button>
        ))}
      </nav>

      {mode === "comprar" && (
        shopItems.length === 0 ? (
          <EmptyState art="bau">Não há itens desse tipo à venda no momento. Confira as outras categorias.</EmptyState>
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
                        onClick={() => setPending(item)}
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
          <EmptyState art="mochila">Você ainda não tem nada desse tipo para vender. Os itens comprados aparecem aqui.</EmptyState>
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

      <ConfirmDialog
        open={Boolean(pending)}
        title={pending ? `Comprar ${pending.name}?` : ""}
        confirmLabel={pending ? `Comprar por ${pending.price} G` : "Comprar"}
        onCancel={() => setPending(null)}
        onConfirm={() => {
          const result = ItemManager.buyItem(pending.id);
          setToast(result.success && pending.slot ? { ...result, equipId: pending.id, message: `Compra concluída: ${pending.name} está na sua mochila.` } : result);
          setPending(null);
        }}
      >
        {pending && (
          <>
            <div className={styles.confirmItem}>
              <img src={pending.icon} alt="" />
              <p>{pending.description}</p>
            </div>
            <dl className={styles.ledger}>
              <div><dt>Seu ouro agora</dt><dd>{player.gold} G</dd></div>
              <div><dt>Preço</dt><dd>-{pending.price} G</dd></div>
              <div className={styles.ledgerTotal}><dt>Depois da compra</dt><dd>{player.gold - pending.price} G</dd></div>
            </dl>
          </>
        )}
      </ConfirmDialog>

      {toast && (
        <div role="status" className={`toast ${toast.success ? "" : "toast-error"}`}>
          {toast.success && <CheckIcon size={16} />}
          <span className={styles.toastText}>{toast.message}</span>
          {toast.equipId && (
            <button
              type="button"
              className={styles.toastAction}
              onClick={() => setToast(ItemManager.equipItem(toast.equipId))}
            >
              Equipar agora
            </button>
          )}
        </div>
      )}
    </div>
  );
}
