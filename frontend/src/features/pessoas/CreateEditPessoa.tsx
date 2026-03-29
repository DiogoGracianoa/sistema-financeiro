import Button from "@components/Button/Button";
import InputField from "@components/Form/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./CreateEditPessoa.module.css";
import type { PessoaPayload } from "./types";

const pessoaSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(200, "Nome deve ter no máximo 200 caracteres."),
  idade: z.coerce
    .number({ invalid_type_error: "Idade deve ser um número." })
    .min(0, "Idade mínima é 0.")
    .max(150, "Idade máxima é 150."),
});

export type PessoaFormValues = z.infer<typeof pessoaSchema>;

type Props = {
  defaultValues?: PessoaPayload;
  mode: "create" | "edit";
  onSubmit: (values: PessoaFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

function CreateEditPessoa({
  defaultValues,
  mode,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PessoaFormValues>({
    resolver: zodResolver(pessoaSchema),
    defaultValues: defaultValues ?? { nome: "", idade: 0 },
  });

  useEffect(() => {
    reset(defaultValues ?? { nome: "", idade: 0 });
  }, [defaultValues, reset]);

  const title = mode === "create" ? "Nova Pessoa" : "Editar Pessoa";

  const subtitle =
    mode === "create"
      ? "Preencha as informações da nova pessoa"
      : "Edite as informações da pessoa";

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fields}>
          <InputField
            label="Nome (máximo 200 caracteres)"
            maxLength={200}
            placeholder="Digite o nome"
            autoFocus
            {...register("nome")}
            error={errors.nome?.message}
          />
          <InputField
            label="Idade"
            placeholder="Digite a idade"
            type="number"
            min={0}
            max={150}
            {...register("idade", { valueAsNumber: true })}
            error={errors.idade?.message}
          />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateEditPessoa;
