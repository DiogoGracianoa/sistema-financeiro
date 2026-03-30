import ListCategorias from "@features/categorias/ListCategorias";
import ListPessoas from "@features/pessoas/ListPessoas";
import RelatorioCategorias from "@features/relatorios/RelatorioCategorias";
import RelatorioPessoas from "@features/relatorios/RelatorioPessoas";
import ListTransacoes from "@features/transacoes/ListTransacoes";
import { Navigate, Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ListPessoas />} />
      <Route path="/categorias" element={<ListCategorias />} />
      <Route path="/transacoes" element={<ListTransacoes />} />
      <Route path="/relatorio/pessoas" element={<RelatorioPessoas />} />
      <Route path="/relatorio/categorias" element={<RelatorioCategorias />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
