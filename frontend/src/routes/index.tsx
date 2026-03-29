import ListCategorias from "@features/categorias/ListCategorias";
import ListPessoas from "@features/pessoas/ListPessoas";
import RelatorioPessoas from "@features/relatorios/RelatorioPessoas";
import ListTransacoes from "@features/transacoes/ListTransacoes";
import { Navigate, Route, Routes } from "react-router-dom";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="card" style={{ padding: "32px" }}>
      <h1>{title}</h1>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ListPessoas />} />
      <Route path="/categorias" element={<ListCategorias />} />
      <Route path="/transacoes" element={<ListTransacoes />} />
      <Route path="/relatorio/pessoas" element={<RelatorioPessoas />} />
      <Route
        path="/relatorio/categorias"
        element={<Placeholder title="Relatório de Categorias" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
