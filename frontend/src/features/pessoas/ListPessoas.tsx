import AlertBox from "@components/Alert/AlertBox";
import Button from "@components/Button/Button";
import Modal from "@components/Modal/Modal";
import Table, { type TableColumn } from "@components/Table/Table";
import { useDisclosure } from "@hooks/useDisclosure";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import CreateEditPessoa, { type PessoaFormValues } from "./CreateEditPessoa";
import {
  useCreatePessoa,
  useDeletePessoa,
  usePessoas,
  useUpdatePessoa,
} from "./hooks/usePessoas";
import styles from "./ListPessoas.module.css";
import type { Pessoa } from "./types";

function ListPessoas() {
  const { data = [], isLoading, isError, error } = usePessoas();
  const createMutation = useCreatePessoa();
  const updateMutation = useUpdatePessoa();
  const deleteMutation = useDeletePessoa();

  const {
    isOpen: isFormOpen,
    open: openForm,
    close: closeForm,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
  } = useDisclosure();

  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [showListError, setShowListError] = useState(false);

  useEffect(() => {
    if (isError) {
      setListError((error as Error)?.message ?? "Tente novamente mais tarde.");
      setShowListError(true);
    } else {
      setListError(null);
      setShowListError(false);
    }
  }, [isError, error]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const columns: Array<TableColumn<Pessoa>> = useMemo(
    () => [
      { key: "nome", label: "Nome", width: "45%" },
      {
        key: "idade",
        label: "Idade",
        width: "45%",
        render: (pessoa) => `${pessoa.idade} anos`,
      },
      {
        key: "acoes",
        label: "Ações",
        width: "10%",
        align: "center",
        render: (pessoa) => (
          <div className={styles.actions}>
            <button
              className={styles.iconButton}
              aria-label={`Editar ${pessoa.nome}`}
              onClick={() => handleEdit(pessoa)}
            >
              <PencilSimple size={18} weight="bold" />
            </button>
            <button
              className={`${styles.iconButton} ${styles.danger}`}
              aria-label={`Excluir ${pessoa.nome}`}
              onClick={() => handleDelete(pessoa)}
            >
              <Trash size={18} weight="bold" />
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  function handleCreateClick() {
    setSelectedPessoa(null);
    setMode("create");
    setFormError(null);
    openForm();
  }

  function handleEdit(pessoa: Pessoa) {
    setSelectedPessoa(pessoa);
    setMode("edit");
    setFormError(null);
    openForm();
  }

  function handleDelete(pessoa: Pessoa) {
    setSelectedPessoa(pessoa);
    setDeleteError(null);
    openDeleteModal();
  }

  async function handleSubmit(values: PessoaFormValues) {
    setFormError(null);

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (selectedPessoa) {
        await updateMutation.mutateAsync({
          id: selectedPessoa.id,
          payload: values,
        });
      }

      closeForm();
      setSelectedPessoa(null);
    } catch (err) {
      setFormError("Não foi possível salvar. Tente novamente.");
    }
  }

  async function confirmDelete() {
    if (!selectedPessoa) return;

    setDeleteError(null);

    try {
      await deleteMutation.mutateAsync(selectedPessoa.id);
      closeDeleteModal();
      setSelectedPessoa(null);
    } catch (err) {
      setDeleteError("Não foi possível deletar. Tente novamente.");
    }
  }

  return (
    <div className={styles.page}>
      <div className="section-title">
        <div>
          <h1>Cadastro de Pessoas</h1>
          <p className="section-subtitle">
            Gerencie pessoas para vincular transações e relatórios.
          </p>
        </div>
        <Button iconLeft={<Plus size={18} />} onClick={handleCreateClick}>
          Nova Pessoa
        </Button>
      </div>
      {isError && showListError && (
        <AlertBox
          title="Erro ao carregar lista de pessoas."
          message="Recarregue a página ou tente novamente mais tarde."
          onClose={() => setShowListError(false)}
        />
      )}
      <div className={styles.tableWrapper}>
        <Table
          columns={columns}
          data={data}
          loading={isLoading}
          emptyMessage="Nenhuma pessoa cadastrada ainda."
          rowKey={(item) => item.id}
        />
      </div>

      <Modal
        isOpen={isFormOpen}
        title={mode === "create" ? "Nova Pessoa" : "Editar Pessoa"}
        subtitle={
          mode === "create"
            ? "Preencha as informações da nova pessoa"
            : "Edite as informações da pessoa"
        }
        onClose={() => {
          closeForm();
          setSelectedPessoa(null);
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
        <CreateEditPessoa
          mode={mode}
          defaultValues={selectedPessoa ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            closeForm();
            setSelectedPessoa(null);
          }}
          isSubmitting={isSaving}
        />
      </Modal>

      <Modal
        isOpen={isDeleteOpen}
        title="Confirmar Exclusão"
        subtitle="Tem certeza que deseja deletar esta pessoa? Todas as transações relacionadas a ela também serão deletadas. Esta ação não pode ser desfeita."
        onClose={closeDeleteModal}
        width="md"
        footer={null}
      >
        <div className={styles.deleteBody}>
          {deleteError && (
            <AlertBox
              title="Erro ao deletar."
              message="Tente novamente mais tarde."
              onClose={() => setDeleteError(null)}
            />
          )}
          <p className="helper">
            {selectedPessoa
              ? `Você está removendo ${selectedPessoa.nome}.`
              : "Selecione uma pessoa para remover."}
          </p>
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={closeDeleteModal}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={confirmDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deletando..." : "Deletar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default ListPessoas;
