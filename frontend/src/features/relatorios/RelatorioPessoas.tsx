import AlertBox from "@components/Alert/AlertBox";
import Table, { type TableColumn } from "@components/Table/Table";
import { usePessoas } from "@features/pessoas/hooks/usePessoas";
import { useEffect, useMemo, useState } from "react";
import { useRelatorioTotaisPorPessoa } from "./hooks/useRelatorios";
import styles from "./RelatorioPessoas.module.css";
import type { RelatorioPessoaItem, RelatorioTotalGeral } from "./types";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

type LinhaRelatorio = RelatorioPessoaItem & {
  idade?: number;
  isTotal?: boolean;
};

function RelatorioPessoas() {
  const {
    data,
    isLoading,
    isError,
    error: relatorioError,
  } = useRelatorioTotaisPorPessoa();
  const { data: pessoas = [] } = usePessoas();

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

  const pessoasIdadeMap = useMemo(
    () => new Map(pessoas.map((pessoa) => [pessoa.id, pessoa.idade])),
    [pessoas],
  );

  const tableData: LinhaRelatorio[] = useMemo(() => {
    const itens = data?.pessoas ?? [];
    const linhas = itens.map((item) => ({
      ...item,
      idade: pessoasIdadeMap.get(item.id),
    }));

    if (data?.totalGeral) {
      linhas.push({
        id: -1,
        nome: "TOTAL GERAL",
        receitas: data.totalGeral.receitas,
        despesas: data.totalGeral.despesas,
        saldo: data.totalGeral.saldo,
        isTotal: true,
      });
    }

    return linhas;
  }, [data, pessoasIdadeMap]);

  const totalGeral: RelatorioTotalGeral = data?.totalGeral ?? {
    receitas: 0,
    despesas: 0,
    saldo: 0,
  };

  const columns: Array<TableColumn<LinhaRelatorio>> = useMemo(
    () => [
      {
        key: "nome",
        label: "Nome",
        width: "30%",
        render: (item) => (
          <span className={item.isTotal ? styles.totalsRow : undefined}>
            {item.nome}
          </span>
        ),
      },
      {
        key: "idade",
        label: "Idade",
        width: "10%",
        render: (item) =>
          item.idade !== undefined ? `${item.idade} anos` : "—",
      },
      {
        key: "receitas",
        label: "Receitas",
        width: "20%",
        render: (item) => (
          <span
            className={
              item.receitas >= 0 ? styles.amountPositive : styles.amountNegative
            }
          >
            {currency.format(item.receitas)}
          </span>
        ),
      },
      {
        key: "despesas",
        label: "Despesas",
        width: "20%",
        render: (item) => (
          <span
            className={
              item.despesas >= 0 ? styles.amountNegative : styles.amountPositive
            }
          >
            {currency.format(item.despesas)}
          </span>
        ),
      },
      {
        key: "saldo",
        label: "Saldo",
        width: "20%",
        render: (item) => (
          <span
            className={
              item.saldo >= 0 ? styles.amountPositive : styles.amountNegative
            }
          >
            {currency.format(item.saldo)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className={styles.page}>
      <div className="section-title">
        <div>
          <h1>Relatório de Totais por Pessoa</h1>
          <p className="section-subtitle">
            Visualize o total de receitas, despesas e saldo de cada pessoa
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
            emptyMessage="Nenhuma pessoa cadastrada ainda."
            rowKey={(item) => `${item.id}-${item.isTotal ? "total" : "row"}`}
          />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total de Receitas</span>
          <span className={`${styles.statValue} ${styles.positive}`}>
            {currency.format(totalGeral.receitas)}
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statTitle}>Total de Despesas</span>
          <span className={`${styles.statValue} ${styles.negative}`}>
            {currency.format(totalGeral.despesas)}
          </span>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statTitle}>Saldo Líquido</span>
          <span
            className={`${styles.statValue} ${
              totalGeral.saldo >= 0 ? styles.positive : styles.negative
            }`}
          >
            {currency.format(totalGeral.saldo)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default RelatorioPessoas;
