import ListPessoas from "@features/pessoas/ListPessoas";
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
      <Route path="/categorias" element={<Placeholder title="Categorias" />} />
      <Route path="/transacoes" element={<Placeholder title="Transações" />} />
      <Route
        path="/relatorio/pessoas"
        element={<Placeholder title="Relatório de Pessoas" />}
      />
      <Route
        path="/relatorio/categorias"
        element={<Placeholder title="Relatório de Categorias" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
