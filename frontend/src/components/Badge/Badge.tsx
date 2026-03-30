import clsx from "clsx";
import styles from "./Badge.module.css";

type BadgeTone = "success" | "danger" | "neutral" | "primary";

type Props = {
  label: string;
  tone?: BadgeTone;
  className?: string;
};

function Badge({ label, tone = "neutral", className }: Props) {
  return (
    <span className={clsx(styles.badge, styles[tone], className)}>{label}</span>
  );
}

export default Badge;
