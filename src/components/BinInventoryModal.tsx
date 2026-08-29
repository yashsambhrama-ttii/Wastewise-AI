import React, { useState } from 'react';
import { WasteBin, CollectionArea } from '../types';
import { Trash2, Plus, X, MapPin, Sliders, CheckCircle2, Clock } from 'lucide-react';

interface BinInventoryModalProps {
  bins: WasteBin[];
  areas: CollectionArea[];
  onAddBin: (newBin: WasteBin) => void;
  onUpdateBin: (bin: WasteBin) => void;
  onDeleteBin: (binId: string) => void;
  onSelectBin: (bin: WasteBin) => void;
}

export const BinInventoryModal: React.FC<BinInventoryModalProps> = ({
  bins,
  areas,
  onAddBin,
  onUpdateBin,
  onDeleteBin,
  onSelectBin
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');

  // Form State for new bin
  const [name, setName] = useState('');
  const [areaId, setAreaId] = useState(areas[0]?.id || 'ZONE-A');
  const [type, setType] = useState<'general' | 'recyclable' | 'organic' | 'hazardous' | 'electronic'>('general');
  const [capacityLiters, setCapacityLiters] = useState(1100);
  const [address, setAddress] = useState('');

  const filteredBins = bins.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === 'ALL' || b.areaId === selectedZone;
    return matchesSearch && matchesZone;
  });

  const handleCreateBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const area = areas.find(a => a.id === areaId) || areas[0];
    const newBin: WasteBin = {
      id: `BIN-${Math.floor(600 + Math.random() * 400)}`,
      name,
      areaId,
      areaName: area.name,
      location: {
        lat: area.coordinates.lat + (Math.random() - 0.5) * 0.01,
        lng: area.coordinates.lng + (Math.random() - 0.5) * 0.01,
        address: address || `${name}, ${area.name}`
      },
      type,
      capacityLiters,
      currentFillPercent: Math.floor(20 + Math.random() * 40),
      predictedFillPercent: Math.floor(40 + Math.random() * 40),
      predictedOverflowTime: 'Tomorrow 10:00 AM',
      overflowRisk: 'LOW',
      status: 'optimal',
      lastCollectionTime: 'Today 8:00 AM',
      recommendedCollectionTime: 'Regular schedule',
      priorityScore: Math.floor(30 + Math.random() * 40),
      sensorBattery: 98,
      temperatureC: 21.0,
      historicalReadings: [
        { timestamp: '08:00', fillPercent: 10, weightKg: 30 },
        { timestamp: '12:00', fillPercent: 25, weightKg: 75 },
        { timestamp: '14:00', fillPercent: 35, weightKg: 105 }
      ]
    };

    onAddBin(newBin);
    setIsAdding(false);
    setName('');
    setAddress('');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Search & Add Bin */}
      <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <input
            type="text"
            placeholder="Search by container ID or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs bg-[#171B1F] border border-[#272D33] rounded-xl px-3.5 py-2.5 w-64 text-[#F1F3F4] placeholder-[#68717B] focus:outline-none focus:border-emerald-500"
          />

          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="text-xs bg-[#171B1F] border border-[#272D33] rounded-xl px-3 py-2.5 text-[#F1F3F4] font-medium focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Zones ({bins.length})</option>
            {areas.map(a => (
              <option key={a.id} value={a.id} className="bg-[#171B1F] text-[#F1F3F4]">{a.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm border border-emerald-600/40 flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision Smart Bin</span>
        </button>
      </div>

      {/* Add Bin Form Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#171B1F] rounded-2xl shadow-2xl border border-[#272D33] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#272D33]">
              <h3 className="text-sm font-bold text-[#F1F3F4]">
                Provision New IoT Smart Container
              </h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-[#68717B] hover:text-[#F1F3F4] text-xs font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBin} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#9AA3AD] block mb-1">Container Name / Landmark</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Market St & 5th Ave Corner #2"
                  className="w-full text-xs font-medium bg-[#111417] border border-[#272D33] rounded-xl p-2.5 text-[#F1F3F4] placeholder-[#68717B] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#9AA3AD] block mb-1">Municipal Zone</label>
                  <select
                    value={areaId}
                    onChange={(e) => setAreaId(e.target.value)}
                    className="w-full text-xs font-medium bg-[#111417] border border-[#272D33] rounded-xl p-2.5 text-[#F1F3F4] focus:outline-none focus:border-emerald-500"
                  >
                    {areas.map(a => (
                      <option key={a.id} value={a.id} className="bg-[#111417] text-[#F1F3F4]">{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#9AA3AD] block mb-1">Waste Stream Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs font-medium bg-[#111417] border border-[#272D33] rounded-xl p-2.5 text-[#F1F3F4] focus:outline-none focus:border-emerald-500"
                  >
                    <option value="general">General Municipal</option>
                    <option value="recyclable">Recyclable (Plastic/Glass)</option>
                    <option value="organic">Organic Compost</option>
                    <option value="electronic">Electronic Waste</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#9AA3AD] block mb-1">Street Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="E.g. 850 Market St, San Francisco, CA"
                  className="w-full text-xs font-medium bg-[#111417] border border-[#272D33] rounded-xl p-2.5 text-[#F1F3F4] placeholder-[#68717B] focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#9AA3AD] hover:text-[#F1F3F4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-xs font-bold border border-emerald-600/40"
                >
                  Save &amp; Activate IoT Sensor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bin Inventory Table */}
      <div className="bg-[#111417] rounded-2xl border border-[#272D33] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#171B1F] border-b border-[#272D33] text-[10px] font-bold text-[#68717B] uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Container ID &amp; Location</th>
                <th className="py-3.5 px-4">Zone</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Current Fill</th>
                <th className="py-3.5 px-4">Overflow Risk</th>
                <th className="py-3.5 px-4">Last Emptied</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#272D33]">
              {filteredBins.map((bin) => {
                const isCritical = bin.currentFillPercent >= 90;
                return (
                  <tr 
                    key={bin.id} 
                    className="hover:bg-[#171B1F]/60 transition-colors cursor-pointer"
                    onClick={() => onSelectBin(bin)}
                  >
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-bold text-[#F1F3F4]">{bin.name}</div>
                      <div className="text-[10px] text-[#68717B] flex items-center gap-1 mt-0.5 font-mono">
                        <span className="text-[#9AA3AD]">{bin.id}</span> · {bin.location.address}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#9AA3AD] font-semibold">{bin.areaName}</td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize bg-[#1C2126] text-[#9AA3AD] border border-[#272D33] px-2 py-0.5 rounded text-[10px] font-mono">
                        {bin.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-mono">
                        <span className={`font-bold ${
                          bin.currentFillPercent >= 90 ? 'text-rose-400' :
                          bin.currentFillPercent >= 75 ? 'text-orange-400' : 'text-emerald-400'
                        }`}>
                          {bin.currentFillPercent}%
                        </span>
                        <div className="w-16 h-1.5 bg-[#171B1F] rounded-full overflow-hidden border border-[#272D33]">
                          <div
                            className={`h-full rounded-full ${
                              bin.currentFillPercent >= 90 ? 'bg-rose-500' :
                              bin.currentFillPercent >= 75 ? 'bg-orange-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${bin.currentFillPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        bin.overflowRisk === 'CRITICAL' ? 'bg-rose-950/80 text-rose-400 border-rose-800/80' :
                        bin.overflowRisk === 'HIGH' ? 'bg-orange-950/80 text-orange-400 border-orange-800/80' : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                      }`}>
                        {bin.overflowRisk}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#9AA3AD] font-mono text-[11px]">
                      {bin.lastCollectionTime}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectBin(bin)}
                        className="text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 rounded hover:bg-[#1C2126] mr-2"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => onDeleteBin(bin.id)}
                        className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-[#1C2126]"
                        title="Decommission container"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
