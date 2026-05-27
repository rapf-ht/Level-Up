import styles from "./Calendar.module.css";

const getDaysInMounth = (mount, year) => {
  const date = new Date(year, mount, 1);
  const days = [];

  const firstDay = date.getDay();

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  while (date.getMonth() === mount) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export function Calendar() {
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
  const [, mount, year] = new Date()
    .toLocaleDateString("pt-BR")
    .split("/")
    .map(Number);
  const dias = getDaysInMounth(mount - 1, year);
  const hoje = new Date();

  return (
    <div className={styles.frameWood}>
      <div className={styles.gridCalendar}>
        {diasSemana.map((d) => (
          <div key={d} className={styles.header}>
            {d}
          </div>
        ))}
        {dias.map((d, i) => {
          const isHoje =
            d &&
            d.getDate() === hoje.getDate() &&
            d.getMonth() === hoje.getMonth() &&
            d.getFullYear() === hoje.getFullYear();

          return (
            <div
              key={i}
              className={`
                ${styles.cell} 
                ${!d ? styles.void : ""} 
                ${isHoje ? styles.activeDay : ""}
              `}
            >
              {d && <span className={styles.numeroGrande}>{d.getDate()}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
