import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Packages from './components/Packages.jsx';
import ConsultationForm from './components/ConsultationForm.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import PortalLayout from './layouts/PortalLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import ProjectTracking from './pages/ProjectTracking.jsx';
import TicketSystem from './pages/TicketSystem.jsx';
import KnowledgeBase from './pages/KnowledgeBase.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';
import RoleManagement from './pages/RoleManagement.jsx';
import AuditLogs from './pages/AuditLogs.jsx';

function MarketingHome() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Packages />
        <ConsultationForm />
      </main>
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <strong>Nuvrixa</strong>
            <p>AI-powered business systems, automation, integrations, dashboards and client portals.</p>
          </div>
          <div>
            <p>Built for modern organisations that need clarity, structure and intelligent workflows.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PortalPage({ activeView, children }) {
  return (
    <ProtectedRoute>
      <PortalLayout activeView={activeView}>
        {children}
      </PortalLayout>
    </ProtectedRoute>
  );
}

function AdminPage({ activeView, children }) {
  return (
    <AdminRoute>
      <PortalLayout activeView={activeView}>
        {children}
      </PortalLayout>
    </AdminRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingHome />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="/portal/dashboard" element={<PortalPage activeView="dashboard"><ClientDashboard /></PortalPage>} />
        <Route path="/portal/projects" element={<PortalPage activeView="projects"><ProjectTracking /></PortalPage>} />
        <Route path="/portal/tickets" element={<PortalPage activeView="tickets"><TicketSystem /></PortalPage>} />
        <Route path="/portal/knowledge-base" element={<PortalPage activeView="knowledge-base"><KnowledgeBase /></PortalPage>} />

        <Route path="/admin" element={<AdminPage activeView="admin-dashboard"><AdminDashboard /></AdminPage>} />
        <Route path="/admin/users" element={<AdminPage activeView="admin-users"><UserManagement /></AdminPage>} />
        <Route path="/admin/roles" element={<AdminPage activeView="admin-roles"><RoleManagement /></AdminPage>} />
        <Route path="/admin/audit-logs" element={<AdminPage activeView="admin-audit-logs"><AuditLogs /></AdminPage>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
