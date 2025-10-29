import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegistrationScreen } from './components/RegistrationScreen';
import { ResidentDashboard } from './components/ResidentDashboard';
import { BarangayDashboard } from './components/BarangayDashboard';
import { EngineerDashboard } from './components/EngineerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ReportFilingScreen } from './components/ReportFilingScreen';
import { ReportDetailsScreen } from './components/ReportDetailsScreen';
import { NotificationsPanel } from './components/NotificationsPanel';
import { Toaster } from './components/ui/sonner';
import { User, Report } from './types';
import { mockNotifications } from './lib/mockData';
import { Bell, LogOut, Droplets, Menu, X } from 'lucide-react';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';

type Screen = 'login' | 'register' | 'dashboard' | 'fileReport' | 'reportDetails' | 'notifications';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = currentUser 
    ? mockNotifications.filter(n => n.userId === currentUser.id && !n.isRead).length 
    : 0;

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentScreen('login');
    setMobileMenuOpen(false);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setCurrentScreen('reportDetails');
    setMobileMenuOpen(false);
  };

  const handleFileNewReport = () => {
    setCurrentScreen('fileReport');
    setMobileMenuOpen(false);
  };

  const handleBackToDashboard = () => {
    setSelectedReport(null);
    setCurrentScreen('dashboard');
    setMobileMenuOpen(false);
  };

  const handleViewNotifications = () => {
    setCurrentScreen('notifications');
    setMobileMenuOpen(false);
  };

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'Resident':
        return (
          <ResidentDashboard
            userId={currentUser.id}
            onViewReport={handleViewReport}
            onFileNewReport={handleFileNewReport}
          />
        );
      case 'Barangay Official':
        return (
          <BarangayDashboard
            userId={currentUser.id}
            onViewReport={handleViewReport}
          />
        );
      case 'City Engineer':
        return (
          <EngineerDashboard
            userId={currentUser.id}
            onViewReport={handleViewReport}
          />
        );
      case 'Admin':
        return <AdminDashboard onViewReport={handleViewReport} />;
      default:
        return null;
    }
  };

  if (currentScreen === 'register') {
    return (
      <div>
        <RegistrationScreen onSwitchToLogin={() => setCurrentScreen('login')} />
        <Toaster />
      </div>
    );
  }

  if (!currentUser || currentScreen === 'login') {
    return (
      <div>
        <LoginScreen
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentScreen('register')}
        />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg">Bantay Daluyan</h1>
                <p className="text-xs text-gray-600">
                  {currentUser.role} Portal
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-sm">BD</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setCurrentScreen('dashboard')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  currentScreen === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>

              {currentUser.role === 'Resident' && (
                <button
                  onClick={handleFileNewReport}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentScreen === 'fileReport'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  File Report
                </button>
              )}

              <button
                onClick={handleViewNotifications}
                className={`relative px-3 py-2 rounded-lg transition-colors ${
                  currentScreen === 'notifications'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>

              <div className="h-8 w-px bg-gray-200" />

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm">{currentUser.fullname}</p>
                  <p className="text-xs text-gray-500">{currentUser.role}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
              <div className="px-4 py-2 bg-gray-50 rounded-lg mb-3">
                <p className="text-sm">{currentUser.fullname}</p>
                <p className="text-xs text-gray-500">{currentUser.role}</p>
              </div>

              <button
                onClick={() => setCurrentScreen('dashboard')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentScreen === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>

              {currentUser.role === 'Resident' && (
                <button
                  onClick={handleFileNewReport}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    currentScreen === 'fileReport'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  File Report
                </button>
              )}

              <button
                onClick={handleViewNotifications}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  currentScreen === 'notifications'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="bg-red-600 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentScreen === 'dashboard' && renderDashboard()}
        
        {currentScreen === 'fileReport' && currentUser && (
          <ReportFilingScreen
            userId={currentUser.id}
            onBack={handleBackToDashboard}
          />
        )}

        {currentScreen === 'reportDetails' && selectedReport && currentUser && (
          <ReportDetailsScreen
            report={selectedReport}
            currentUser={currentUser}
            onBack={handleBackToDashboard}
          />
        )}

        {currentScreen === 'notifications' && currentUser && (
          <NotificationsPanel
            userId={currentUser.id}
            onViewReport={handleViewReport}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>© 2025 Bantay Daluyan - Drainage Monitoring System</p>
            <p className="mt-1">Ensuring better infrastructure management for our community</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
