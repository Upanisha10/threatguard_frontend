import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Users,
  FileText,
  Database,
  Sliders
} from 'lucide-react';

export function Sidebar() {

  const role = localStorage.getItem('role');

  const analystNavigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Sessions', to: '/sessions', icon: Shield },
    { name: 'Alerts', to: '/alerts', icon: AlertTriangle },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Sessions', to: '/sessions', icon: Shield },
    { name: 'Alerts', to: '/alerts', icon: AlertTriangle },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },

    { name: 'Users', to: '/users', icon: Users },
    { name: 'System Settings', to: '/admin-settings', icon: Sliders },
    { name: 'Audit Logs', to: '/logs', icon: Database },
  ];

  const navigation = role === 'ADMIN' ? adminNavigation : analystNavigation;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-gray-100">

      <div className="flex items-center justify-center h-16 px-6 border-b border-slate-800">
        <Shield className="w-8 h-8 text-blue-400 mr-2" />
        <span className="text-xl font-bold">ThreatGuard</span>
      </div>

      <div className="px-6 py-2 text-xs text-gray-400">
        Logged in as: {role === 'ADMIN' ? 'Administrator' : 'Security Analyst'}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-gray-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-400 rounded-md hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
