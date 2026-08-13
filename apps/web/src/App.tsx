import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { RequireAuth } from "./components/RequireAuth.js";
import { Layout } from "./components/Layout.js";
import { PageLoading } from "./components/PageLoading.js";

const Login = lazy(() => import("./routes/Login.js"));
const Register = lazy(() => import("./routes/Register.js"));
const Settings = lazy(() => import("./routes/Settings.js"));
const Dashboard = lazy(() => import("./routes/Dashboard.js"));
const CustomerList = lazy(() => import("./routes/CustomerList.js"));
const CustomerDetail = lazy(() => import("./routes/CustomerDetail.js"));
const CustomerForm = lazy(() => import("./routes/CustomerForm.js"));
const UnitForm = lazy(() => import("./routes/UnitForm.js"));
const UnitDetail = lazy(() => import("./routes/UnitDetail.js"));
const ServiceLogForm = lazy(() => import("./routes/ServiceLogForm.js"));
const PriorityList = lazy(() => import("./routes/PriorityList.js"));
const Export = lazy(() => import("./routes/Export.js"));
const InvoiceList = lazy(() => import("./routes/InvoiceList.js"));
const InvoiceForm = lazy(() => import("./routes/InvoiceForm.js"));
const InvoiceDetail = lazy(() => import("./routes/InvoiceDetail.js"));

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/new" element={<CustomerForm />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              <Route path="/customers/:id/edit" element={<CustomerForm />} />
              <Route path="/customers/:customerId/units/new" element={<UnitForm />} />
              <Route path="/units/:id" element={<UnitDetail />} />
              <Route path="/units/:id/edit" element={<UnitForm />} />
              <Route path="/units/:unitId/service/new" element={<ServiceLogForm />} />
              <Route path="/priority" element={<PriorityList />} />
              <Route path="/export" element={<Export />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/customers/:customerId/invoices/new" element={<InvoiceForm />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
