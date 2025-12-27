import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Plus, LayoutDashboard, Settings, Activity } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ to, icon: Icon, label, active }: { to: string; icon: any; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-blue-600/20 text-blue-400'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800 flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldAlert className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Cyber-Shield
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
          <NavItem to="/projects" icon={Activity} label="Projects" active={location.pathname.startsWith('/projects')} />
          <NavItem to="/alerts" icon={ShieldAlert} label="Alerts" active={location.pathname === '/alerts'} />
          <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-2">Logged in as</p>
            <p className="text-sm font-medium text-white truncate">demo@cybershield.app</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 sticky top-0 backdrop-blur-sm z-10">
          <h1 className="text-lg font-semibold text-slate-100">
            {location.pathname === '/' ? 'Dashboard' : 
             location.pathname.startsWith('/projects') ? 'Projects' :
             location.pathname.startsWith('/alerts') ? 'Alerts' : 'Settings'}
          </h1>
          <Link
            to="/projects/new"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            <span>Add Project</span>
          </Link>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
