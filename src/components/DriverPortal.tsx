import React, { useState } from 'react';
import { CollectionRoute, WasteBin, DriverProfile, RouteStop } from '../types';
import { 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Navigation, 
  Flame, 
  Sparkles, 
  ShieldCheck, 
  Camera, 
  Zap, 
  Award,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InteractiveMap } from './InteractiveMap';

interface DriverPortalProps {
  driver: DriverProfile;
  assignedRoute: CollectionRoute | null;
  bins: WasteBin[];
  onCompleteStop: (routeId: string, stopId: string, binId: string) => void;
  onReportDriverIssue: (binId: string, type: 'overflow' | 'damaged', notes: string) => void;
  onSelectBin: (bin: WasteBin) => void;
  selectedBin: WasteBin | null;
  onQuickCollectBin?: (binId: string) => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({
  driver,
  assignedRoute,
  bins,
  onCompleteStop,
  onReportDriverIssue,
  onSelectBin,
  selectedBin,
  onQuickCollectBin
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'map'>('checklist');
  const [reportingStop, setReportingStop] = useState<RouteStop | null>(null);
  const [issueType, setIssueType] = useState<'overflow' | 'damaged'>('overflow');
  const [issueNotes, setIssueNotes] = useState<string>('');

  const completedStops = assignedRoute?.stops.filter(s => s.status === 'COLLECTED').length || 0;
  const totalStops = assignedRoute?.stops.length || 0;
  const completionPercent = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;

  // Filter urgent / critical bins across driver's operational vicinity
  const criticalNearbyBins = bins.filter(b => b.currentFillPercent >= 85 || b.overflowRisk === 'CRITICAL');

  const handleCollectAction = (stop: RouteStop) => {
    if (!assignedRoute) return;

    // Trigger celebratory confetti
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });

    onCompleteStop(assignedRoute.id, stop.id, stop.binId);
  };

  const handleDirectBinCollect = (binId: string) => {
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    if (onQuickCollectBin) {
      onQuickCollectBin(binId);
    } else if (assignedRoute) {
      const match = assignedRoute.stops.find(s => s.binId === binId);
      if (match) {
        onCompleteStop(assignedRoute.id, match.id, binId);
      }
    }
  };

  const handleSubmittingIssue = () => {
    if (!reportingStop) return;
    onReportDriverIssue(reportingStop.binId, issueType, issueNotes || 'Reported by driver during collection');
    setReportingStop(null);
    setIssueNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Driver Shift Banner */}
      <div className="bg-[#111417] p-5 sm:p-6 rounded-2xl border border-[#272D33] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 flex items-center justify-center font-bold text-xl shadow-sm">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#F1F3F4]">
                Driver Console · {driver.name}
              </h2>
              <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                ON DUTY
              </span>
            </div>
            <p className="text-xs text-[#9AA3AD] mt-0.5 font-mono">
              Vehicle: <strong className="text-[#F1F3F4]">{driver.vehiclePlate}</strong> ({driver.vehicleType}) · Max Payload: {driver.capacityTons}T
            </p>
          </div>
        </div>

        {/* Shift Stats Counters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-[#171B1F] border border-[#272D33] px-3.5 py-2 rounded-xl text-center flex-1 md:flex-none">
            <div className="text-[10px] font-bold text-[#68717B] uppercase">Stops Completed</div>
            <div className="text-base font-bold text-[#F1F3F4] font-mono">
              {completedStops} / {totalStops}
            </div>
          </div>

          <div className="bg-[#171B1F] border border-[#272D33] px-3.5 py-2 rounded-xl text-center flex-1 md:flex-none">
            <div className="text-[10px] font-bold text-[#68717B] uppercase">Payload Weight</div>
            <div className="text-base font-bold text-emerald-400 font-mono">
              {(driver.collectedWeightKgToday / 1000).toFixed(2)} T
            </div>
          </div>
        </div>
      </div>

      {/* Realtime Critical Overflow Alerts Panel */}
      {criticalNearbyBins.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-900/60 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Real-Time Critical Alerts ({criticalNearbyBins.length} Overflows Detected)</span>
            </div>
            <span className="text-[10px] bg-rose-900/50 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-700/50">
              High Priority Dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {criticalNearbyBins.slice(0, 3).map((bin) => (
              <div 
                key={bin.id}
                className="bg-[#171B1F] p-3 rounded-xl border border-rose-800/40 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#F1F3F4] truncate">{bin.name}</div>
                  <div className="text-[10px] text-[#9AA3AD] truncate">{bin.location.address}</div>
                  <div className="text-[10px] text-rose-400 font-mono font-bold mt-0.5">
                    {bin.currentFillPercent}% Fill · {bin.type}
                  </div>
                </div>

                <button
                  onClick={() => handleDirectBinCollect(bin.id)}
                  className="shrink-0 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg border border-emerald-600/40 flex items-center gap-1 transition-all"
                  title="Mark this container as collected"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Collect</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assigned Route Header & Progress */}
      {assignedRoute ? (
        <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                ACTIVE ASSIGNED ROUTE
              </span>
              <h3 className="text-base font-bold text-[#F1F3F4] mt-1">
                {assignedRoute.name}
              </h3>
              <p className="text-xs text-[#9AA3AD] mt-0.5">
                {assignedRoute.aiRecommendationReason}
              </p>
            </div>

            {/* Tab switch: Checklist vs Map */}
            <div className="flex items-center bg-[#171B1F] p-1 rounded-xl border border-[#272D33] text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('checklist')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'checklist' ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
                }`}
              >
                Stop Checklist ({assignedRoute.stops.length})
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === 'map' ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
                }`}
              >
                Turn-by-Turn Map
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#9AA3AD] mb-1.5 font-mono">
              <span>Route Completion</span>
              <span className="text-emerald-400 font-bold">{Math.round(completionPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-[#171B1F] rounded-full overflow-hidden border border-[#272D33]">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          {/* Tab 1: Checklist of Waste Stops */}
          {activeTab === 'checklist' ? (
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-[#68717B] uppercase tracking-wider">
                Sequenced Collection Stops
              </div>

              <div className="space-y-3">
                {assignedRoute.stops.map((stop, index) => {
                  const isCollected = stop.status === 'COLLECTED';
                  const isCritical = stop.currentFillPercent >= 90;

                  return (
                    <div
                      key={stop.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                        isCollected
                          ? 'bg-[#171B1F]/60 border-[#272D33] opacity-75'
                          : isCritical
                          ? 'bg-[#171B1F] border-rose-800/80'
                          : 'bg-[#171B1F] border-[#272D33]'
                      }`}
                    >
                      {/* Left: Stop Info */}
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isCollected
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                            : isCritical
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80 animate-pulse'
                            : 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]'
                        }`}>
                          {isCollected ? <CheckCircle2 className="w-4 h-4" /> : `#${index + 1}`}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-[#F1F3F4] truncate">
                              {stop.binName}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              isCritical ? 'bg-rose-950/80 text-rose-400 border-rose-800/80' :
                              stop.currentFillPercent >= 75 ? 'bg-orange-950/80 text-orange-400 border-orange-800/80' : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                            }`}>
                              {stop.overflowRisk}
                            </span>
                          </div>

                          <p className="text-xs text-[#9AA3AD] flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#68717B] shrink-0" />
                            <span className="truncate">{stop.address}</span>
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-[#68717B] font-medium mt-1.5 font-mono">
                            <span>Est. Weight: <strong className="text-[#9AA3AD]">~{stop.estimatedKg} kg</strong></span>
                            <span>·</span>
                            <span>Sensor Fill: <strong className={isCritical ? 'text-rose-400' : 'text-emerald-400'}>{stop.currentFillPercent}%</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => setReportingStop(stop)}
                          className="px-3 py-1.5 text-xs font-semibold text-[#9AA3AD] hover:text-[#F1F3F4] bg-[#1C2126] border border-[#272D33] rounded-lg transition-colors"
                        >
                          Report Issue
                        </button>

                        {isCollected ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Collected</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleCollectAction(stop)}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg border border-emerald-600/40 flex items-center gap-1.5 transition-all shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark as Collected</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Tab 2: Driver Interactive Map */
            <div className="h-[480px] w-full pt-2">
              <InteractiveMap
                bins={bins}
                activeRoute={assignedRoute}
                selectedBin={selectedBin}
                onSelectBin={onSelectBin}
                availableRoutes={[assignedRoute]}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#111417] p-12 rounded-2xl border border-[#272D33] text-center space-y-3">
          <Truck className="w-12 h-12 text-[#68717B] mx-auto" />
          <h3 className="text-base font-bold text-[#F1F3F4]">No Active Route Assigned</h3>
          <p className="text-xs text-[#9AA3AD] max-w-sm mx-auto">
            Your dispatcher will push the next AI optimized collection sequence directly to your dashboard.
          </p>
        </div>
      )}

      {/* Driver Incident Report Modal */}
      {reportingStop && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171B1F] rounded-2xl shadow-2xl border border-[#272D33] max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#272D33]">
              <h3 className="text-sm font-bold text-[#F1F3F4]">
                Driver Incident Log · Stop #{reportingStop.sequence}
              </h3>
              <button
                onClick={() => setReportingStop(null)}
                className="text-[#68717B] hover:text-[#F1F3F4] text-xs font-bold"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-[#9AA3AD] block mb-1">Issue Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIssueType('overflow')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    issueType === 'overflow' ? 'bg-rose-950/80 border-rose-800 text-rose-400' : 'bg-[#111417] border-[#272D33] text-[#9AA3AD]'
                  }`}
                >
                  Severe Spillage / Overflow
                </button>
                <button
                  type="button"
                  onClick={() => setIssueType('damaged')}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    issueType === 'damaged' ? 'bg-amber-950/80 border-amber-800 text-amber-400' : 'bg-[#111417] border-[#272D33] text-[#9AA3AD]'
                  }`}
                >
                  Damaged Bin / Lid Stuck
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#9AA3AD] block mb-1">Driver Field Notes</label>
              <textarea
                value={issueNotes}
                onChange={(e) => setIssueNotes(e.target.value)}
                placeholder="E.g. Lid latch broken, loose cardboard stacked on sidewalk beside bin."
                className="w-full h-24 p-3 bg-[#111417] border border-[#272D33] rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-[#F1F3F4] placeholder-[#68717B]"
              />
            </div>

            <button
              onClick={handleSubmittingIssue}
              className="w-full bg-[#1C2126] hover:bg-[#272D33] text-[#F1F3F4] border border-[#272D33] font-bold py-2.5 rounded-xl text-xs transition-all"
            >
              Submit Driver Incident to Municipal Dispatch
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
