import React, { useState } from 'react';
import { WasteBin, CollectionArea, AIPredictionResult } from '../types';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  RefreshCw, 
  Sliders, 
  ShieldAlert,
  Flame,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { fetchAiAccumulationPredictions } from '../services/aiService';

interface PredictionsViewProps {
  bins: WasteBin[];
  areas: CollectionArea[];
  predictionData: AIPredictionResult | null;
  onUpdatePredictions: (data: AIPredictionResult) => void;
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({
  bins,
  areas,
  predictionData,
  onUpdatePredictions
}) => {
  const [surgeFactor, setSurgeFactor] = useState<number>(1.2);
  const [isForecasting, setIsForecasting] = useState<boolean>(false);
  const [selectedScenario, setSelectedScenario] = useState<string>('weekend_rush');

  const handleRunAiForecast = async (factor = surgeFactor) => {
    setIsForecasting(true);
    try {
      const result = await fetchAiAccumulationPredictions(bins, areas, factor);
      onUpdatePredictions(result);
    } catch (err) {
      console.error('Forecast error:', err);
    } finally {
      setIsForecasting(false);
    }
  };

  const applyScenario = (scenarioKey: string) => {
    setSelectedScenario(scenarioKey);
    let factor = 1.0;
    if (scenarioKey === 'normal') factor = 1.0;
    if (scenarioKey === 'weekend_rush') factor = 1.35;
    if (scenarioKey === 'downtown_festival') factor = 1.85;
    if (scenarioKey === 'storm_holiday') factor = 1.5;
    setSurgeFactor(factor);
    handleRunAiForecast(factor);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Surge Simulator & Forecast Trigger */}
      <div className="bg-[#111417] p-6 rounded-2xl border border-[#272D33] shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#F1F3F4]">
              AI Waste Accumulation &amp; Surge Predictor
            </h2>
            <span className="text-[10px] font-bold bg-[#171B1F] text-emerald-400 border border-[#272D33] px-2 py-0.5 rounded-md">
              Gemini 2.5 Flash
            </span>
          </div>
          <p className="text-xs text-[#9AA3AD] mt-1 max-w-xl">
            Simulates bin fill trajectories, predicts overflow risks before they occur, and synthesizes time-window collection schedules.
          </p>
        </div>

        {/* Scenario Quick Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyScenario('normal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              selectedScenario === 'normal'
                ? 'bg-[#1C2126] text-[#F1F3F4] border-[#272D33] shadow-sm'
                : 'bg-[#171B1F] text-[#9AA3AD] border-[#272D33] hover:text-[#F1F3F4]'
            }`}
          >
            Normal Day (1.0x)
          </button>
          <button
            onClick={() => applyScenario('weekend_rush')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              selectedScenario === 'weekend_rush'
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80 shadow-sm'
                : 'bg-[#171B1F] text-[#9AA3AD] border-[#272D33] hover:text-[#F1F3F4]'
            }`}
          >
            Weekend Rush (1.35x)
          </button>
          <button
            onClick={() => applyScenario('downtown_festival')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              selectedScenario === 'downtown_festival'
                ? 'bg-rose-950/80 text-rose-400 border-rose-800/80 shadow-sm'
                : 'bg-[#171B1F] text-[#9AA3AD] border-[#272D33] hover:text-[#F1F3F4]'
            }`}
          >
            Festival Event (1.85x)
          </button>

          <button
            onClick={() => handleRunAiForecast()}
            disabled={isForecasting}
            className="bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm border border-emerald-600/40 flex items-center gap-2 transition-all ml-1"
          >
            {isForecasting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Forecasting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Recalculate Predictions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Executive Briefing Card */}
      {predictionData && (
        <div className="bg-[#171B1F] text-[#F1F3F4] p-5 rounded-2xl border border-[#272D33] shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>AI Municipal Executive Briefing</span>
            </div>
            <span className="text-[10px] bg-[#1C2126] text-[#9AA3AD] border border-[#272D33] px-2 py-0.5 rounded font-mono">
              Live Telemetry Correlated
            </span>
          </div>
          <p className="text-sm text-[#9AA3AD] font-medium leading-relaxed mt-2">
            {predictionData.executiveSummary}
          </p>

          {/* Anomaly Callout Flags */}
          {predictionData.anomalies && predictionData.anomalies.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#272D33] flex flex-col sm:flex-row gap-3">
              {predictionData.anomalies.map((anomaly, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-amber-400 font-medium bg-[#1C2126] border border-[#272D33] px-3 py-1.5 rounded-xl">
                  <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{anomaly}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2-Column Layout: Area Fill Rates Table & Recommended Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Area-by-Area Accumulation Forecasts */}
        <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F1F3F4] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Area Waste Accumulation Rates &amp; Overflow Horizons
            </h3>
            <span className="text-[11px] text-[#68717B] font-mono">
              Surge: {surgeFactor}x
            </span>
          </div>

          <div className="space-y-3">
            {predictionData?.wasteAccumulationPredictions.map((pred, index) => {
              const isCritical = pred.risk === 'CRITICAL';
              const isHigh = pred.risk === 'HIGH';

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCritical
                      ? 'bg-[#171B1F] border-rose-800/80'
                      : isHigh
                      ? 'bg-[#171B1F] border-orange-800/80'
                      : 'bg-[#171B1F] border-[#272D33]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#F1F3F4]">{pred.area}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isCritical ? 'bg-rose-950/80 text-rose-400 border-rose-800/80' :
                        isHigh ? 'bg-orange-950/80 text-orange-400 border-orange-800/80' : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                      }`}>
                        {pred.risk}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#9AA3AD] mt-1 font-mono">
                      <span>Fill Rate: <strong className="text-[#F1F3F4]">+{pred.predictedFillRate}%/hr</strong></span>
                      <span>Expected: <strong className="text-[#F1F3F4]">{pred.expectedKg} kg</strong></span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-[10px] font-bold text-[#68717B] uppercase">
                      Time to Overflow
                    </div>
                    <div className={`text-sm font-bold font-mono ${
                      pred.timeToOverflowHours <= 2 ? 'text-rose-400 animate-pulse' :
                      pred.timeToOverflowHours <= 5 ? 'text-orange-400' : 'text-emerald-400'
                    }`}>
                      {pred.timeToOverflowHours <= 1 ? 'Under 1 Hour' : `${pred.timeToOverflowHours} Hours`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Recommended Collection Schedules */}
        <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F1F3F4] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              AI Recommended Collection Schedules
            </h3>
            <span className="text-[10px] font-bold bg-[#171B1F] text-emerald-400 border border-[#272D33] px-2 py-0.5 rounded-md">
              Automated
            </span>
          </div>

          <div className="space-y-3">
            {predictionData?.recommendedSchedule.map((sched, index) => (
              <div key={index} className="p-4 bg-[#171B1F] rounded-xl border border-[#272D33] space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#1C2126] text-emerald-400 border border-[#272D33] flex items-center justify-center font-bold text-xs">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F1F3F4]">{sched.timeWindow}</div>
                      <div className="text-[11px] text-[#9AA3AD] font-semibold">{sched.zone}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    sched.priority === 'URGENT' ? 'bg-rose-950/80 text-rose-400 border-rose-800/80' :
                    sched.priority === 'HIGH' ? 'bg-orange-950/80 text-orange-400 border-orange-800/80' : 'bg-[#1C2126] text-[#9AA3AD] border-[#272D33]'
                  }`}>
                    {sched.priority}
                  </span>
                </div>

                <p className="text-xs text-[#9AA3AD] pl-9">
                  {sched.reason}
                </p>

                <div className="pl-9 text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1 border-t border-[#272D33]">
                  <Truck className="w-3 h-3" />
                  <span>Recommended Vehicle: {sched.vehicleType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
