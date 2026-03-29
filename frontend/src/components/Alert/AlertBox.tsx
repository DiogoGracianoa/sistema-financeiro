import { X } from "@phosphor-icons/react";
import clsx from "clsx";
import type { PropsWithChildren, ReactNode } from "react";
import styles from "./AlertBox.module.css";

type AlertVariant = "danger" | "info";

type AlertBoxProps = PropsWithChildren<{
  title: string;
  message?: ReactNode;
  onClose?: () => void;
  role?: "alert" | "status";
  variant?: AlertVariant;
  className?: string;
}>;

function AlertBox({
  title,
  message,
  onClose,
  role = "alert",
  variant = "danger",
  className,
  children,
}: AlertBoxProps) {
  return (
    <div className={clsx(styles.alert, styles[variant], className)} role={role}>
      {onClose && (
        <button
          type="button"
          className={styles.closeButton}
          aria-label="Fechar alerta"
          onClick={onClose}
        >
          <X size={16} weight="bold" />
        </button>
      )}
      <strong>{title}</strong>
      {message && <span>{message}</span>}
      {children}
    </div>
  );
}

export default AlertBox;
