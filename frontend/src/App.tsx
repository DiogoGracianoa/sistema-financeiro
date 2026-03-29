import AppHeader from "@components/Layout/AppHeader";
import PageContainer from "@components/Layout/PageContainer";
import AppRoutes from "@routes/index";

function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <PageContainer>
        <AppRoutes />
      </PageContainer>
    </div>
  );
}

export default App;
