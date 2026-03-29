import { X } from "@phosphor-icons/react";
import { type PropsWithChildren, useEffect } from "react";
import styles from "./Modal.module.css";

export type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  width?: "md" | "lg";
}>;

function Modal({
  isOpen,
  title,
  subtitle,
  onClose,
  footer,
  width = "md",
  children,
}: ModalProps) {
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop}>
      <div
        className={`${styles.modal} ${styles[width]}`}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button
            className={styles.closeButton}
            aria-label="Fechar"
            onClick={onClose}
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
