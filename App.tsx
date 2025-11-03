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
import MasterDashboardPage from './pages/master/DashboardPage';
import ConversionRequestsPage from './pages/master/ConversionRequestsPage';
import MasterCompaniesPage from './pages/master/CompaniesPage';
import MasterUsersPage from './pages/master/UsersPage';
import MasterAnalyticsPage from './pages/master/AnalyticsPage';
import MasterAdminPage from './pages/master/AdminPage';
import EmailCenterPage from './pages/communications/EmailCenterPage';
import MeetingsPage from './pages/communications/MeetingsPage';
import CallLogsPage from './pages/communications/CallLogsPage';
import InternalChatPage from './pages/chat/InternalChatPage';
import AiInsightsPage from './pages/analytics/AiInsightsPage';
import PipelinePage from './pages/analytics/PipelinePage';
import PredictiveAnalyticsPage from './pages/analytics/PredictiveAnalyticsPage';
import PerformanceIntelligencePage from './pages/analytics/PerformanceIntelligencePage';
import ImportExportPage from './pages/tools/ImportExportPage';
import ReportsPage from './pages/tools/ReportsPage';
import TemplatesPage from './pages/tools/TemplatesPage';
import IntegrationsPage from './pages/tools/IntegrationsPage';
import TerritoryManagementPage from './pages/master/TerritoryManagementPage';
import LeaderboardPage from './pages/gamification/LeaderboardPage';
import AchievementsPage from './pages/gamification/AchievementsPage';
import GoalsPage from './pages/gamification/GoalsPage';
import TrainingPage from './pages/training/TrainingPage';
import DealRoomPage from './pages/deal-room/DealRoomPage';
import NotificationCenterPage from './pages/notifications/NotificationCenterPage';

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
          <Route path="chat" element={<InternalChatPage />} />
          <Route path="notifications" element={<NotificationCenterPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="deal-room/:companyId" element={<DealRoomPage />} />
          
          {/* BDE Routes */}
          <Route path="bde/dashboard" element={<BdeDashboardPage />} />
          <Route path="bde/leads" element={<LeadsPage />} />
          <Route path="bde/leads/new" element={<NewLeadPage />} />
          <Route path="bde/leads/:leadId" element={<LeadDetailPage />} />
          <Route path="bde/email/compose" element={<EmailComposerPage />} />
          <Route path="bde/conversion/:leadId" element={<ConversionRequestPage />} />
          <Route path="bde/companies" element={<CompaniesPage />} />
          <Route path="bde/companies/:companyId" element={<CompanyDetailPage />} />

          {/* Masterclass Admin Routes */}
          <Route path="master/dashboard" element={<MasterDashboardPage />} />
          <Route path="master/conversion-requests" element={<ConversionRequestsPage />} />
          <Route path="master/companies" element={<MasterCompaniesPage />} />
          <Route path="master/users" element={<MasterUsersPage />} />
          <Route path="master/analytics" element={<MasterAnalyticsPage />} />
          <Route path="master/admin" element={<MasterAdminPage />} />
          <Route path="master/territories" element={<TerritoryManagementPage />} />
          
          {/* Communications Routes */}
          <Route path="communications/email" element={<EmailCenterPage />} />
          <Route path="communications/meetings" element={<MeetingsPage />} />
          <Route path="communications/calls" element={<CallLogsPage />} />

          {/* Strategy & AI Routes */}
          <Route path="ai/insights" element={<AiInsightsPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="analytics/predictive" element={<PredictiveAnalyticsPage />} />
          <Route path="analytics/performance" element={<PerformanceIntelligencePage />} />

          {/* Tools Routes */}
          <Route path="tools/import-export" element={<ImportExportPage />} />
          <Route path="tools/reports" element={<ReportsPage />} />
          <Route path="tools/templates" element={<TemplatesPage />} />
          <Route path="tools/integrations" element={<IntegrationsPage />} />

          {/* Gamification Routes */}
          <Route path="gamification/leaderboard" element={<LeaderboardPage />} />
          <Route path="gamification/achievements" element={<AchievementsPage />} />
          <Route path="gamification/goals" element={<GoalsPage />} />
        </Route>

        {/* Redirect root to login for any other path */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </HashRouter>
  );
}

export default App;