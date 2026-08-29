import React from 'react';
import { 
  LayoutDashboard, 
  Route, 
  Trash2, 
  TrendingUp, 
  AlertOctagon, 
  Megaphone, 
  Bot, 
  BarChart3, 
  Sparkles,
  Leaf
} from 'lucide-react';

export type AdminTab = 
  | 'dashboard'
  | 'routes'
  | 'bins'
  | 'predictions'
  | 'alerts'
  | 'reports'
  | 'analytics'
  | 'consultant';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  criticalCount: number;
  unresolvedReportsCount: number;
  efficiencyPercent: number;
  totalCollectedTons: number;
  predictedTons: number;
  co2SavedKg: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
  unresolvedReportsCount,
  efficiencyPercent,
  totalCollectedTons,
  predictedTons,
  co2SavedKg
}) => {
  const mainNav = [
    { id: 'dashboard' as AdminTab, label: 'Global Dashboard', icon: LayoutDashboard },
    { id: 'routes' as AdminTab, label: 'Route Optimization', icon: Route, badge: 'AI' },
    { id: 'bins' as AdminTab, label: 'Bin & Area Inventory', icon: Trash2 },
    { id: 'analytics' as AdminTab, label: 'Analytics & Trends', icon: BarChart3 },
  ];

  const aiNav = [
    { id: 'predictions' as AdminTab, label: 'Accumulation Predictions', icon: TrendingUp },
    { 
      id: 'alerts' as AdminTab, 
      label: 'Overflow Alerts', 
      icon: AlertOctagon, 
      count: criticalCount,
      countColor: 'bg-rose-950/80 text-rose-300 border border-rose-800/80' 
    },
    { 
      id: 'reports' as AdminTab, 
      label: 'Public Citizen Reports', 
      icon: Megaphone, 
      count: unresolvedReportsCount,
      countColor: 'bg-amber-950/80 text-amber-300 border border-amber-800/80' 
    },
    { id: 'consultant' as AdminTab, label: 'AI Operations Advisor', icon: Bot, highlight: true }
  ];

  return (
    <aside className="w-64 bg-[#111417] border-r border-[#272D33] p-4 flex flex-col gap-2 shrink-0 select-none overflow-y-auto">
      {/* Main Command */}
      <div className="text-[10px] font-bold text-[#68717B] uppercase tracking-widest px-3 mb-1">
        Command Overview
      </div>
      <nav className="flex flex-col gap-1">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? 'bg-[#171B1F] text-[#F1F3F4] shadow-sm border border-[#272D33]'
                  : 'text-[#9AA3AD] hover:bg-[#171B1F]/60 hover:text-[#F1F3F4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-[#68717B]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* AI Insights & Operations */}
      <div className="mt-4 text-[10px] font-bold text-[#68717B] uppercase tracking-widest px-3 mb-1">
        AI Intelligence &amp; Dispatch
      </div>
      <nav className="flex flex-col gap-1">
        {aiNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                isActive
                  ? 'bg-[#171B1F] text-[#F1F3F4] shadow-sm border border-[#272D33]'
                  : 'text-[#9AA3AD] hover:bg-[#171B1F]/60 hover:text-[#F1F3F4]'
              } ${item.highlight && !isActive ? 'bg-[#171B1F]/40 text-[#F1F3F4]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : item.highlight ? 'text-emerald-500' : 'text-[#68717B]'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold ${item.countColor || 'bg-[#1C2126] text-[#9AA3AD]'}`}>
                  {item.count}
                </span>
              )}
              {item.highlight && !item.count && (
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Today's Efficiency Widget */}
      <div className="mt-auto pt-3">
        <div className="p-4 bg-[#171B1F] border border-[#272D33] rounded-2xl text-[#F1F3F4] relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider">
              Shift Efficiency
            </div>
            <span className="text-[9px] font-semibold bg-[#1C2126] text-emerald-400 border border-[#272D33] px-1.5 py-0.5 rounded">
              AI Optimized
            </span>
          </div>

          <div className="text-2xl font-black tracking-tight text-[#F1F3F4] mt-1 font-mono">
            {efficiencyPercent.toFixed(1)}%
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-[#0B0D0F] rounded-full mt-2.5 overflow-hidden border border-[#272D33]/60">
            <div 
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(efficiencyPercent, 100)}%` }}
            />
          </div>

          <div className="text-[11px] mt-2.5 text-[#9AA3AD] font-medium flex items-center justify-between">
            <span>{totalCollectedTons.toFixed(1)}t collected</span>
            <span className="text-[#F1F3F4] font-bold">/ {predictedTons.toFixed(1)}t target</span>
          </div>

          <div className="mt-2.5 pt-2 border-t border-[#272D33] flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
            <Leaf className="w-3 h-3 text-emerald-500 shrink-0" />
            <span>{co2SavedKg.toFixed(1)} kg CO₂ avoided today</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
