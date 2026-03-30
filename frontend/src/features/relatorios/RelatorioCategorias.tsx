import AlertBox from "@components/Alert/AlertBox";
import Amount from "@components/Amount/Amount";
import Badge from "@components/Badge/Badge";
import Table, { type TableColumn } from "@components/Table/Table";
import { FinalidadeCategoria } from "@features/categorias/types";
import { formatCurrencyBRL } from "@utils/format";
import { useEffect, useMemo, useState } from "react";
import { useRelatorioTotaisPorCategoria } from "./hooks/useRelatorios";
import styles from "./RelatorioCategorias.module.css";
import type { RelatorioCategoriaItem, RelatorioTotalGeral } from "./types";

type LinhaRelatorio = RelatorioCategoriaItem & {
  isTotal?: boolean;
};

const finalidadeLabel = {
  [FinalidadeCategoria.Despesa]: "Despesa",
  [FinalidadeCategoria.Receita]: "Receita",
  [FinalidadeCategoria.Ambas]: "Ambas",
};

function RelatorioCategorias() {
  const {
    data,
    isLoading,
    isError,
    error: relatorioError,
  } = useRelatorioTotaisPorCategoria();

  const [listError, setListError] = useState<string | null>(null);
  const [showListError, setShowListError] = useState(false);

  useEffect(() => {
    if (isError) {
      setListError(
        (relatorioError as Error)?.message ?? "Tente novamente mais tarde.",
      );
      setShowListError(true);
    } else {
      setListError(null);
      setShowListError(false);
    }
  }, [isError, relatorioError]);

  const tableData: LinhaRelatorio[] = useMemo(() => {
    const itens = data?.categorias ?? [];
    const linhas = [...itens];

    if (data?.totalGeral) {
      linhas.push({
        id: -1,
        descricao: "TOTAL GERAL",
        idFinalidade: 0,
        receitas: data.totalGeral.receitas,
        despesas: data.totalGeral.despesas,
        saldo: data.totalGeral.saldo,
        isTotal: true,
      });
    }

    return linhas;
  }, [data]);

  const totalGeral: RelatorioTotalGeral = data?.totalGeral ?? {
    receitas: 0,
    despesas: 0,
    saldo: 0,
  };

  const columns: Array<TableColumn<LinhaRelatorio>> = useMemo(
    () => [
      {
        key: "descricao",
        label: "Descrição",
        width: "30%",
        render: (item) => (
          <span className={item.isTotal ? styles.totalsRow : undefined}>
            {item.descricao}
          </span>
        ),
      },
      {
        key: "idFinalidade",
        label: "Finalidade",
        width: "15%",
        render: (item) =>
          item.isTotal ? null : (
            <Badge
              label={
                finalidadeLabel[item.idFinalidade as FinalidadeCategoria] ?? "-"
              }
              tone={
                item.idFinalidade === FinalidadeCategoria.Despesa
                  ? "danger"
                  : item.idFinalidade === FinalidadeCategoria.Receita
                    ? "success"
                    : "neutral"
              }
            />
          ),
      },
      {
        key: "receitas",
        label: "Receitas",
        width: "20%",
        render: (item) => <Amount value={item.receitas} />,
      },
      {
        key: "despesas",
        label: "Despesas",
        width: "20%",
        render: (item) => <Amount value={item.despesas} tone="negative" />,
      },
      {
        key: "saldo",
        label: "Saldo",
        width: "15%",
        render: (item) => <Amount value={item.saldo} />,
      },
    ],
    [],
  );

  return (
    <div className={styles.page}>
      <div className="section-title">
        <div>
          <h1>Relatório de Totais por Categoria</h1>
          <p className="section-subtitle">
            Visualize o total de receitas, despesas e saldo de cada categoria
            cadastrada.
          </p>
        </div>
      </div>

      {isError && showListError && (
        <AlertBox
          title="Erro ao carregar relatório."
          message={
            listError ?? "Recarregue a página ou tente novamente mais tarde."
          }
          onClose={() => setShowListError(false)}
        />
      )}

      <div className="card">
        <div className={styles.tableWrapper}>
          <Table
            columns={columns}
            data={tableData}
            loading={isLoading}
            emptyMessage="Nenhuma categoria cadastrada ainda."
            rowKey={(item) => `${item.id}-${item.isTotal ? "total" : "row"}`}
          />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total de Receitas</span>
          <span className={`${styles.statValue} ${styles.positive}`}>
            {formatCurrencyBRL(totalGeral.receitas)}
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total de Despesas</span>
          <span className={`${styles.statValue} ${styles.negative}`}>
            {formatCurrencyBRL(totalGeral.despesas)}
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statTitle}>Saldo Líquido</span>
          <span
            className={`${styles.statValue} ${
              totalGeral.saldo >= 0 ? styles.positive : styles.negative
            }`}
          >
            {formatCurrencyBRL(totalGeral.saldo)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RelatorioCategorias;
