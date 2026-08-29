import React, { useState } from 'react';
import { CollectionRoute, WasteBin, DriverProfile, CollectionArea, RouteStop } from '../types';
import { 
  Sparkles, 
  Truck, 
  MapPin, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  Leaf, 
  Layers, 
  Send,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { fetchAiRouteOptimization } from '../services/aiService';

interface RouteOptimizerViewProps {
  routes: CollectionRoute[];
  bins: WasteBin[];
  areas: CollectionArea[];
  drivers: DriverProfile[];
  onDeployRoute: (route: CollectionRoute) => void;
  onUpdateRoutes: (updatedRoutes: CollectionRoute[]) => void;
  onSelectRouteForMap: (route: CollectionRoute) => void;
}

export const RouteOptimizerView: React.FC<RouteOptimizerViewProps> = ({
  routes,
  bins,
  areas,
  drivers,
  onDeployRoute,
  onUpdateRoutes,
  onSelectRouteForMap
}) => {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(routes[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetZone, setTargetZone] = useState<string>(areas[0]?.id || 'BLR-INDIRANAGAR');
  const [targetDriver, setTargetDriver] = useState<string>(drivers[0]?.id || '');

  const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const handleGenerateAiRoute = async () => {
    setIsGenerating(true);
    try {
      const zoneBins = bins.filter(b => b.areaId === targetZone || b.currentFillPercent >= 80);
      const driver = drivers.find(d => d.id === targetDriver) || drivers[0];
      const area = areas.find(a => a.id === targetZone) || areas[0];

      const aiResult = await fetchAiRouteOptimization(zoneBins, driver.name, driver.vehicleType);

      // Reconstruct stops based on AI ordering
      const newStops: RouteStop[] = aiResult.orderedBinIds.map((binId: string, idx: number) => {
        const bin = bins.find(b => b.id === binId) || zoneBins[0];
        return {
          id: `STOP-AI-${Date.now()}-${idx}`,
          binId: bin.id,
          sequence: idx + 1,
          binName: bin.name,
          address: bin.location.address,
          lat: bin.location.lat,
          lng: bin.location.lng,
          currentFillPercent: bin.currentFillPercent,
          predictedFillPercent: bin.predictedFillPercent,
          overflowRisk: bin.overflowRisk,
          status: 'PENDING',
          priority: bin.currentFillPercent >= 90 ? 'CRITICAL' : bin.currentFillPercent >= 75 ? 'HIGH' : 'MODERATE',
          estimatedKg: Math.round(bin.capacityLiters * 0.28 * (bin.currentFillPercent / 100))
        };
      });

      const newRoute: CollectionRoute = {
        id: `ROUTE-AI-${Date.now()}`,
        name: `AI Optimized Route - ${area.name}`,
        areaId: area.id,
        areaName: area.name,
        assignedDriverId: driver.id,
        assignedDriverName: driver.name,
        assignedVehicleId: driver.vehicleId,
        vehiclePlate: driver.vehiclePlate,
        status: 'SCHEDULED',
        priority: 'URGENT',
        stops: newStops,
        totalDistanceKm: aiResult.totalDistanceKm || 4.2,
        estimatedTimeMinutes: aiResult.estimatedMinutes || 35,
        co2SavingsKg: aiResult.co2SavedKg || 5.1,
        completedStopsCount: 0,
        aiRecommendationReason: aiResult.explanation || 'AI prioritized stops to prevent imminent overflow during peak pedestrian traffic.',
        startTime: 'Scheduled Now',
        lastUpdated: 'Just now'
      };

      const updated = [newRoute, ...routes];
      onUpdateRoutes(updated);
      setSelectedRouteId(newRoute.id);
      onSelectRouteForMap(newRoute);
    } catch (err) {
      console.error('Failed to generate AI route:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with AI Optimizer Generator */}
      <div className="bg-[#111417] p-6 rounded-2xl border border-[#272D33] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#F1F3F4]">
              AI Route Dispatcher &amp; Optimizer
            </h2>
            <span className="text-[10px] font-bold bg-[#171B1F] text-emerald-400 border border-[#272D33] px-2 py-0.5 rounded-md">
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="text-xs text-[#9AA3AD] mt-1 max-w-xl">
            Generates shortest-path multi-stop collection sequences weighted by predicted overflow risk, traffic velocity, and vehicle payload capacity.
          </p>
        </div>

        {/* Generate New AI Route Trigger Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={targetZone}
            onChange={(e) => setTargetZone(e.target.value)}
            className="text-xs font-semibold bg-[#171B1F] border border-[#272D33] rounded-xl px-3 py-2 text-[#F1F3F4] focus:outline-none focus:border-emerald-500"
          >
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>

          <select
            value={targetDriver}
            onChange={(e) => setTargetDriver(e.target.value)}
            className="text-xs font-semibold bg-[#171B1F] border border-[#272D33] rounded-xl px-3 py-2 text-[#F1F3F4] focus:outline-none focus:border-emerald-500"
          >
            {drivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.vehiclePlate})</option>
            ))}
          </select>

          <button
            onClick={handleGenerateAiRoute}
            disabled={isGenerating}
            className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm border border-emerald-600/40 flex items-center gap-2 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Route</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Split: Route Selector + Route Stop Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route List Cards */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-[#68717B] uppercase tracking-wider px-1">
            Active &amp; Scheduled Routes ({routes.length})
          </div>

          <div className="space-y-3">
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              const completedCount = route.stops.filter(s => s.status === 'COLLECTED').length;
              const totalStops = route.stops.length;
              const progress = totalStops > 0 ? (completedCount / totalStops) * 100 : 0;

              return (
                <div
                  key={route.id}
                  onClick={() => {
                    setSelectedRouteId(route.id);
                    onSelectRouteForMap(route);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#171B1F] border-emerald-500/80 shadow-md ring-1 ring-emerald-500/40'
                      : 'bg-[#111417] border-[#272D33] hover:border-[#3E454D]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        route.priority === 'URGENT' ? 'bg-rose-950/80 text-rose-400 border border-rose-800/80' : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                      }`}>
                        {route.priority}
                      </span>
                      <h4 className="text-sm font-bold text-[#F1F3F4] mt-1.5 leading-snug">
                        {route.name}
                      </h4>
                      <p className="text-xs text-[#68717B] mt-0.5">
                        Driver: <strong className="text-[#9AA3AD]">{route.assignedDriverName}</strong> ({route.vehiclePlate})
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      route.status === 'IN_PROGRESS' ? 'bg-amber-950/80 text-amber-400 border-amber-800/80' :
                      route.status === 'COMPLETED' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' : 'bg-[#1C2126] text-[#9AA3AD] border-[#272D33]'
                    }`}>
                      {route.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-[#9AA3AD] font-semibold mb-1 font-mono">
                      <span>Progress: {completedCount}/{totalStops} Stops</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0B0D0F] rounded-full overflow-hidden border border-[#272D33]/60">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics Footer */}
                  <div className="mt-3 pt-2.5 border-t border-[#272D33] flex items-center justify-between text-[11px] text-[#9AA3AD] font-medium font-mono">
                    <span className="flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-[#68717B]" />
                      {route.totalDistanceKm} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#68717B]" />
                      {route.estimatedTimeMinutes} min
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Leaf className="w-3 h-3" />
                      -{route.co2SavingsKg} kg CO₂
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Waypoint Stops & AI Dispatch Details */}
        {activeRoute && (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#111417] p-6 rounded-2xl border border-[#272D33] shadow-sm space-y-5">
              {/* Route Summary Top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#272D33] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#F1F3F4]">
                      {activeRoute.name}
                    </h3>
                    <span className="text-[10px] bg-[#171B1F] text-[#9AA3AD] border border-[#272D33] px-2 py-0.5 rounded font-bold">
                      Zone: {activeRoute.areaName}
                    </span>
                  </div>
                  <p className="text-xs text-[#9AA3AD] mt-1">
                    Assigned to <strong className="text-[#F1F3F4]">{activeRoute.assignedDriverName}</strong> · Vehicle: {activeRoute.vehiclePlate} ({activeRoute.assignedVehicleId})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeployRoute(activeRoute)}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm border border-emerald-600/40 flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Push to Driver Device</span>
                  </button>
                </div>
              </div>

              {/* AI Optimization Rationale Box */}
              <div className="p-4 bg-[#171B1F] rounded-2xl border border-[#272D33] flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#1C2126] text-emerald-400 border border-[#272D33] shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-[#F1F3F4]">AI Routing Rationale &amp; Efficiency</div>
                  <p className="text-[#9AA3AD] leading-relaxed">
                    {activeRoute.aiRecommendationReason}
                  </p>
                  <div className="flex items-center gap-4 pt-1 text-[11px] text-emerald-400 font-semibold font-mono">
                    <span>⚡ Distance: {activeRoute.totalDistanceKm} km</span>
                    <span>⏱ Est. Duration: {activeRoute.estimatedTimeMinutes} mins</span>
                    <span>🌿 CO₂ Reduction: {activeRoute.co2SavingsKg} kg</span>
                  </div>
                </div>
              </div>

              {/* Waypoint Stops Ordered List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#9AA3AD] uppercase tracking-wider">
                    Optimized Waypoint Sequence ({activeRoute.stops.length} Stops)
                  </span>
                  <span className="text-[11px] text-[#68717B] font-semibold">
                    Ordered by priority &amp; nearest traversal
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeRoute.stops.map((stop, index) => {
                    const isCollected = stop.status === 'COLLECTED';

                    return (
                      <div
                        key={stop.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isCollected
                            ? 'bg-[#171B1F]/60 border-[#272D33] opacity-60'
                            : stop.currentFillPercent >= 90
                            ? 'bg-[#171B1F] border-rose-800/60'
                            : 'bg-[#171B1F] border-[#272D33]'
                        }`}
                      >
                        {/* Sequence Number & Details */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 font-mono ${
                            isCollected
                              ? 'bg-emerald-700 text-white'
                              : stop.currentFillPercent >= 90
                              ? 'bg-rose-700 text-white'
                              : 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]'
                          }`}>
                            {isCollected ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#F1F3F4] truncate">
                                {stop.binName}
                              </span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                stop.overflowRisk === 'CRITICAL' ? 'bg-rose-950/80 text-rose-400 border-rose-800/80' :
                                stop.overflowRisk === 'HIGH' ? 'bg-orange-950/80 text-orange-400 border-orange-800/80' : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                              }`}>
                                {stop.overflowRisk}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#68717B] truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {stop.address}
                            </p>
                          </div>
                        </div>

                        {/* Fill & Weight Status */}
                        <div className="flex items-center gap-4 shrink-0 text-right">
                          <div>
                            <div className={`text-xs font-bold font-mono ${
                              stop.currentFillPercent >= 90 ? 'text-rose-400' :
                              stop.currentFillPercent >= 75 ? 'text-orange-400' : 'text-emerald-400'
                            }`}>
                              {stop.currentFillPercent}% Fill
                            </div>
                            <div className="text-[10px] text-[#68717B] font-medium font-mono">
                              ~{stop.estimatedKg} kg
                            </div>
                          </div>

                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                            isCollected ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' : 'bg-[#1C2126] text-[#9AA3AD] border-[#272D33]'
                          }`}>
                            {stop.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
