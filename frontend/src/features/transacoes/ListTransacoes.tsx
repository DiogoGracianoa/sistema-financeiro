import AlertBox from "@components/Alert/AlertBox";
import Button from "@components/Button/Button";
import Modal from "@components/Modal/Modal";
import Table, { type TableColumn } from "@components/Table/Table";
import { useDisclosure } from "@hooks/useDisclosure";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useCategorias } from "../categorias/hooks/useCategorias";
import { usePessoas } from "../pessoas/hooks/usePessoas";
import CreateTransacao, { type TransacaoFormValues } from "./CreateTransacao";
import { useCreateTransacao, useTransacoes } from "./hooks/useTransacoes";
import styles from "./ListTransacoes.module.css";
import { TipoTransacao, type Transacao } from "./types";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);

function ListTransacoes() {
  const {
    data: transacoes = [],
    isLoading: isLoadingTransacoes,
    isError: isErrorTransacoes,
    error: transacoesError,
  } = useTransacoes();
  const { data: categorias = [] } = useCategorias();
  const { data: pessoas = [] } = usePessoas();

  const createMutation = useCreateTransacao();

  const { isOpen, open, close } = useDisclosure();

  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [showListError, setShowListError] = useState(false);

  useEffect(() => {
    if (isErrorTransacoes) {
      setListError(
        (transacoesError as Error)?.message ?? "Tente novamente mais tarde.",
      );
      setShowListError(true);
    } else {
      setListError(null);
      setShowListError(false);
    }
  }, [isErrorTransacoes, transacoesError]);

  const categoriasMap = useMemo(
    () => new Map(categorias.map((categoria) => [categoria.id, categoria])),
    [categorias],
  );

  const columns: Array<TableColumn<Transacao>> = useMemo(
    () => [
      { key: "descricao", label: "Descrição", width: "30%" },
      {
        key: "valor",
        label: "Valor",
        width: "20%",
        render: (item) => formatCurrency(item.valor),
      },
      {
        key: "idTipo",
        label: "Tipo",
        width: "15%",
        render: (item) => (
          <span
            className={`${styles.badge} ${
              item.idTipo === TipoTransacao.Despesa
                ? styles.despesa
                : styles.receita
            }`}
          >
            {item.idTipo === TipoTransacao.Despesa ? "Despesa" : "Receita"}
          </span>
        ),
      },
      {
        key: "idCategoria",
        label: "Categoria",
        width: "20%",
        render: (item) => categoriasMap.get(item.idCategoria)?.descricao ?? "—",
      },
      {
        key: "idPessoa",
        label: "Pessoa",
        width: "15%",
        render: (item) => item.pessoa?.nome ?? "—",
      },
    ],
    [categoriasMap],
  );

  async function handleSubmit(values: TransacaoFormValues) {
    setFormError(null);

    try {
      await createMutation.mutateAsync(values);
      close();
    } catch (err) {
      setFormError("Não foi possível salvar. Tente novamente.");
    }
  }

  return (
    <div className={styles.page}>
      <div className="section-title">
        <div>
          <h1>Transações</h1>
          <p className="section-subtitle">
            Cadastre e visualize transações financeiras.
          </p>
        </div>
        <Button iconLeft={<Plus size={18} />} onClick={open}>
          Nova Transação
        </Button>
      </div>

      {isErrorTransacoes && showListError && (
        <AlertBox
          title="Erro ao carregar lista de transações."
          message={
            listError ?? "Recarregue a página ou tente novamente mais tarde."
          }
          onClose={() => setShowListError(false)}
        />
      )}

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          data={transacoes}
          loading={isLoadingTransacoes}
          emptyMessage="Nenhuma transação cadastrada ainda."
          rowKey={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isOpen}
        title="Nova Transação"
        subtitle="Preencha os dados para registrar a transação"
        onClose={() => {
          close();
          setFormError(null);
        }}
        footer={null}
        width="lg"
      >
        {formError && (
          <AlertBox
            title="Erro ao salvar."
            message="Tente novamente mais tarde."
            onClose={() => setFormError(null)}
          />
        )}
        <CreateTransacao
          categorias={categorias}
          pessoas={pessoas}
          onSubmit={handleSubmit}
          onCancel={() => {
            close();
            setFormError(null);
          }}
          isSubmitting={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}

export default ListTransacoes;
