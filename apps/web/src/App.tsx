import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.js";
import Dashboard from "./routes/Dashboard.js";
import CustomerList from "./routes/CustomerList.js";
import CustomerDetail from "./routes/CustomerDetail.js";
import CustomerForm from "./routes/CustomerForm.js";
import UnitForm from "./routes/UnitForm.js";
import UnitDetail from "./routes/UnitDetail.js";
import ServiceLogForm from "./routes/ServiceLogForm.js";
import PriorityList from "./routes/PriorityList.js";
import Export from "./routes/Export.js";

export default function App() {
  return (
    <Routes>
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
      </Route>
    </Routes>
  );
}
