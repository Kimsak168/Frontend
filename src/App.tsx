import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Product from "./Pages/Product";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Category from "./Pages/Category";
import { Toaster } from "./components/ui/sonner";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./Pages/LoginPage";
import PosPage from "./Pages/PosPage";




const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>
        <Route path="/" element={<DashboardLayout />}>
            <Route path="/admin/products" element={<Product />} />
            <Route path="/admin/categories" element={<Category />} />
            <Route path="/admin/pos" element={<PosPage />} />
            {/* <Route path="/admin/forget-password" element={<ForgotPasswordForm />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>

  );
}

export default App;
