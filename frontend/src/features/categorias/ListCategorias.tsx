import AlertBox from "@components/Alert/AlertBox";
import Badge from "@components/Badge/Badge";
import Button from "@components/Button/Button";
import Modal from "@components/Modal/Modal";
import Table, { type TableColumn } from "@components/Table/Table";
import { useDisclosure } from "@hooks/useDisclosure";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import CreateCategoria, { type CategoriaFormValues } from "./CreateCategoria";
import { useCategorias, useCreateCategoria } from "./hooks/useCategorias";
import styles from "./ListCategorias.module.css";
import { FinalidadeCategoria, type Categoria } from "./types";

function ListCategorias() {
  const { data = [], isLoading, isError, error } = useCategorias();
  const createMutation = useCreateCategoria();

  const { isOpen, open, close } = useDisclosure();

  const [formError, setFormError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [showListError, setShowListError] = useState(false);

  const columns: Array<TableColumn<Categoria>> = useMemo(
    () => [
      { key: "descricao", label: "Descrição", width: "70%" },
      {
        key: "finalidade",
        label: "Finalidade",
        width: "30%",
        align: "center",
        render: (categoria) => {
          if (categoria.idFinalidade === FinalidadeCategoria.Despesa) {
            return <Badge label="Despesa" tone="danger" />;
          }
          if (categoria.idFinalidade === FinalidadeCategoria.Receita) {
            return <Badge label="Receita" tone="success" />;
          }
          return <Badge label="Ambas" tone="neutral" />;
        },
      },
    ],
    [],
  );

  useEffect(() => {
    if (isError) {
      setListError((error as Error)?.message ?? "Tente novamente mais tarde.");
      setShowListError(true);
    } else {
      setListError(null);
      setShowListError(false);
    }
  }, [isError, error]);

  async function handleSubmit(values: CategoriaFormValues) {
    setFormError(null);

    try {
      await createMutation.mutateAsync(values);
      close();
    } catch (err) {
      setFormError("Tente novamente mais tarde.");
    }
  }

  return (
    <div className={styles.page}>
      <div className="section-title">
        <div>
          <h1>Cadastro de Categorias</h1>
          <p className="section-subtitle">
            Organize categorias para suas transações.
          </p>
        </div>
        <Button
          iconLeft={<Plus size={18} />}
          onClick={() => {
            setFormError(null);
            open();
          }}
        >
          Nova Categoria
        </Button>
      </div>

      {isError && showListError && (
        <AlertBox
          title="Erro ao carregar categorias."
          message="Recarregue a página ou tente novamente mais tarde."
          onClose={() => setShowListError(false)}
        />
      )}

      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          data={data}
          loading={isLoading}
          emptyMessage="Nenhuma categoria cadastrada ainda."
          rowKey={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isOpen}
        title="Nova Categoria"
        subtitle="Preencha as informações da nova categoria"
        onClose={() => {
          close();
          setFormError(null);
        }}
        footer={null}
        width="md"
      >
        {formError && (
          <AlertBox
            title="Erro ao salvar."
            message="Tente novamente mais tarde."
            onClose={() => setFormError(null)}
          />
        )}
        <CreateCategoria
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

export default ListCategorias;
