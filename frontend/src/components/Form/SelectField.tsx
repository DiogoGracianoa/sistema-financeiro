import clsx from "clsx";
import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";
import styles from "./SelectField.module.css";

export type SelectOption = {
  value: string | number;
  label: string;
};

type SelectFieldProps = PropsWithChildren<
  Omit<HTMLAttributes<HTMLButtonElement>, "onChange"> & {
    label: string;
    helper?: string;
    error?: string;
    options: SelectOption[];
    value?: string | number;
    placeholder?: string;
    onChange?: (value: string | number) => void;
    name?: string;
    onBlur?: () => void;
  }
>;

function SelectField({
  label,
  helper,
  error,
  options,
  value,
  placeholder = "Selecione",
  onChange,
  onBlur,
  className,
  name,
  ...buttonProps
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<{
    width: number;
    left: number;
    top: number;
  } | null>(null);

  const selected = options.find((option) => option.value === value);

  function handleSelect(option: SelectOption) {
    onChange?.(option.value);
    setIsOpen(false);
    onBlur?.();
  }

  function openMenu() {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setMenuStyle({ width: rect.width, left: rect.left, top: rect.bottom + 6 });
    setIsOpen(true);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      const target = event.target as Node;
      const clickInsideTrigger = containerRef.current.contains(target);
      const clickInsideMenu = menuRef.current?.contains(target) ?? false;
      if (!clickInsideTrigger && !clickInsideMenu) {
        setIsOpen(false);
        onBlur?.();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        onBlur?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onBlur]);

  useEffect(() => {
    function syncPosition() {
      if (!isOpen || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({
        width: rect.width,
        left: rect.left,
        top: rect.bottom + 6,
      });
    }

    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, true);
    return () => {
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition, true);
    };
  }, [isOpen]);

  return (
    <label className={styles.field} ref={containerRef}>
      <span className={styles.label}>{label}</span>
      <button
        type="button"
        name={name}
        className={clsx(styles.trigger, className, {
          [styles.error]: Boolean(error),
          [styles.open]: isOpen,
        })}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            openMenu();
          }
        }}
        {...buttonProps}
        ref={triggerRef}
      >
        <span
          className={clsx(styles.value, { [styles.placeholder]: !selected })}
        >
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.chevron} aria-hidden>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="#677082"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen &&
        menuStyle &&
        createPortal(
          <div
            className={styles.menu}
            role="listbox"
            style={{
              width: menuStyle.width,
              left: menuStyle.left,
              top: menuStyle.top,
            }}
            ref={menuRef}
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={clsx(styles.option, {
                    [styles.optionSelected]: isSelected,
                  })}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                >
                  <span>{option.label}</span>
                  {isSelected && <span className={styles.checkmark}>✓</span>}
                </button>
              );
            })}
          </div>,
          document.body,
        )}

      {helper && !error && <span className={styles.helper}>{helper}</span>}
      {error && <span className={styles.errorText}>{error}</span>}
    </label>
  );
}

export default SelectField;
