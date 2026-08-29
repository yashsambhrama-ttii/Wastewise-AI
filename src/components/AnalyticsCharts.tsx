import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { HISTORICAL_CHART_DATA, HOURLY_GENERATION_DATA } from '../data/mockData';
import { CollectionArea, WasteBin } from '../types';
import { Sparkles, TrendingUp, BarChart2, PieChart as PieIcon, Leaf } from 'lucide-react';

interface AnalyticsChartsProps {
  areas: CollectionArea[];
  bins: WasteBin[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ areas, bins }) => {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  // Waste by type pie data
  const wasteTypeData = [
    { name: 'General Municipal', value: 48, color: '#64748b' },
    { name: 'Recyclables (Plastic/Can)', value: 26, color: '#0ea5e9' },
    { name: 'Organic & Food', value: 18, color: '#10b981' },
    { name: 'Electronic & Battery', value: 8, color: '#f59e0b' },
  ];

  // Area breakdown data
  const areaBreakdown = areas.map(area => ({
    name: area.name.split(' ')[0],
    fullName: area.name,
    dailyTons: area.predictedDailyTons,
    fillAverage: area.currentFillAverage,
    risk: area.riskLevel
  }));

  return (
    <div className="space-y-6">
      {/* Header with Time Range Switcher */}
      <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#F1F3F4] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Waste Analytics &amp; Predictive Trends
          </h2>
          <p className="text-xs text-[#9AA3AD] mt-0.5">
            Real-time IoT historical accumulation patterns and AI forecast correlation.
          </p>
        </div>

        <div className="flex items-center bg-[#171B1F] p-1 rounded-xl border border-[#272D33] text-xs font-bold">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'daily' ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
            }`}
          >
            Today (Hourly)
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'weekly' ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
            }`}
          >
            Past 7 Days
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === 'monthly' ? 'bg-[#1C2126] text-[#F1F3F4] border border-[#272D33]' : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
            }`}
          >
            Monthly Aggregate
          </button>
        </div>
      </div>

      {/* Grid: 2 Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Predicted vs Actual Waste Generation */}
        <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F1F3F4]">
                Predicted vs. Actual Waste Volume (Tons)
              </h3>
              <p className="text-[11px] text-[#68717B]">
                Evaluating AI model convergence against weighbridge scale data
              </p>
            </div>
            <span className="text-[10px] font-bold bg-[#171B1F] text-emerald-400 border border-[#272D33] px-2 py-0.5 rounded-md font-mono">
              98.2% Accuracy
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HISTORICAL_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#68717B" fontSize={11} tickLine={false} />
                <YAxis stroke="#68717B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C2126', color: '#F1F3F4', borderRadius: '10px', border: '1px solid #272D33', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#9AA3AD' }} />
                <Bar dataKey="actualTons" name="Actual Measured (Tons)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="predictedTons" name="AI Forecast (Tons)" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Hourly Accumulation Velocity by Waste Stream */}
        <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#F1F3F4]">
                Diurnal Accumulation Velocity (Tons/Hour)
              </h3>
              <p className="text-[11px] text-[#68717B]">
                Peak accumulation shifts during lunch and evening rush
              </p>
            </div>
            <span className="text-[10px] font-bold bg-[#171B1F] text-[#9AA3AD] border border-[#272D33] px-2 py-0.5 rounded-md font-mono">
              Telemetry Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_GENERATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="recGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#68717B" fontSize={11} tickLine={false} />
                <YAxis stroke="#68717B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C2126', color: '#F1F3F4', borderRadius: '10px', border: '1px solid #272D33', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#9AA3AD' }} />
                <Area type="monotone" dataKey="general" name="General (Tons)" stroke="#10B981" fill="url(#genGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="recyclable" name="Recyclable (Tons)" stroke="#38BDF8" fill="url(#recGrad)" strokeWidth={2} />
                <Line type="monotone" dataKey="predicted" name="AI Cumulative Forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="3 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid: Area Breakdown & Waste Stream Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area-wise Waste Generation Bar Chart */}
        <div className="lg:col-span-2 bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm">
          <h3 className="text-sm font-bold text-[#F1F3F4] mb-1">
            Area-wise Predicted Waste Generation vs. Fill Average
          </h3>
          <p className="text-[11px] text-[#68717B] mb-4">
            Zone E (Old Town) and Zone A (Downtown) account for 58% of daily municipal waste load
          </p>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={areaBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#68717B" fontSize={11} tickLine={false} />
                <YAxis stroke="#68717B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1C2126', color: '#F1F3F4', borderRadius: '10px', border: '1px solid #272D33', fontSize: '11px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#9AA3AD' }} />
                <Bar dataKey="dailyTons" name="Daily Volume (Tons)" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fillAverage" name="Current Fill %" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Waste Stream Composition Doughnut */}
        <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#F1F3F4] mb-1">
              Waste Stream Composition
            </h3>
            <p className="text-[11px] text-[#68717B] mb-2">
              Categorized by IoT smart bin fill telemetry
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={wasteTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {wasteTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#1C2126', color: '#F1F3F4', borderRadius: '10px', border: '1px solid #272D33', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#272D33] text-xs">
            {wasteTypeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#9AA3AD] truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-bold text-[#F1F3F4] font-mono">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
