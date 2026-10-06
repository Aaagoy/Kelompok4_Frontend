import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";

function DashboardLayout() {
  return (
    <>
      <Sidebar />
      <div className="md:ml-56">
        <Dashboard />
      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}/>
    </Routes>
  );
}

export default App;