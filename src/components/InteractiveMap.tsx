import React, { useState, useMemo } from 'react';
import { WasteBin, CollectionRoute, OverflowRisk, CollectionArea, DepotLocation } from '../types';
import { 
  Navigation, 
  Sparkles, 
  MapPin, 
  Layers, 
  Filter, 
  Zap, 
  Truck, 
  Clock, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  CheckCircle2,
  Crosshair,
  Trash2,
  X,
  Warehouse,
  Compass,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { sound } from '../services/soundService';

interface InteractiveMapProps {
  bins: WasteBin[];
  activeRoute?: CollectionRoute | null;
  selectedBin: WasteBin | null;
  onSelectBin: (bin: WasteBin) => void;
  onDeployRouteToDriver?: (route: CollectionRoute) => void;
  availableRoutes: CollectionRoute[];
  onSelectRoute?: (route: CollectionRoute) => void;
  onCollectBin?: (binId: string) => void;
  areas?: CollectionArea[];
  depot?: DepotLocation;
  onSelectAreaFilter?: (areaId: string) => void;
  onQuickReportAddress?: (lat: number, lng: number, address: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  bins,
  activeRoute,
  selectedBin,
  onSelectBin,
  onDeployRouteToDriver,
  availableRoutes,
  onSelectRoute,
  onCollectBin,
  areas = [],
  depot,
  onSelectAreaFilter,
  onQuickReportAddress
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('ALL');
  const [wasteTypeFilter, setWasteTypeFilter] = useState<string>('ALL');
  const [selectedAreaId, setSelectedAreaId] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showRouteLayer, setShowRouteLayer] = useState<boolean>(true);
  const [showDepotLayer, setShowDepotLayer] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'pins' | 'heatmap'>('pins');
  const [showControlsDrawer, setShowControlsDrawer] = useState<boolean>(false);

  // Filtered bins
  const filteredBins = useMemo(() => {
    return bins.filter(bin => {
      if (wasteTypeFilter !== 'ALL' && bin.type !== wasteTypeFilter) return false;
      if (selectedAreaId !== 'ALL' && bin.areaId !== selectedAreaId) return false;
      if (filter === 'ALL') return true;
      if (filter === 'CRITICAL') return bin.currentFillPercent >= 90 || bin.overflowRisk === 'CRITICAL';
      if (filter === 'HIGH') return bin.currentFillPercent >= 75 && bin.currentFillPercent < 90;
      if (filter === 'MODERATE') return bin.currentFillPercent >= 50 && bin.currentFillPercent < 75;
      if (filter === 'LOW') return bin.currentFillPercent < 50;
      return true;
    });
  }, [bins, filter, wasteTypeFilter, selectedAreaId]);

  // Bengaluru Coordinate Projection Bounds (Spanning Yelahanka/Hebbal down to Electronic City, Malleshwaram to Whitefield)
  const bounds = {
    minLat: 12.8350,
    maxLat: 13.0450,
    minLng: 77.5300,
    maxLng: 77.7650
  };

  const projectCoords = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
    const y = (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getMarkerColor = (fill: number, risk: OverflowRisk) => {
    if (fill >= 90 || risk === 'CRITICAL') {
      return {
        bg: 'bg-rose-600',
        ring: 'ring-rose-950 ring-2',
        border: 'border-rose-400',
        text: 'text-rose-400',
        label: 'CRITICAL',
        pulse: true
      };
    }
    if (fill >= 75 || risk === 'HIGH') {
      return {
        bg: 'bg-orange-600',
        ring: 'ring-orange-950 ring-2',
        border: 'border-orange-400',
        text: 'text-orange-400',
        label: 'HIGH',
        pulse: false
      };
    }
    if (fill >= 50 || risk === 'MODERATE') {
      return {
        bg: 'bg-amber-600',
        ring: 'ring-amber-950',
        border: 'border-amber-400',
        text: 'text-amber-400',
        label: 'MODERATE',
        pulse: false
      };
    }
    return {
      bg: 'bg-emerald-600',
      ring: 'ring-emerald-950',
      border: 'border-emerald-400',
      text: 'text-emerald-400',
      label: 'OPTIMAL',
      pulse: false
    };
  };

  // Build SVG path for active route
  const routePathD = useMemo(() => {
    if (!activeRoute || !activeRoute.stops || activeRoute.stops.length < 2) return '';
    const points = activeRoute.stops.map(s => projectCoords(s.lat, s.lng));
    return points.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [activeRoute]);

  const criticalCount = bins.filter(b => b.currentFillPercent >= 90).length;
  const highCount = bins.filter(b => b.currentFillPercent >= 75 && b.currentFillPercent < 90).length;
  const moderateCount = bins.filter(b => b.currentFillPercent >= 50 && b.currentFillPercent < 75).length;
  const lowCount = bins.filter(b => b.currentFillPercent < 50).length;

  const focusCriticalBin = () => {
    const mostCritical = [...bins].sort((a, b) => b.currentFillPercent - a.currentFillPercent)[0];
    if (mostCritical) {
      sound.playAlert();
      onSelectBin(mostCritical);
    }
  };

  // Default Central Bengaluru Depot coords if not provided
  const currentDepot = depot || {
    depotId: 'DEPOT-BLR-CENTRAL',
    name: 'BBMP Central Waste Logistics Depot & MRF Hub',
    address: 'Majestic / Corporation Circle, Bengaluru',
    latitude: 12.9767,
    longitude: 77.5713,
    activeVehiclesCount: 18
  };

  const depotPos = projectCoords(currentDepot.latitude, currentDepot.longitude);

  return (
    <div className="relative w-full h-full min-h-[580px] bg-[#0B0D0F] rounded-2xl border border-[#272D33] shadow-sm overflow-hidden flex flex-col select-none">
      
      {/* 1. SEPARATE CLEAN TOP BAR (Outside & Above the Map Canvas to Eliminate Clutter) */}
      <div className="bg-[#111417] border-b border-[#272D33] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-20">
        
        {/* Left: Bengaluru Grid Header & Zone Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#171B1F] border border-[#272D33] text-emerald-400">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F1F3F4] tracking-wide">
                  Bengaluru Smart Municipal Grid
                </span>
                <span className="text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-1.5 py-0.5 rounded font-bold font-mono">
                  {filteredBins.length} Visible
                </span>
              </div>
              <span className="text-[10px] text-[#9AA3AD]">
                BBMP Live IoT Waste Telemetry Map (12.97° N, 77.59° E)
              </span>
            </div>
          </div>

          {/* Zone Selector Dropdown */}
          <div className="min-w-[190px]">
            <select
              value={selectedAreaId}
              onChange={(e) => {
                sound.playClick();
                setSelectedAreaId(e.target.value);
                if (onSelectAreaFilter) onSelectAreaFilter(e.target.value);
              }}
              className="w-full text-xs font-medium bg-[#171B1F] border border-[#272D33] rounded-lg px-2.5 py-1.5 text-[#F1F3F4] focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ALL">All 12 Bengaluru Zones</option>
              <option value="BLR-INDIRANAGAR">Indiranagar 100ft Corridor</option>
              <option value="BLR-KORAMANGALA">Koramangala 5th/7th Block</option>
              <option value="BLR-HSR">HSR Layout Sectors 1-7</option>
              <option value="BLR-MGROAD">MG Road &amp; Brigade CBD</option>
              <option value="BLR-WHITEFIELD">Whitefield ITPL Corridor</option>
              <option value="BLR-MALLESHWARAM">Malleshwaram Sampige Market</option>
              <option value="BLR-YESHWANTHPUR">Yeshwanthpur APMC Yard</option>
              <option value="BLR-MARATHAHALLI">Marathahalli ORR Junction</option>
              <option value="BLR-JAYANAGAR">Jayanagar 4th Block</option>
              <option value="BLR-JPNAGAR">JP Nagar Cultural Zone</option>
              <option value="BLR-ECITY">Electronic City Phase 1/2</option>
              <option value="BLR-HEBBAL">Hebbal Outer Hub</option>
            </select>
          </div>
        </div>

        {/* Center/Right: Quick Status Pill Filters & Stream Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter Buttons */}
          <div className="flex items-center bg-[#171B1F] p-0.5 rounded-lg border border-[#272D33] text-[11px]">
            <button
              onClick={() => { sound.playClick(); setFilter('ALL'); }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filter === 'ALL' ? 'bg-[#272D33] text-[#F1F3F4]' : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
              }`}
            >
              All ({bins.length})
            </button>
            <button
              onClick={() => { sound.playClick(); setFilter('CRITICAL'); }}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                filter === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-rose-400 hover:bg-rose-950/40'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => { sound.playClick(); setFilter('HIGH'); }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filter === 'HIGH' ? 'bg-orange-950 text-orange-300 border border-orange-800' : 'text-orange-400 hover:bg-orange-950/40'
              }`}
            >
              High ({highCount})
            </button>
            <button
              onClick={() => { sound.playClick(); setFilter('LOW'); }}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filter === 'LOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'text-emerald-400 hover:bg-emerald-950/40'
              }`}
            >
              Optimal ({lowCount})
            </button>
          </div>

          {/* Stream Selector */}
          <div className="hidden xl:flex items-center gap-1 bg-[#171B1F] px-2 py-1 rounded-lg border border-[#272D33] text-[10px]">
            <span className="text-[#68717B] font-semibold">Stream:</span>
            {['ALL', 'general', 'recyclable', 'organic'].map(type => (
              <button
                key={type}
                onClick={() => { sound.playClick(); setWasteTypeFilter(type); }}
                className={`px-1.5 py-0.5 rounded capitalize font-medium ${
                  wasteTypeFilter === type ? 'bg-[#272D33] text-[#F1F3F4]' : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Map Layer Action Buttons */}
          <div className="flex items-center gap-1.5">
            {criticalCount > 0 && (
              <button
                onClick={focusCriticalBin}
                className="flex items-center gap-1 bg-rose-950/90 hover:bg-rose-900 text-rose-300 px-2.5 py-1.5 rounded-lg text-xs font-bold border border-rose-800/80 transition-all"
                title="Focus highest-risk Bengaluru container"
              >
                <Crosshair className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="hidden md:inline">Focus Critical</span>
              </button>
            )}

            <button
              onClick={() => { sound.playClick(); setViewMode(viewMode === 'pins' ? 'heatmap' : 'pins'); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                viewMode === 'heatmap'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-[#171B1F] text-[#9AA3AD] border-[#272D33] hover:text-[#F1F3F4]'
              }`}
              title="Toggle Heatmap vs Pin Grid"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{viewMode === 'heatmap' ? 'Heatmap' : 'Pins'}</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setShowDepotLayer(!showDepotLayer); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showDepotLayer
                  ? 'bg-[#171B1F] text-emerald-400 border-emerald-800/80'
                  : 'bg-[#171B1F] text-[#9AA3AD] border-[#272D33] hover:text-[#F1F3F4]'
              }`}
              title="Toggle BBMP Central Depot Hub"
            >
              <Warehouse className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Depot</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setShowRouteLayer(!showRouteLayer); }}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showRouteLayer
                  ? 'bg-emerald-700 text-white border-emerald-600'
                  : 'bg-[#171B1F] text-[#9AA3AD] border-[#272D33] hover:text-[#F1F3F4]'
              }`}
              title="Toggle Route Paths"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Routes</span>
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center bg-[#171B1F] rounded-lg border border-[#272D33] p-0.5">
              <button
                onClick={() => { sound.playClick(); setZoomLevel(prev => Math.min(prev + 0.2, 1.8)); }}
                className="p-1 text-[#9AA3AD] hover:text-[#F1F3F4] rounded hover:bg-[#272D33]"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { sound.playClick(); setZoomLevel(prev => Math.max(prev - 0.2, 0.8)); }}
                className="p-1 text-[#9AA3AD] hover:text-[#F1F3F4] rounded hover:bg-[#272D33]"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { sound.playClick(); setZoomLevel(1); }}
                className="p-1 text-[#68717B] hover:text-[#F1F3F4] rounded hover:bg-[#272D33]"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. REALISTIC BENGALURU CARTOGRAPHIC MAP CANVAS */}
      <div className="relative flex-1 w-full h-full bg-[#0A0D11] overflow-hidden">
        
        {/* Fine coordinate cartography grid */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-300"
          style={{
            backgroundImage: `
              linear-gradient(to right, #38414A 1px, transparent 1px),
              linear-gradient(to bottom, #38414A 1px, transparent 1px)
            `,
            backgroundSize: `${35 * zoomLevel}px ${35 * zoomLevel}px`,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        />

        {/* Realistic Bengaluru Geographic Layout (SVG Roads, Lakes, Parks, Arteries) */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Green Belt & Parks (Cubbon Park, Lalbagh, IISc Green Zone) */}
            {/* Cubbon Park (near CBD) */}
            <path d="M 31 32 C 32 30, 36 31, 35 34 C 34 36, 31 35, 31 32 Z" fill="#064E3B" opacity="0.45" />
            <text x="31" y="31" fill="#10B981" fontSize="1.8" opacity="0.65" fontWeight="bold">Cubbon Park</text>

            {/* Lalbagh Botanical Garden (South Central) */}
            <ellipse cx="32" cy="46" rx="3.5" ry="4" fill="#064E3B" opacity="0.4" />
            <text x="30" y="46" fill="#10B981" fontSize="1.8" opacity="0.65" fontWeight="bold">Lalbagh</text>

            {/* IISc & GKVK Green Corridors (North West) */}
            <path d="M 16 18 C 18 16, 22 17, 21 21 C 19 23, 15 21, 16 18 Z" fill="#064E3B" opacity="0.35" />
            <text x="16" y="17" fill="#10B981" fontSize="1.8" opacity="0.65" fontWeight="bold">IISc Campus</text>

            {/* Realistic Bengaluru Water Bodies / Lakes */}
            {/* Bellandur Lake (East) */}
            <path d="M 64 47 C 67 44, 73 46, 72 50 C 70 53, 63 51, 64 47 Z" fill="#0369A1" opacity="0.5" />
            <text x="65" y="46" fill="#38BDF8" fontSize="1.7" opacity="0.75" fontWeight="bold">Bellandur Lake</text>

            {/* Varthur Lake (Further East Whitefield) */}
            <ellipse cx="84" cy="48" rx="4.5" ry="3" fill="#0369A1" opacity="0.45" />
            <text x="82" y="47" fill="#38BDF8" fontSize="1.6" opacity="0.7" fontWeight="bold">Varthur Lake</text>

            {/* Agara Lake (HSR Layout) */}
            <ellipse cx="53" cy="63" rx="3.2" ry="2.2" fill="#0369A1" opacity="0.55" />
            <text x="50" y="62" fill="#38BDF8" fontSize="1.6" opacity="0.75" fontWeight="bold">Agara Lake</text>

            {/* Ulsoor Lake (Central East / Indiranagar Border) */}
            <ellipse cx="39" cy="33" rx="2.5" ry="2" fill="#0369A1" opacity="0.55" />
            <text x="38" y="32" fill="#38BDF8" fontSize="1.6" opacity="0.75" fontWeight="bold">Ulsoor Lake</text>

            {/* Sankey Tank (Malleshwaram / Sadashivanagar) */}
            <ellipse cx="20" cy="23" rx="2.2" ry="1.6" fill="#0369A1" opacity="0.5" />
            <text x="18" y="22" fill="#38BDF8" fontSize="1.6" opacity="0.75" fontWeight="bold">Sankey Tank</text>

            {/* Hebbal Lake (North) */}
            <ellipse cx="30" cy="8" rx="3.5" ry="2" fill="#0369A1" opacity="0.45" />
            <text x="29" y="7" fill="#38BDF8" fontSize="1.6" opacity="0.7" fontWeight="bold">Hebbal Lake</text>

            {/* MAJOR BENGALURU HIGHWAYS & ARTERIES (Realistic Geometrics) */}
            {/* 1. Outer Ring Road (ORR) Expressway Arc */}
            <path 
              d="M 28 8 C 50 12, 82 22, 78 52 C 75 70, 58 78, 48 83" 
              fill="none" 
              stroke="#4B5563" 
              strokeWidth="2.6" 
              strokeLinecap="round"
            />
            {/* ORR Highway Inner Lane */}
            <path 
              d="M 28 8 C 50 12, 82 22, 78 52 C 75 70, 58 78, 48 83" 
              fill="none" 
              stroke="#6B7280" 
              strokeWidth="0.8" 
              strokeDasharray="2 2"
            />

            {/* 2. Elevated Electronic City Expressway / Hosur Road (CBD -> Silk Board -> E-City) */}
            <path 
              d="M 33 42 Q 44 65 59 94" 
              fill="none" 
              stroke="#6366F1" 
              strokeWidth="2.2" 
              opacity="0.8"
            />

            {/* 3. Old Airport Road & Varthur Rd (CBD -> Indiranagar -> Marathahalli -> Whitefield) */}
            <line x1="33" y1="36" x2="94" y2="44" stroke="#4B5563" strokeWidth="2.0" />

            {/* 4. Indiranagar 100 Feet Road Spine (Old Airport Rd -> CMH -> Old Madras Rd) */}
            <line x1="48" y1="28" x2="48" y2="44" stroke="#4B5563" strokeWidth="1.8" />

            {/* 5. Bellary Road (CBD -> Hebbal Flyover -> Kempegowda Intl Airport Corridor) */}
            <line x1="33" y1="36" x2="30" y2="4" stroke="#4B5563" strokeWidth="2.2" />

            {/* 6. Tumkur Road & Sampige Rd Spine (CBD -> Malleshwaram -> Yeshwanthpur -> Peenya) */}
            <line x1="33" y1="36" x2="7" y2="12" stroke="#4B5563" strokeWidth="2.0" />

            {/* 7. Bannerghatta & Kanakapura Rd Corridors (Southward) */}
            <line x1="33" y1="46" x2="24" y2="92" stroke="#374151" strokeWidth="1.8" />
            <line x1="33" y1="46" x2="36" y2="94" stroke="#374151" strokeWidth="1.6" />

            {/* 8. Whitefield Main Road / ITPL Spine */}
            <line x1="76" y1="36" x2="95" y2="34" stroke="#374151" strokeWidth="1.8" />
            <line x1="76" y1="36" x2="94" y2="48" stroke="#374151" strokeWidth="1.6" />

            {/* Secondary Residential Road Grids in Key Layouts */}
            {/* Koramangala Grid */}
            <line x1="36" y1="48" x2="46" y2="48" stroke="#272D33" strokeWidth="1.2" />
            <line x1="36" y1="52" x2="46" y2="52" stroke="#272D33" strokeWidth="1.2" />
            <line x1="41" y1="46" x2="41" y2="56" stroke="#272D33" strokeWidth="1.2" />

            {/* HSR Layout Sectors 1-7 Grid */}
            <line x1="46" y1="62" x2="56" y2="62" stroke="#272D33" strokeWidth="1.2" />
            <line x1="46" y1="67" x2="56" y2="67" stroke="#272D33" strokeWidth="1.2" />
            <line x1="51" y1="60" x2="51" y2="72" stroke="#272D33" strokeWidth="1.2" />

            {/* Jayanagar 9-Block Grid */}
            <line x1="22" y1="56" x2="30" y2="56" stroke="#272D33" strokeWidth="1.2" />
            <line x1="22" y1="62" x2="30" y2="62" stroke="#272D33" strokeWidth="1.2" />
            <line x1="26" y1="52" x2="26" y2="66" stroke="#272D33" strokeWidth="1.2" />

            {/* Malleshwaram Crosses Grid */}
            <line x1="16" y1="24" x2="24" y2="24" stroke="#272D33" strokeWidth="1.2" />
            <line x1="16" y1="28" x2="24" y2="28" stroke="#272D33" strokeWidth="1.2" />
            <line x1="20" y1="20" x2="20" y2="32" stroke="#272D33" strokeWidth="1.2" />
          </svg>
        </div>

        {/* Clean, Non-Obtrusive Bengaluru Landmark Badges */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* North Zone */}
          <div className="absolute top-[6%] left-[28%] text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider bg-[#111417]/80 px-2 py-0.5 rounded border border-[#272D33]/60 backdrop-blur-sm">
            Hebbal &amp; Manyata Tech Park
          </div>
          
          {/* Central CBD */}
          <div className="absolute top-[34%] left-[28%] text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-[#111417]/90 px-2 py-0.5 rounded border border-emerald-700/60 backdrop-blur-sm shadow-md">
            MG Road / Brigade CBD
          </div>

          {/* Indiranagar */}
          <div className="absolute top-[30%] left-[47%] text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider bg-[#111417]/80 px-2 py-0.5 rounded border border-[#272D33]/60 backdrop-blur-sm">
            Indiranagar 100ft Rd
          </div>

          {/* Koramangala */}
          <div className="absolute top-[50%] left-[37%] text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider bg-[#111417]/80 px-2 py-0.5 rounded border border-[#272D33]/60 backdrop-blur-sm">
            Koramangala 5th &amp; 7th Block
          </div>

          {/* HSR */}
          <div className="absolute top-[64%] left-[47%] text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider bg-[#111417]/80 px-2 py-0.5 rounded border border-[#272D33]/60 backdrop-blur-sm">
            HSR Layout Sectors 1-7
          </div>

          {/* Whitefield */}
          <div className="absolute top-[32%] right-[5%] text-[10px] font-bold text-sky-400 uppercase tracking-wider bg-[#111417]/90 px-2 py-0.5 rounded border border-sky-700/60 backdrop-blur-sm">
            Whitefield ITPL
          </div>

          {/* Marathahalli */}
          <div className="absolute top-[48%] right-[17%] text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider bg-[#111417]/80 px-2 py-0.5 rounded border border-[#272D33]/60 backdrop-blur-sm">
            Marathahalli ORR
          </div>

          {/* Malleshwaram & Yeshwanthpur */}
          <div className="absolute top-[16%] left-[6%] text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider bg-[#111417]/80 px-2 py-0.5 rounded border border-[#272D33]/60 backdrop-blur-sm">
            Malleshwaram &amp; Yeshwanthpur
          </div>

          {/* Jayanagar & JP Nagar */}
          <div className="absolute bottom-[24%] left-[17%] text-[10px] font-bold text-[#9AA3AD] uppercase tracking-wider bg-[#111417]/80 px-2 py-0.5 rounded border border-[#272D33]/60 backdrop-blur-sm">
            Jayanagar &amp; JP Nagar
          </div>

          {/* Electronic City */}
          <div className="absolute bottom-[7%] right-[27%] text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-[#111417]/90 px-2 py-0.5 rounded border border-indigo-700/60 backdrop-blur-sm">
            Electronic City Phase 1/2
          </div>
        </div>

        {/* SVG Route Line connecting stops */}
        {showRouteLayer && activeRoute && (
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Dark Green Trace Path */}
              <path
                d={routePathD}
                fill="none"
                stroke="#064E3B"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
              {/* Main High-Visibility Route Line */}
              <path
                d={routePathD}
                fill="none"
                stroke="#10B981"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="2 1"
              />
            </svg>
          </div>
        )}

        {/* Depot Location Marker */}
        {showDepotLayer && (
          <div 
            className="absolute inset-0 w-full h-full pointer-events-none z-25 transition-transform duration-300"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <div
              style={{ left: `${depotPos.x}%`, top: `${depotPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group pointer-events-auto"
              title={`${currentDepot.name} (${currentDepot.address})`}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute -inset-3 rounded-full bg-emerald-500/15 animate-ping pointer-events-none" />
                <div className="w-8 h-8 rounded-xl bg-[#111417] text-emerald-400 border-2 border-emerald-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform">
                  <Warehouse className="w-4 h-4" />
                </div>
              </div>

              {/* Hover Depot Card */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-[#111417] text-[#F1F3F4] text-xs p-2.5 rounded-xl shadow-2xl z-40 w-56 pointer-events-none border border-emerald-600/40">
                <div className="font-bold text-emerald-400 text-[11px] flex items-center gap-1">
                  <Warehouse className="w-3 h-3" />
                  <span>BBMP LOGISTICS DEPOT</span>
                </div>
                <div className="font-bold text-[#F1F3F4] mt-0.5">{currentDepot.name}</div>
                <div className="text-[10px] text-[#9AA3AD] mt-0.5">{currentDepot.address}</div>
                <div className="mt-1 pt-1 border-t border-[#272D33] text-[10px] text-emerald-400 font-mono">
                  {currentDepot.activeVehiclesCount || 18} Active Compactor Vehicles
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bin Location Markers / Heatmap mode */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {filteredBins.map((bin) => {
            const { x, y } = projectCoords(bin.location.lat, bin.location.lng);
            const styleInfo = getMarkerColor(bin.currentFillPercent, bin.overflowRisk);
            const isSelected = selectedBin?.id === bin.id;
            
            // Check if part of active route
            const routeStop = activeRoute?.stops.find(s => s.binId === bin.id);

            if (viewMode === 'heatmap') {
              const intensity = bin.currentFillPercent / 100;
              const radius = Math.max(30, intensity * 70);
              return (
                <div
                  key={bin.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectBin(bin);
                  }}
                  style={{ 
                    left: `${x}%`, 
                    top: `${y}%`, 
                    width: `${radius}px`, 
                    height: `${radius}px` 
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all ${
                    bin.currentFillPercent >= 90 ? 'bg-rose-500/40 blur-md' :
                    bin.currentFillPercent >= 75 ? 'bg-orange-500/35 blur-md' :
                    bin.currentFillPercent >= 50 ? 'bg-amber-500/25 blur-sm' : 'bg-emerald-500/20 blur-sm'
                  }`}
                />
              );
            }

            return (
              <div
                key={bin.id}
                onClick={() => {
                  sound.playClick();
                  onSelectBin(bin);
                }}
                style={{ left: `${x}%`, top: `${y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                {/* Visual pulse for critical overflow */}
                {styleInfo.pulse && (
                  <div className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
                )}

                {/* Marker Pin */}
                <div
                  className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                    styleInfo.bg
                  } ${styleInfo.ring} ${
                    isSelected
                      ? 'w-9 h-9 ring-4 ring-emerald-500/50 border-2 border-[#F1F3F4] scale-110 z-30 shadow-2xl'
                      : 'w-7 h-7 hover:scale-125 hover:z-30 border border-[#111417] shadow-md'
                  }`}
                >
                  {/* Fill percent or Sequence number */}
                  <span className="text-[10px] font-black text-white leading-none font-mono">
                    {routeStop ? `#${routeStop.sequence}` : `${bin.currentFillPercent}%`}
                  </span>

                  {/* Accessible Mini Badge */}
                  <span className="sr-only">
                    {bin.name}, Fill: {bin.currentFillPercent}%, Risk: {bin.overflowRisk}
                  </span>
                </div>

                {/* Hover Tooltip Card */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col bg-[#111417] text-[#F1F3F4] text-xs p-2.5 rounded-xl shadow-2xl z-40 w-52 pointer-events-none border border-[#272D33]">
                  <div className="font-bold text-[#F1F3F4] truncate">{bin.name}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold truncate">{bin.areaName}</div>
                  <div className="text-[9px] text-[#9AA3AD] truncate mt-0.5">{bin.location.address}</div>
                  <div className="mt-1.5 pt-1.5 border-t border-[#272D33] flex items-center justify-between text-[11px]">
                    <span className="text-[#68717B]">Fill Status:</span>
                    <span className="font-bold text-emerald-400 font-mono">{bin.currentFillPercent}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#68717B]">Forecast Overflow:</span>
                    <span className="font-semibold text-rose-400">{bin.predictedOverflowTime}</span>
                  </div>
                  <div className="mt-1 text-[9px] text-emerald-400/90 font-medium">Click to inspect container</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Quick Action: Click to inspect hint */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none hidden md:block">
          <div className="bg-[#111417]/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#272D33] text-[11px] text-[#9AA3AD] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Select any container pin to view fill level, forecast, and collection details</span>
          </div>
        </div>
      </div>

      {/* 3. FLOATING HUD FOR SELECTED CONTAINER */}
      {selectedBin && (
        <div className="absolute top-16 right-4 z-30 flex items-center gap-3 bg-[#111417]/95 backdrop-blur-md p-3 rounded-2xl border border-[#272D33] shadow-2xl text-[#F1F3F4] max-w-sm animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-[#68717B] font-mono uppercase">{selectedBin.id} · {selectedBin.type}</div>
            <div className="text-xs font-bold text-[#F1F3F4] truncate">{selectedBin.name}</div>
            <div className="text-[11px] text-[#9AA3AD]">
              Fill: <strong className="text-emerald-400 font-mono">{selectedBin.currentFillPercent}%</strong> · Risk: <strong className="text-[#F1F3F4]">{selectedBin.overflowRisk}</strong>
            </div>
            <div className="text-[10px] text-[#68717B] truncate mt-0.5">{selectedBin.location.address}</div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onCollectBin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playSuccess();
                  onCollectBin(selectedBin.id);
                }}
                className="bg-[#1C2126] hover:bg-emerald-950 text-emerald-400 border border-[#272D33] hover:border-emerald-800 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1"
                title="Mark collected and reset fill to 5%"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Empty</span>
              </button>
            )}
            <button
              onClick={() => onSelectBin(null as any)}
              className="text-[#68717B] hover:text-[#F1F3F4] p-1 rounded-lg hover:bg-[#1C2126]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. BOTTOM FLOATING AI ROUTE DISPATCH BAR */}
      {activeRoute && (
        <div className="bg-[#111417] border-t border-[#272D33] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#F1F3F4] z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#171B1F] text-emerald-400 border border-[#272D33] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#F1F3F4]">
                  {activeRoute.name}
                </span>
                <span className="text-[10px] font-bold bg-[#171B1F] text-emerald-400 border border-[#272D33] px-2 py-0.5 rounded-md">
                  {activeRoute.stops.length} Stops
                </span>
                <span className="text-[10px] font-medium text-[#9AA3AD]">
                  Driver: {activeRoute.assignedDriverName} ({activeRoute.vehiclePlate})
                </span>
              </div>
              <p className="text-xs text-[#9AA3AD] font-medium mt-0.5">
                {activeRoute.aiRecommendationReason || `Saves ${activeRoute.co2SavingsKg}kg of CO₂ and reduces travel time by ${activeRoute.estimatedTimeMinutes} mins.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onDeployRouteToDriver && (
              <button
                onClick={() => {
                  sound.playSuccess();
                  onDeployRouteToDriver(activeRoute);
                }}
                className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border border-emerald-600/40 flex items-center gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Deploy to Driver Console</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

