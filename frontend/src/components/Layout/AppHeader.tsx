import {
  ArrowsLeftRight,
  ChartBar,
  ChartLineUp,
  Tag,
  UsersThree,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import styles from "./AppHeader.module.css";

const navItems = [
  { label: "Pessoas", path: "/", icon: UsersThree },
  { label: "Categorias", path: "/categorias", icon: Tag },
  { label: "Transações", path: "/transacoes", icon: ArrowsLeftRight },
  { label: "Relatório Pessoas", path: "/relatorio/pessoas", icon: ChartBar },
  {
    label: "Relatório Categorias",
    path: "/relatorio/categorias",
    icon: ChartLineUp,
  },
];

function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>Sistema Financeiro</div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
              end={item.path === "/"}
            >
              <Icon size={18} weight="bold" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}

export default AppHeader;
