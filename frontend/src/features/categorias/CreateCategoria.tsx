import Button from "@components/Button/Button";
import InputField from "@components/Form/InputField";
import SelectField from "@components/Form/SelectField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "./CreateCategoria.module.css";
import { FinalidadeCategoria, type CategoriaPayload } from "./types";

const categoriaSchema = z.object({
  descricao: z
    .string()
    .min(2, "Descrição deve ter pelo menos 2 caracteres.")
    .max(400, "Descrição deve ter no máximo 400 caracteres."),
  idFinalidade: z.nativeEnum(FinalidadeCategoria),
});

export type CategoriaFormValues = z.infer<typeof categoriaSchema>;

type Props = {
  onSubmit: (values: CategoriaFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const finalidadeOptions = [
  { value: FinalidadeCategoria.Despesa, label: "Despesa" },
  { value: FinalidadeCategoria.Receita, label: "Receita" },
  { value: FinalidadeCategoria.Ambas, label: "Ambas" },
];

function CreateCategoria({ onSubmit, onCancel, isSubmitting }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoriaPayload>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      descricao: "",
      idFinalidade: FinalidadeCategoria.Despesa,
    },
  });

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fields}>
          <InputField
            label="Descrição (máximo 400 caracteres)"
            maxLength={400}
            placeholder="Digite a descrição"
            autoFocus
            {...register("descricao")}
            error={errors.descricao?.message}
          />
          <Controller
            name="idFinalidade"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Finalidade"
                options={finalidadeOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.idFinalidade?.message}
              />
            )}
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

export default CreateCategoria;
