import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import DashboardLayout from './components/layouts/DashboardLayout';
import ProfilePage from './pages/profile/ProfilePage';
import TeamDirectoryPage from './pages/team/TeamDirectoryPage';
import SettingsPage from './pages/settings/SettingsPage';
import BdeDashboardPage from './pages/bde/DashboardPage';
import LeadsPage from './pages/bde/LeadsPage';
import LeadDetailPage from './pages/bde/LeadDetailPage';
import NewLeadPage from './pages/bde/NewLeadPage';
import EmailComposerPage from './pages/bde/EmailComposerPage';
import ConversionRequestPage from './pages/bde/ConversionRequestPage';
import CompaniesPage from './pages/bde/CompaniesPage';
import CompanyDetailPage from './pages/bde/CompanyDetailPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/bde/dashboard" />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="team" element={<TeamDirectoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          {/* BDE Routes */}
          <Route path="bde/dashboard" element={<BdeDashboardPage />} />
          <Route path="bde/leads" element={<LeadsPage />} />
          <Route path="bde/leads/new" element={<NewLeadPage />} />
          <Route path="bde/leads/:leadId" element={<LeadDetailPage />} />
          <Route path="bde/email/compose" element={<EmailComposerPage />} />
          <Route path="bde/conversion/:leadId" element={<ConversionRequestPage />} />
          <Route path="bde/companies" element={<CompaniesPage />} />
          <Route path="bde/companies/:companyId" element={<CompanyDetailPage />} />
        </Route>

        {/* Redirect root to login for any other path */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;