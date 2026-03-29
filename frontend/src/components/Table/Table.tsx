import { type ReactNode } from "react";
import styles from "./Table.module.css";

export type TableColumn<T> = {
  key: string;
  label: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (item: T) => ReactNode;
};

type TableProps<T> = {
  columns: Array<TableColumn<T>>;
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: (item: T, index: number) => string | number;
};

function Table<T>({
  columns,
  data,
  loading,
  emptyMessage = "Sem dados para exibir.",
  rowKey,
}: TableProps<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  width: column.width,
                  textAlign: column.align ?? "left",
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                Carregando...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={rowKey ? rowKey(item, index) : index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{ textAlign: column.align ?? "left" }}
                  >
                    {column.render
                      ? column.render(item)
                      : ((item as Record<string, unknown>)[
                          column.key
                        ] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
