import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WasteBin, CollectionRoute, DriverProfile, CitizenReport, UserRole } from '../types';
import { 
  Search, 
  Trash2, 
  Route, 
  Truck, 
  Megaphone, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  X, 
  CornerDownLeft, 
  Zap,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { sound } from '../services/soundService';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  bins: WasteBin[];
  routes: CollectionRoute[];
  drivers: DriverProfile[];
  reports: CitizenReport[];
  user?: any;
  onSelectBin: (bin: WasteBin) => void;
  onSelectRoute: (route: CollectionRoute) => void;
  onChangeRole: (role: UserRole) => void;
  onSimulateSpike: () => void;
  onOpenAiConsultant: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  bins,
  routes,
  drivers,
  reports,
  user,
  onSelectBin,
  onSelectRoute,
  onChangeRole,
  onSimulateSpike,
  onOpenAiConsultant
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Build searchable items
  const items = useMemo(() => {
    const q = query.toLowerCase().trim();

    const isDriverAccount = user?.role === 'driver';
    const isCitizenAccount = user?.role === 'citizen';

    const quickActions = [
      ...(!isDriverAccount && !isCitizenAccount ? [
        {
          id: 'action-consultant',
          type: 'action',
          title: 'Open Gemini Municipal Advisor',
          subtitle: 'Ask AI operational questions and forecast route bottlenecks',
          icon: Sparkles,
          category: 'Quick Actions',
          action: () => { onOpenAiConsultant(); onClose(); }
        },
        {
          id: 'action-spike',
          type: 'action',
          title: 'Simulate Rush Hour Spill / Surge (+18% Load)',
          subtitle: 'Inject IoT volume spikes into downtown containers',
          icon: Zap,
          category: 'Quick Actions',
          action: () => { onSimulateSpike(); onClose(); }
        },
        {
          id: 'role-admin',
          type: 'role',
          title: 'Switch to Municipal Admin Portal',
          subtitle: 'Fleet management, analytics, routes and live map',
          icon: ShieldCheck,
          category: 'Navigation',
          action: () => { onChangeRole('admin'); onClose(); }
        },
        {
          id: 'role-driver',
          type: 'role',
          title: 'Switch to Driver Console',
          subtitle: 'Active turn-by-turn collection checklist & payload tally',
          icon: Truck,
          category: 'Navigation',
          action: () => { onChangeRole('driver'); onClose(); }
        },
        {
          id: 'role-citizen',
          type: 'role',
          title: 'Switch to Public Citizen Portal',
          subtitle: 'Report street overflow or check neighborhood cleanups',
          icon: UserCheck,
          category: 'Navigation',
          action: () => { onChangeRole('citizen'); onClose(); }
        }
      ] : [])
    ];

    if (!q) {
      return quickActions;
    }

    const binResults = bins
      .filter(b => b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.location.address.toLowerCase().includes(q) || b.areaName.toLowerCase().includes(q))
      .slice(0, 5)
      .map(b => ({
        id: `bin-${b.id}`,
        type: 'bin',
        title: `${b.name} (${b.currentFillPercent}%)`,
        subtitle: `${b.id} · ${b.location.address} · Risk: ${b.overflowRisk}`,
        icon: Trash2,
        category: 'Containers & Bins',
        action: () => { onSelectBin(b); onClose(); }
      }));

    const routeResults = routes
      .filter(r => r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.assignedZoneName.toLowerCase().includes(q))
      .slice(0, 3)
      .map(r => ({
        id: `route-${r.id}`,
        type: 'route',
        title: r.name,
        subtitle: `${r.stops.length} stops · Est. ${r.estimatedDurationMinutes} mins · ${r.assignedZoneName}`,
        icon: Route,
        category: 'Collection Routes',
        action: () => { onSelectRoute(r); onClose(); }
      }));

    const driverResults = drivers
      .filter(d => d.name.toLowerCase().includes(q) || d.vehiclePlate.toLowerCase().includes(q))
      .slice(0, 3)
      .map(d => ({
        id: `driver-${d.id}`,
        type: 'driver',
        title: d.name,
        subtitle: `Vehicle: ${d.vehiclePlate} (${d.status}) · ${(d.collectedWeightKgToday / 1000).toFixed(1)}T collected`,
        icon: Truck,
        category: 'Fleet Drivers',
        action: () => { onChangeRole('driver'); onClose(); }
      }));

    const matchedActions = quickActions.filter(a => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q));

    return [...matchedActions, ...binResults, ...routeResults, ...driverResults];
  }, [query, bins, routes, drivers, onSelectBin, onSelectRoute, onChangeRole, onSimulateSpike, onOpenAiConsultant, onClose]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (items.length || 1));
      sound.playClick();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + items.length) % (items.length || 1));
      sound.playClick();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items[selectedIndex]) {
        sound.playClick();
        items[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#111417] rounded-2xl shadow-2xl border border-[#272D33] max-w-xl w-full overflow-hidden flex flex-col max-h-[520px] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search input header */}
        <div className="p-3.5 border-b border-[#272D33] flex items-center gap-3 bg-[#171B1F]">
          <Search className="w-5 h-5 text-[#68717B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, container ID, address, route or driver..."
            className="w-full bg-transparent text-sm text-[#F1F3F4] placeholder-[#68717B] focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-[#111417] text-[#9AA3AD] border border-[#272D33] px-1.5 py-0.5 rounded">
              ESC
            </kbd>
            <button 
              onClick={onClose} 
              className="text-[#68717B] hover:text-[#F1F3F4] p-1 rounded-lg hover:bg-[#1C2126]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#272D33]/40">
          {items.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#68717B]">
              No municipal items found matching <strong className="text-[#9AA3AD]">"{query}"</strong>
            </div>
          ) : (
            items.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    item.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-[#1C2126] text-[#F1F3F4]' : 'text-[#9AA3AD] hover:bg-[#171B1F]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80' : 'bg-[#171B1F] text-[#68717B] border border-[#272D33]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="text-xs font-bold text-[#F1F3F4] truncate flex items-center gap-2">
                        <span>{item.title}</span>
                        <span className="text-[10px] text-[#68717B] font-medium font-mono">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#9AA3AD] truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <CornerDownLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-[#171B1F] border-t border-[#272D33] flex items-center justify-between text-[11px] text-[#68717B] font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-[#111417] px-1.5 py-0.5 rounded border border-[#272D33] text-[#9AA3AD]">↑↓</kbd> Navigate</span>
            <span><kbd className="bg-[#111417] px-1.5 py-0.5 rounded border border-[#272D33] text-[#9AA3AD]">↵</kbd> Select</span>
          </div>
          <span>WasteWise Command Suite</span>
        </div>
      </div>
    </div>
  );
};
