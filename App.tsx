import React from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { LoginPage } from './pages/LoginPage';
import { Signatures } from './pages/dashboard/Signatures';
import { Models } from './pages/dashboard/Models';
import { AddModels } from './pages/dashboard/AddModels';
import { Analysis } from './pages/dashboard/Analysis';
import { FeeCalculator } from './pages/dashboard/FeeCalculator';
import { Agenda } from './pages/dashboard/Agenda';

// Dashboard Layout Wrapper
const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 w-full bg-gray-50 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/documentos" element={<Layout><DocumentsPage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />

        {/* Dashboard Routes (Protected) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/assinaturas" replace />} />
          <Route path="assinaturas" element={<Signatures />} />
          <Route path="agenda" element={<Agenda />} />
          <Route path="modelos" element={<Models />} />
          <Route path="add-modelos" element={<AddModels />} />
          <Route path="analise" element={<Analysis />} />
          <Route path="calculadora" element={<FeeCalculator />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;