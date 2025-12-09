import React from 'react';
import { LayoutDashboard, Wrench, Package, ShoppingCart, FileText, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { Role, User } from '../types';

interface SidebarProps {
  currentUser: User;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentPage, onNavigate }) => {
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [Role.ADMINISTRATOR, Role.FINANCE_MANAGER] },
    { id: 'workorders', label: 'Work Orders', icon: Wrench, roles: [Role.ADMINISTRATOR, Role.TECHNICIAN, Role.INVENTORY_CLERK] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: [Role.ADMINISTRATOR, Role.INVENTORY_CLERK, Role.PURCHASING_OFFICER] },
    { id: 'purchasing', label: 'Purchasing', icon: ShoppingCart, roles: [Role.ADMINISTRATOR, Role.PURCHASING_OFFICER, Role.FINANCE_MANAGER] },
    { id: 'accounting', label: 'Accounting', icon: FileText, roles: [Role.ADMINISTRATOR, Role.FINANCE_MANAGER] },
    { id: 'security', label: 'Security & Logs', icon: ShieldCheck, roles: [Role.ADMINISTRATOR] },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50 shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <span className="text-slate-900 font-bold text-lg">A</span>
        </div>
        <div>
          <h1 className="text-white font-bold tracking-wider text-sm">AURUM ERP</h1>
          <p className="text-xs text-slate-500">Workshop Edition</p>
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          if (!item.roles.includes(currentUser.role)) return null;
          
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group
                ${isActive 
                  ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 border-l-2 border-amber-400' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`}
            >
              <item.icon size={18} className={isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-300'} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 p-2 rounded bg-slate-800/50 border border-slate-700/50">
          <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-[10px] text-amber-500 truncate uppercase tracking-wider">{currentUser.role}</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-red-400 transition-colors">
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
