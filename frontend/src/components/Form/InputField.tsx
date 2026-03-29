import clsx from "clsx";
import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./InputField.module.css";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
  error?: string;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, helper, error, className, ...props }, ref) => {
    return (
      <label className={styles.field}>
        <span className={styles.label}>{label}</span>
        <input
          ref={ref}
          className={clsx(styles.input, className, {
            [styles.error]: Boolean(error),
          })}
          {...props}
        />
        {helper && !error && <span className={styles.helper}>{helper}</span>}
        {error && <span className={styles.errorText}>{error}</span>}
      </label>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
