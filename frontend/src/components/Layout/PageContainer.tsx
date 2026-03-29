import { type PropsWithChildren } from "react";
import styles from "./PageContainer.module.css";

function PageContainer({ children }: PropsWithChildren) {
  return <main className={styles.container}>{children}</main>;
}

export default PageContainer;
