import Button from "@components/Button/Button";
import InputField from "@components/Form/InputField";
import SelectField from "@components/Form/SelectField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import type { Categoria } from "../categorias/types";
import { FinalidadeCategoria } from "../categorias/types";
import type { Pessoa } from "../pessoas/types";
import styles from "./CreateTransacao.module.css";
import { TipoTransacao } from "./types";

const transacaoSchema = z.object({
  descricao: z
    .string()
    .min(2, "Descrição deve ter pelo menos 2 caracteres.")
    .max(400, "Descrição deve ter no máximo 400 caracteres."),
  valor: z.coerce
    .number({ invalid_type_error: "Valor deve ser numérico." })
    .positive("Valor deve ser maior que zero."),
  idTipo: z.nativeEnum(TipoTransacao),
  idCategoria: z.coerce
    .number({ invalid_type_error: "Categoria é obrigatória." })
    .min(1, "Categoria é obrigatória."),
  idPessoa: z.coerce
    .number({ invalid_type_error: "Pessoa é obrigatória." })
    .min(1, "Pessoa é obrigatória."),
});

export type TransacaoFormValues = z.infer<typeof transacaoSchema>;

type Props = {
  categorias: Categoria[];
  pessoas: Pessoa[];
  onSubmit: (values: TransacaoFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
};

const tipoOptions = [
  { value: TipoTransacao.Despesa, label: "Despesa" },
  { value: TipoTransacao.Receita, label: "Receita" },
];

function CreateTransacao({
  categorias,
  pessoas,
  onSubmit,
  onCancel,
  isSubmitting,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransacaoFormValues>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: {
      descricao: "",
      valor: 0,
      idTipo: TipoTransacao.Despesa,
      idCategoria: 0,
      idPessoa: 0,
    },
  });

  const selectedTipo = watch("idTipo");
  const selectedCategoria = watch("idCategoria");
  const selectedPessoa = watch("idPessoa");

  const categoriaOptions = useMemo(() => {
    return categorias
      .filter((categoria) => {
        if (selectedTipo === TipoTransacao.Despesa) {
          return categoria.idFinalidade !== FinalidadeCategoria.Receita;
        }

        return categoria.idFinalidade !== FinalidadeCategoria.Despesa;
      })
      .map((categoria) => ({
        value: categoria.id,
        label: categoria.descricao,
      }));
  }, [categorias, selectedTipo]);

  const pessoaOptions = useMemo(() => {
    const isReceita = selectedTipo === TipoTransacao.Receita;
    const filtered = isReceita
      ? pessoas.filter((pessoa) => pessoa.idade >= 18)
      : pessoas;

    return filtered.map((pessoa) => ({
      value: pessoa.id,
      label: `${pessoa.nome} (${pessoa.idade} anos)`,
    }));
  }, [pessoas, selectedTipo]);

  useEffect(() => {
    const categoriaStillValid = categoriaOptions.some(
      (option) => option.value === selectedCategoria,
    );
    if (!categoriaStillValid) {
      setValue("idCategoria", 0);
    }
  }, [categoriaOptions, selectedCategoria, setValue]);

  useEffect(() => {
    const pessoaStillValid = pessoaOptions.some(
      (option) => option.value === selectedPessoa,
    );
    if (!pessoaStillValid) {
      setValue("idPessoa", 0);
    }
  }, [pessoaOptions, selectedPessoa, setValue]);

  return (
    <div className={styles.formWrapper}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGrid}>
          <InputField
            label="Descrição (máximo 400 caracteres)"
            maxLength={400}
            placeholder="Digite a descrição"
            autoFocus
            {...register("descricao")}
            error={errors.descricao?.message}
          />

          <InputField
            label="Valor"
            placeholder="Digite o valor"
            type="number"
            step="0.01"
            min={0.01}
            {...register("valor", { valueAsNumber: true })}
            error={errors.valor?.message}
          />
        </div>

        <div className={styles.inlineFields}>
          <Controller
            name="idTipo"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Tipo"
                options={tipoOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.idTipo?.message}
              />
            )}
          />

          <Controller
            name="idCategoria"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Categoria"
                options={categoriaOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={
                  categoriaOptions.length
                    ? "Selecione"
                    : "Nenhuma categoria disponível"
                }
                error={errors.idCategoria?.message}
              />
            )}
          />

          <Controller
            name="idPessoa"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Pessoa"
                options={pessoaOptions}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder={
                  pessoaOptions.length
                    ? "Selecione"
                    : "Nenhuma pessoa disponível"
                }
                error={errors.idPessoa?.message}
              />
            )}
          />
        </div>

        {selectedTipo === TipoTransacao.Receita && (
          <p className={`${styles.helper} ${styles.warning}`}>
            Apenas pessoas com 18 anos ou mais podem cadastrar receitas. A lista
            foi filtrada.
          </p>
        )}

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

export default CreateTransacao;
