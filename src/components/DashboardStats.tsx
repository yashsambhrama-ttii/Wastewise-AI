import React from 'react';
import { WasteBin, DriverProfile } from '../types';
import { Trash2, AlertTriangle, Flame, Truck } from 'lucide-react';

interface DashboardStatsProps {
  bins: WasteBin[];
  drivers: DriverProfile[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ bins, drivers }) => {
  const totalBins = bins.length;
  // Requiring collection: fill >= 75%
  const requiringCollection = bins.filter(b => b.currentFillPercent >= 75).length;
  // Critical overflow: fill >= 90% or status === 'overflow'
  const criticalOverflow = bins.filter(b => b.currentFillPercent >= 90 || b.overflowRisk === 'CRITICAL').length;
  const activeFleet = drivers.filter(d => d.status === 'ACTIVE' || d.status === 'ON_DUTY').length;
  const totalFleet = drivers.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
      {/* 1. Total Smart Bins */}
      <div className="bg-[#111417] p-4.5 rounded-2xl border border-[#272D33] flex flex-col justify-between hover:border-[#374151] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[#9AA3AD] text-xs font-bold uppercase tracking-wider">
            Total Smart Bins
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#171B1F] border border-[#272D33] text-[#9AA3AD] flex items-center justify-center">
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-[#F1F3F4] tracking-tight font-mono">
            {totalBins} <span className="text-xs font-normal text-[#68717B] font-sans">deployed</span>
          </div>
        </div>
        <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
          <span>+4 IoT sensors online</span>
        </div>
      </div>

      {/* 2. Requiring Collection */}
      <div className="bg-[#111417] p-4.5 rounded-2xl border border-[#272D33] flex flex-col justify-between hover:border-[#374151] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[#9AA3AD] text-xs font-bold uppercase tracking-wider">
            Requiring Collection
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#171B1F] border border-[#272D33] text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight font-mono">
            {requiringCollection}
          </div>
        </div>
        <div className="text-xs text-[#68717B] font-medium">
          Fill level &gt; 75% threshold
        </div>
      </div>

      {/* 3. Critical Overflow */}
      <div className="bg-[#111417] p-4.5 rounded-2xl border border-[#272D33] flex flex-col justify-between hover:border-[#374151] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[#9AA3AD] text-xs font-bold uppercase tracking-wider">
            Critical Overflow
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#171B1F] border border-rose-900/60 text-rose-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-rose-400 tracking-tight font-mono">
            {criticalOverflow}
          </div>
        </div>
        <div className="text-xs text-rose-400/90 font-medium flex items-center gap-1">
          <span>Immediate priority dispatch</span>
        </div>
      </div>

      {/* 4. Active Fleet */}
      <div className="bg-[#111417] p-4.5 rounded-2xl border border-[#272D33] flex flex-col justify-between hover:border-[#374151] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-[#9AA3AD] text-xs font-bold uppercase tracking-wider">
            Active Fleet
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#171B1F] border border-[#272D33] text-emerald-400 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="my-2">
          <div className="text-3xl font-extrabold text-[#F1F3F4] tracking-tight font-mono">
            {activeFleet} <span className="text-sm text-[#68717B] font-medium font-sans">/ {totalFleet}</span>
          </div>
        </div>
        <div className="text-xs text-emerald-400 font-semibold">
          {totalFleet - activeFleet} vehicles on standby
        </div>
      </div>
    </div>
  );
};
