import { formatCurrencyBRL } from "@utils/format";
import clsx from "clsx";
import styles from "./Amount.module.css";

type Tone = "auto" | "positive" | "negative";

type Props = {
  value: number;
  className?: string;
  tone?: Tone; // force color independent of sign when needed
};

function Amount({ value, className, tone = "auto" }: Props) {
  const isPositive =
    tone === "negative" ? false : tone === "positive" ? true : value >= 0;
  return (
    <span
      className={clsx(
        styles.value,
        isPositive ? styles.positive : styles.negative,
        className,
      )}
    >
      {formatCurrencyBRL(value)}
    </span>
  );
}

export default Amount;
