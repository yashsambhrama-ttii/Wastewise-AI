import React, { useEffect } from 'react';
import { WasteBin } from '../types';
import { 
  X, 
  Trash2, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Zap, 
  TrendingUp,
  Sliders,
  Copy,
  Check,
  ArrowLeft,
  Calendar,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { sound } from '../services/soundService';

interface BinDetailDrawerProps {
  bin: WasteBin | null;
  onClose: () => void;
  onUpdateFillPercent: (binId: string, newFill: number) => void;
  onCollectBin: (binId: string) => void;
  onReportIssue: (binId: string, type: 'overflow' | 'damaged') => void;
}

export const BinDetailDrawer: React.FC<BinDetailDrawerProps> = ({
  bin,
  onClose,
  onUpdateFillPercent,
  onCollectBin,
  onReportIssue
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!bin) return null;

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(`${bin.name} (${bin.id}) - ${bin.location.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return <span className="bg-rose-950/80 text-rose-300 text-xs font-extrabold px-2.5 py-0.5 rounded-md animate-pulse border border-rose-800/80">CRITICAL OVERFLOW</span>;
      case 'HIGH':
        return <span className="bg-orange-950/80 text-orange-300 text-xs font-bold px-2.5 py-0.5 rounded-md border border-orange-800/80">HIGH RISK</span>;
      case 'MODERATE':
        return <span className="bg-amber-950/80 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-amber-800/80">MODERATE</span>;
      default:
        return <span className="bg-emerald-950/80 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-emerald-800/80">OPTIMAL</span>;
    }
  };

  return (
    <>
      {/* Backdrop overlay for closing */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-45 transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-[#111417] shadow-2xl border-l border-[#272D33] z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300 text-[#F1F3F4]">
        {/* Header with clear Back & Close controls */}
        <div>
          <div className="p-4 border-b border-[#272D33] bg-[#171B1F] flex items-center justify-between">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-[#9AA3AD] hover:text-[#F1F3F4] hover:bg-[#1C2126] px-2.5 py-1.5 rounded-xl border border-[#272D33] transition-colors"
              title="Back / Close Drawer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-[#9AA3AD] hover:text-[#F1F3F4] hover:bg-[#1C2126] transition-colors"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Container Title & Risk Banner */}
          <div className="p-5 border-b border-[#272D33] bg-[#171B1F]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-extrabold text-[#68717B] uppercase tracking-widest font-mono">
                {bin.id} · {bin.type.toUpperCase()}
              </span>
              {getRiskBadge(bin.overflowRisk)}
            </div>
            <h3 className="text-base font-bold text-[#F1F3F4] leading-snug">
              {bin.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-[#9AA3AD] flex items-center gap-1 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#68717B] shrink-0" />
                <span className="truncate">{bin.location.address}</span>
              </p>
              <button
                onClick={handleCopy}
                className="text-[#68717B] hover:text-[#F1F3F4] p-1 rounded hover:bg-[#1C2126] transition-colors"
                title="Copy location info"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-4">
            {/* Main Fill Gauge Bar */}
            <div className="bg-[#171B1F] p-4 rounded-2xl border border-[#272D33]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#9AA3AD]">Current Fill Level</span>
                <span className={`text-2xl font-black font-mono ${
                  bin.currentFillPercent >= 90 ? 'text-rose-400' :
                  bin.currentFillPercent >= 75 ? 'text-orange-400' :
                  bin.currentFillPercent >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {bin.currentFillPercent}%
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#0B0D0F] rounded-full overflow-hidden border border-[#272D33]/60">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    bin.currentFillPercent >= 90 ? 'bg-rose-500' :
                    bin.currentFillPercent >= 75 ? 'bg-orange-500' :
                    bin.currentFillPercent >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${bin.currentFillPercent}%` }}
                />
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#272D33] flex items-center justify-between text-xs text-[#9AA3AD]">
                <span>Capacity: <strong className="text-[#F1F3F4] font-mono">{bin.capacityLiters} L</strong></span>
                <span>Current Weight: <strong className="text-[#F1F3F4] font-mono">~{Math.round(bin.capacityLiters * 0.28 * (bin.currentFillPercent / 100))} kg</strong></span>
              </div>
            </div>

            {/* Quick Simulation Presets */}
            <div className="p-3.5 bg-[#171B1F] rounded-xl border border-[#272D33] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#9AA3AD]">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#68717B]" />
                  Simulate Fill Level
                </span>
                <span className="text-emerald-400 font-extrabold font-mono">{bin.currentFillPercent}%</span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={bin.currentFillPercent}
                onChange={(e) => onUpdateFillPercent(bin.id, Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />

              <div className="flex items-center justify-between gap-1 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onUpdateFillPercent(bin.id, 5);
                  }}
                  className="text-[10px] bg-[#111417] hover:bg-[#1C2126] border border-[#272D33] text-emerald-400 px-2 py-1 rounded font-mono font-medium flex-1 text-center"
                >
                  Empty (5%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onUpdateFillPercent(bin.id, 75);
                  }}
                  className="text-[10px] bg-[#111417] hover:bg-[#1C2126] border border-[#272D33] text-orange-400 px-2 py-1 rounded font-mono font-medium flex-1 text-center"
                >
                  Warning (75%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playAlert();
                    onUpdateFillPercent(bin.id, 96);
                  }}
                  className="text-[10px] bg-[#111417] hover:bg-[#1C2126] border border-[#272D33] text-rose-400 px-2 py-1 rounded font-mono font-medium flex-1 text-center"
                >
                  Overflow (96%)
                </button>
              </div>
            </div>

            {/* AI Predictive Insights Card */}
            <div className="bg-[#171B1F] border border-[#272D33] p-4 rounded-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F1F3F4] mb-2.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>AI Collection Forecast</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#9AA3AD]">Predicted Overflow:</span>
                  <span className="font-bold text-rose-400">{bin.predictedOverflowTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA3AD]">Predicted 24h Fill:</span>
                  <span className="font-bold text-emerald-400 font-mono">{bin.predictedFillPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA3AD]">Recommended Collection:</span>
                  <span className="font-semibold text-[#F1F3F4]">{bin.recommendedCollectionTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9AA3AD]">Priority Score:</span>
                  <span className="font-bold text-[#F1F3F4] font-mono">{bin.priorityScore} / 100</span>
                </div>
              </div>
            </div>

            {/* Operational Waste Details (Clean, no unnecessary temp/sensor hardware metrics) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#171B1F] rounded-xl border border-[#272D33] flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-[#68717B] font-bold uppercase">Last Emptied</div>
                  <div className="text-xs font-bold text-[#F1F3F4] truncate">{bin.lastCollectionTime}</div>
                </div>
              </div>

              <div className="p-3 bg-[#171B1F] rounded-xl border border-[#272D33] flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-[#68717B] font-bold uppercase">Waste Stream</div>
                  <div className="text-xs font-bold text-[#F1F3F4] capitalize truncate">{bin.type}</div>
                </div>
              </div>
            </div>

            {/* Historical Readings Mini Chart */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#9AA3AD]">Fill Accumulation Today</span>
                <span className="text-[10px] text-[#68717B] font-semibold font-mono">Today's Log</span>
              </div>
              <div className="h-24 w-full bg-[#171B1F] rounded-xl border border-[#272D33] p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bin.historicalReadings || []}>
                    <defs>
                      <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="timestamp" stroke="#68717B" fontSize={9} tickLine={false} />
                    <YAxis stroke="#68717B" fontSize={9} domain={[0, 100]} tickLine={false} />
                    <Tooltip 
                      formatter={(value: any) => [`${value}%`, 'Fill Level']}
                      contentStyle={{ fontSize: '11px', borderRadius: '8px', backgroundColor: '#1C2126', borderColor: '#272D33', color: '#F1F3F4' }}
                    />
                    <Area type="monotone" dataKey="fillPercent" stroke="#10B981" strokeWidth={1.8} fill="url(#fillGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="p-5 border-t border-[#272D33] bg-[#171B1F] flex flex-col gap-2">
          <button
            onClick={() => {
              sound.playSuccess();
              onCollectBin(bin.id);
            }}
            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm border border-emerald-600/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Collected (Reset to 5%)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                sound.playAlert();
                onReportIssue(bin.id, 'overflow');
              }}
              className="bg-[#1C2126] hover:bg-rose-950/40 text-rose-400 border border-[#272D33] hover:border-rose-800/80 font-bold py-2 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Report Overflow</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onReportIssue(bin.id, 'damaged');
              }}
              className="bg-[#1C2126] hover:bg-[#272D33] text-[#9AA3AD] hover:text-[#F1F3F4] border border-[#272D33] font-semibold py-2 px-3 rounded-xl text-[11px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Report Damaged</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BinDetailDrawer;
