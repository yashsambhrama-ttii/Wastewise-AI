import React, { useState } from 'react';
import { UserRole, DriverProfile } from '../types';
import { Truck, ShieldCheck, UserCheck, Sparkles, LogIn, LogOut, Search, Volume2, VolumeX } from 'lucide-react';
import { logoutUser } from '../lib/firebase';
import { AuthModal } from './AuthModal';
import { sound } from '../services/soundService';

interface NavbarProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeDriver: DriverProfile;
  setActiveDriver: (driver: DriverProfile) => void;
  drivers: DriverProfile[];
  user: any;
  setUser: (user: any) => void;
  aiEngineStatus: 'active' | 'processing' | 'idle';
  criticalBinsCount: number;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  setCurrentRole,
  activeDriver,
  setActiveDriver,
  drivers,
  user,
  setUser,
  aiEngineStatus,
  criticalBinsCount,
  onOpenSearch
}) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);

  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
    if (next) sound.playClick();
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setUser(null);
    localStorage.removeItem('wastewise_user');
    // Default back to public citizen view upon signout
    setCurrentRole('citizen');
  };

  const handleAuthSuccess = (userData: {
    displayName: string;
    email: string;
    photoURL?: string | null;
    role?: UserRole;
  }) => {
    setUser(userData);
    localStorage.setItem('wastewise_user', JSON.stringify(userData));
    if (userData.role) {
      setCurrentRole(userData.role);
    }
  };

  // Determine allowed roles based on logged-in user account
  const userAccountRole: UserRole | undefined = user?.role;
  const isDriverAccount = userAccountRole === 'driver';
  const isAdminAccount = userAccountRole === 'admin' || !userAccountRole; // Admin or guest preview has full admin tools
  const isCitizenAccount = userAccountRole === 'citizen';

  return (
    <>
      <header className="h-16 bg-[#111417] border-b border-[#272D33] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 select-none gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-700 border border-emerald-600/40 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#F1F3F4]">
                WasteWise <span className="text-emerald-500 font-extrabold">AI</span>
              </h1>
              <span className="hidden md:inline-block text-[10px] font-semibold bg-[#171B1F] text-[#9AA3AD] border border-[#272D33] px-2 py-0.5 rounded-md">
                {isDriverAccount ? 'Driver Terminal' : isCitizenAccount ? 'Citizen Portal' : 'Municipal Control Room'}
              </span>
            </div>
            <p className="text-[11px] text-[#68717B] font-medium hidden sm:block">
              {isDriverAccount 
                ? 'Field Logistics & Route Operations Console' 
                : isCitizenAccount 
                ? 'Community Cleanup & Overflow Reporting' 
                : 'Municipal Waste & Route Operations Platform'}
            </p>
          </div>
        </div>

        {/* Global Search / Command Bar Trigger (Only visible for Admin) */}
        {!isDriverAccount && !isCitizenAccount && (
          <button
            onClick={() => {
              sound.playClick();
              onOpenSearch();
            }}
            className="hidden md:flex items-center justify-between gap-3 bg-[#0B0D0F] hover:bg-[#171B1F] text-[#9AA3AD] hover:text-[#F1F3F4] px-3.5 py-1.5 rounded-xl border border-[#272D33] text-xs transition-all w-64 group"
            title="Open Command Palette (Cmd+K)"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#68717B] group-hover:text-emerald-400 transition-colors" />
              <span className="truncate">Search bins, routes, zones...</span>
            </div>
            <kbd className="text-[10px] font-mono bg-[#171B1F] text-[#68717B] border border-[#272D33] px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Role Mode Badges / Role Selector */}
        <div className="flex items-center bg-[#0B0D0F] p-1 rounded-xl border border-[#272D33]">
          {/* Driver account locked view: Only shows Driver Console */}
          {isDriverAccount ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Driver Console</span>
            </div>
          ) : isCitizenAccount ? (
            /* Citizen account locked view: Only shows Citizen Portal */
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Citizen Portal</span>
            </div>
          ) : (
            /* Admin Officer Account: Full Access & Quick Switch */
            <>
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentRole('admin');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'admin'
                    ? 'bg-[#1C2126] text-[#F1F3F4] shadow-sm border border-[#272D33]'
                    : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${currentRole === 'admin' ? 'text-emerald-500' : 'text-[#68717B]'}`} />
                <span className="hidden sm:inline">Admin Portal</span>
                <span className="sm:hidden">Admin</span>
                {criticalBinsCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-rose-950/80 text-rose-300 border border-rose-800/80 rounded-full text-[9px] font-bold">
                    {criticalBinsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentRole('driver');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'driver'
                    ? 'bg-[#1C2126] text-[#F1F3F4] shadow-sm border border-[#272D33]'
                    : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
                }`}
              >
                <Truck className={`w-3.5 h-3.5 ${currentRole === 'driver' ? 'text-emerald-500' : 'text-[#68717B]'}`} />
                <span className="hidden sm:inline">Driver Console</span>
                <span className="sm:hidden">Driver</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentRole('citizen');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentRole === 'citizen'
                    ? 'bg-[#1C2126] text-[#F1F3F4] shadow-sm border border-[#272D33]'
                    : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
                }`}
              >
                <UserCheck className={`w-3.5 h-3.5 ${currentRole === 'citizen' ? 'text-emerald-500' : 'text-[#68717B]'}`} />
                <span className="hidden sm:inline">Public Portal</span>
                <span className="sm:hidden">Public</span>
              </button>
            </>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile search button */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 rounded-xl bg-[#171B1F] border border-[#272D33] text-[#9AA3AD] hover:text-[#F1F3F4]"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Sound feedback toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              soundEnabled
                ? 'bg-[#171B1F] border-[#272D33] text-emerald-400 hover:text-emerald-300'
                : 'bg-[#171B1F] border-[#272D33] text-[#68717B] hover:text-[#9AA3AD]'
            }`}
            title={soundEnabled ? 'Mute operational sound feedback' : 'Enable sound feedback'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Driver Selector if Driver role is active */}
          {currentRole === 'driver' && (
            <div className="hidden lg:flex items-center gap-2 bg-[#171B1F] px-3 py-1.5 rounded-xl border border-[#272D33] text-xs">
              <span className="text-[#68717B] font-medium">Driver:</span>
              <select
                value={activeDriver.id}
                onChange={(e) => {
                  const found = drivers.find(d => d.id === e.target.value);
                  if (found) {
                    sound.playClick();
                    setActiveDriver(found);
                  }
                }}
                className="bg-transparent font-semibold text-[#F1F3F4] focus:outline-none cursor-pointer"
              >
                {drivers.map(d => (
                  <option key={d.id} value={d.id} className="bg-[#171B1F] text-[#F1F3F4]">{d.name} ({d.vehiclePlate})</option>
                ))}
              </select>
            </div>
          )}

          {/* AI Engine Status Badge */}
          <div className="hidden xl:flex items-center gap-2 bg-[#171B1F] px-3 py-1.5 rounded-xl border border-[#272D33]">
            <div className={`w-2 h-2 rounded-full ${
              aiEngineStatus === 'processing'
                ? 'bg-amber-500 animate-ping'
                : 'bg-emerald-500 animate-pulse'
            }`} />
            <span className="text-xs font-semibold text-[#9AA3AD] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              {aiEngineStatus === 'processing' ? 'AI: Forecasting...' : 'AI Engine: Active'}
            </span>
          </div>

          {/* User Account / Login & Sign Up Flow */}
          <div className="flex items-center gap-2 border-l pl-2 sm:pl-3 border-[#272D33]">
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#1C2126] text-emerald-400 border border-[#272D33] flex items-center justify-center font-bold text-xs">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full rounded-xl object-cover" />
                  ) : (
                    (user.displayName || user.email || 'User').substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-[#F1F3F4] leading-tight truncate max-w-[110px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-[#68717B] truncate max-w-[110px]">
                    {user.email || (currentRole === 'admin' ? 'Municipal Officer' : currentRole === 'driver' ? 'Fleet Driver' : 'Citizen')}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-1.5 text-[#9AA3AD] hover:text-rose-400 rounded-lg hover:bg-[#1C2126] transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm border border-emerald-600/40"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
