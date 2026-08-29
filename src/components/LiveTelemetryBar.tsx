import React from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  Zap, 
  Sparkles, 
  RotateCcw, 
  Clock, 
  Radio,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../services/soundService';

interface LiveTelemetryBarProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onSimulateSpike: () => void;
  onEmptyAllCritical: () => void;
  onRandomEvent: () => void;
  criticalCount: number;
  simulatedTime: string;
  onSelectTimeOfDay: (timeStr: string) => void;
}

export const LiveTelemetryBar: React.FC<LiveTelemetryBarProps> = ({
  isSimulating,
  onToggleSimulation,
  onSimulateSpike,
  onEmptyAllCritical,
  onRandomEvent,
  criticalCount,
  simulatedTime,
  onSelectTimeOfDay
}) => {
  return (
    <div className="bg-[#111417] border border-[#272D33] rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm select-none">
      {/* Left: Stream Status & Live Time */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className={`w-2.5 h-2.5 rounded-full ${isSimulating ? 'bg-emerald-500 animate-ping' : 'bg-[#68717B]'}`} />
            <span className={`absolute w-2 h-2 rounded-full ${isSimulating ? 'bg-emerald-400' : 'bg-[#68717B]'}`} />
          </div>
          <span className="font-bold text-[#F1F3F4] flex items-center gap-1.5 font-mono text-[11px]">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            {isSimulating ? 'LIVE IOT STREAMING' : 'STREAM PAUSED'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-[#171B1F] border border-[#272D33] px-2.5 py-1 rounded-lg text-[11px] text-[#9AA3AD] font-mono">
          <Clock className="w-3 h-3 text-[#68717B]" />
          <span>Virtual Clock: <strong className="text-[#F1F3F4]">{simulatedTime}</strong></span>
        </div>
      </div>

      {/* Center: Shift Time Presets */}
      <div className="hidden lg:flex items-center gap-1 bg-[#0B0D0F] p-1 rounded-xl border border-[#272D33]">
        <button
          onClick={() => {
            sound.playClick();
            onSelectTimeOfDay('08:30 AM (Morning Rush)');
          }}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
            simulatedTime.includes('08:30') ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#68717B] hover:text-[#9AA3AD]'
          }`}
        >
          Morning Rush
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onSelectTimeOfDay('01:15 PM (Midday Peak)');
          }}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
            simulatedTime.includes('01:15') ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#68717B] hover:text-[#9AA3AD]'
          }`}
        >
          Midday Peak
        </button>
        <button
          onClick={() => {
            sound.playClick();
            onSelectTimeOfDay('07:45 PM (Evening Event)');
          }}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-colors ${
            simulatedTime.includes('07:45') ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#68717B] hover:text-[#9AA3AD]'
          }`}
        >
          Evening Rush
        </button>
      </div>

      {/* Right: Simulation Action Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Play/Pause Simulator */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleSimulation();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all border ${
            isSimulating
              ? 'bg-[#171B1F] text-[#9AA3AD] border-[#272D33] hover:text-[#F1F3F4] hover:bg-[#1C2126]'
              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900'
          }`}
          title={isSimulating ? 'Pause IoT sensor fluctuations' : 'Resume live sensor simulation'}
        >
          {isSimulating ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
          <span>{isSimulating ? 'Pause Stream' : 'Run Live'}</span>
        </button>

        {/* Rush Hour Surge Trigger */}
        <button
          onClick={() => {
            sound.playAlert();
            onSimulateSpike();
          }}
          className="flex items-center gap-1.5 bg-[#171B1F] hover:bg-[#1C2126] text-[#F1F3F4] px-3 py-1.5 rounded-xl border border-[#272D33] text-[11px] font-bold transition-all group"
          title="Inject +18% fill load across city bins to test overflow alerts"
        >
          <Zap className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Simulate Surge</span>
        </button>

        {/* Quick Empty Critical Bins */}
        {criticalCount > 0 && (
          <button
            onClick={() => {
              sound.playSuccess();
              onEmptyAllCritical();
            }}
            className="flex items-center gap-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-200 px-3 py-1.5 rounded-xl border border-rose-800/80 text-[11px] font-bold transition-all"
            title="Dispatch simulated mass-empty for all critical bins"
          >
            <CheckCircle2 className="w-3 h-3 text-rose-400" />
            <span>Flush {criticalCount} Critical</span>
          </button>
        )}
      </div>
    </div>
  );
};
