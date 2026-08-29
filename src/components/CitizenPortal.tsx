import React, { useState } from 'react';
import { CitizenReport, CollectionArea } from '../types';
import { 
  Megaphone, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Send,
  Clock,
  ShieldCheck,
  Gauge,
  Layers,
  Check,
  Compass,
  FileText,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';
import { fetchAiReportAnalysis } from '../services/aiService';
import { sound } from '../services/soundService';

interface CitizenPortalProps {
  reports: CitizenReport[];
  areas: CollectionArea[];
  onSubmitReport: (newReport: CitizenReport) => void;
  user?: any;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  reports,
  areas,
  onSubmitReport,
  user
}) => {
  // Navigation / View Tabs
  const [activeTab, setActiveTab] = useState<'report' | 'feed'>('report');
  const [activeStep, setActiveStep] = useState<number>(1);

  // Form State
  const [reportType, setReportType] = useState<'overflow' | 'damaged' | 'illegal_dumping' | 'odor_hazard'>('overflow');
  const [binFillStatus, setBinFillStatus] = useState<string>('Fully Filled (100% Overflowing)');
  const [selectedArea, setSelectedArea] = useState<string>(areas[0]?.name || 'Indiranagar 100ft Corridor');
  const [binIdRef, setBinIdRef] = useState<string>('');
  const [description, setDescription] = useState<string>('Container is completely filled and overflowing onto the pedestrian footpath. Urgent clearance needed.');
  const [address, setAddress] = useState<string>('100 Feet Rd, near CMH Hospital, Indiranagar, Bengaluru 560038');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [aiAnalysisPreview, setAiAnalysisPreview] = useState<any>(null);

  // Feed Filter & Search
  const [feedSearch, setFeedSearch] = useState<string>('');
  const [feedFilter, setFeedFilter] = useState<string>('ALL');

  // Quick address presets in Bengaluru
  const blrAddressPresets = [
    { label: 'Indiranagar 100ft Rd', address: '100 Feet Rd, Indiranagar, Bengaluru 560038', zone: 'Indiranagar 100ft Corridor' },
    { label: 'Koramangala 5th Block', address: '80 Feet Rd, 5th Block, Koramangala, Bengaluru 560095', zone: 'Koramangala 5th/7th Block' },
    { label: 'HSR 27th Main', address: '27th Main Rd, Sector 1, HSR Layout, Bengaluru 560102', zone: 'HSR Layout Sectors 1-7' },
    { label: 'MG Road Metro', address: 'MG Road Blvd, Ashok Nagar, Bengaluru 560001', zone: 'MG Road & Brigade CBD' },
    { label: 'Whitefield ITPL', address: 'ITPL Main Rd, Whitefield, Bengaluru 560066', zone: 'Whitefield ITPL Corridor' },
    { label: 'Malleshwaram 8th Cross', address: 'Sampige Rd, Malleshwaram 8th Cross, Bengaluru 560003', zone: 'Malleshwaram Sampige Market' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !address.trim()) return;

    setIsSubmitting(true);
    sound.playClick();

    try {
      const combinedDescription = `[Bin Status: ${binFillStatus}] ${binIdRef ? `[Bin ID: ${binIdRef}] ` : ''}${description}`;

      const aiResult = await fetchAiReportAnalysis({
        reportType,
        description: combinedDescription,
        areaName: selectedArea
      });

      const reporterIdentity = user?.displayName
        ? `${user.displayName} (${user.email || 'Citizen'})`
        : (user?.email || 'Citizen Reporter (Verified)');

      const newReport: CitizenReport = {
        id: `REP-${Math.floor(100 + Math.random() * 900)}`,
        reportType,
        binId: binIdRef || undefined,
        location: {
          lat: 12.9716 + (Math.random() - 0.5) * 0.05,
          lng: 77.5946 + (Math.random() - 0.5) * 0.05,
          address: address || 'Reported municipal point, Bengaluru'
        },
        areaName: selectedArea,
        description: combinedDescription,
        photoUrl: uploadedImagePreview || photoUrl || undefined,
        status: 'VERIFIED',
        urgency: binFillStatus.includes('100%') || aiResult.priorityScore > 80 ? 'critical' : 'high',
        timestamp: 'Just now',
        reportedBy: reporterIdentity,
        aiAnalysis: {
          severity: aiResult.severity,
          confidence: aiResult.confidence,
          suggestedAction: aiResult.suggestedAction,
          verifiedLikelihood: aiResult.verifiedLikelihood
        }
      };

      onSubmitReport(newReport);
      sound.playNotification();
      setSubmittedSuccess(true);
      setAiAnalysisPreview(aiResult);
      setDescription('');
    } catch (err) {
      console.error('Report submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.location.address.toLowerCase().includes(feedSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(feedSearch.toLowerCase()) ||
      r.areaName.toLowerCase().includes(feedSearch.toLowerCase()) ||
      r.id.toLowerCase().includes(feedSearch.toLowerCase());
    
    const matchesFilter = feedFilter === 'ALL' || r.status === feedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      
      {/* 1. TOP HEADER & PORTAL MODE SELECTOR */}
      <div className="bg-[#111417] p-6 rounded-2xl border border-[#272D33] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="p-2 rounded-xl bg-[#171B1F] border border-[#272D33] text-emerald-400">
              <Megaphone className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-[#F1F3F4] tracking-tight">
              Bengaluru Citizen Waste &amp; Bin Reporting Portal
            </h1>
            <span className="text-[11px] font-bold bg-[#171B1F] text-emerald-400 border border-[#272D33] px-2.5 py-0.5 rounded-full">
              BBMP Rapid Response
            </span>
          </div>
          <p className="text-xs text-[#9AA3AD] max-w-2xl">
            Report overflowing bins, illegal street dumps, and hazardous waste. Each report is automatically triaged by Gemini AI and routed to the nearest municipal compactor driver.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#171B1F] p-1 rounded-xl border border-[#272D33] shrink-0 text-xs font-semibold">
          <button
            onClick={() => { sound.playClick(); setActiveTab('report'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-[#272D33] text-[#F1F3F4] shadow-sm'
                : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Submit Report</span>
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveTab('feed'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-[#272D33] text-[#F1F3F4] shadow-sm'
                : 'text-[#9AA3AD] hover:text-[#F1F3F4]'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>Live City Feed ({reports.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'report' ? (
        <div className="space-y-6">
          
          {/* STEP PROGRESS BAR */}
          <div className="bg-[#111417] px-6 py-4 rounded-2xl border border-[#272D33] shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { step: 1, title: '1. Bin Status & Type', desc: 'Fill level & condition' },
                { step: 2, title: '2. Bengaluru Location', desc: 'Address & zone selection' },
                { step: 3, title: '3. Photo & Submission', desc: 'AI triage & verification' }
              ].map((item) => (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => { sound.playClick(); setActiveStep(item.step); }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    activeStep === item.step
                      ? 'bg-[#1C2126] border-emerald-500/80 text-[#F1F3F4] ring-1 ring-emerald-500/30'
                      : 'bg-[#171B1F] border-[#272D33] text-[#9AA3AD] hover:border-[#38414A]'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono ${
                    activeStep === item.step
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-[#272D33] text-[#9AA3AD]'
                  }`}>
                    0{item.step}
                  </span>
                  <div>
                    <div className="text-xs font-bold leading-tight">{item.title}</div>
                    <div className="text-[11px] text-[#68717B]">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {submittedSuccess && aiAnalysisPreview ? (
            /* SUCCESS CONFIRMATION BOX */
            <div className="bg-[#111417] p-8 rounded-2xl border border-emerald-700/80 shadow-xl text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-950/90 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#F1F3F4]">
                  Bin Status Successfully Logged &amp; AI Triaged!
                </h2>
                <p className="text-xs text-[#9AA3AD] max-w-md mx-auto">
                  Your incident has been verified and registered with the Bengaluru Municipal Waste Management Grid. A driver has been notified.
                </p>
              </div>

              {/* Triage Info Card */}
              <div className="max-w-md mx-auto bg-[#171B1F] p-4 rounded-xl border border-[#272D33] text-left space-y-2">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#272D33]">
                  <span className="text-[#9AA3AD]">AI Urgency Rating:</span>
                  <span className="font-bold text-rose-400">{aiAnalysisPreview.severity}</span>
                </div>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-[#272D33]">
                  <span className="text-[#9AA3AD]">AI Model Confidence:</span>
                  <span className="font-bold text-emerald-400 font-mono">{Math.round(aiAnalysisPreview.confidence * 100)}%</span>
                </div>
                <div className="text-xs">
                  <span className="text-[#9AA3AD] block mb-0.5">Municipal Action:</span>
                  <span className="text-[#F1F3F4] font-medium">{aiAnalysisPreview.suggestedAction}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setActiveStep(1);
                  }}
                  className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl border border-emerald-600/40 shadow-sm cursor-pointer transition-all"
                >
                  Submit Another Report
                </button>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="bg-[#171B1F] hover:bg-[#272D33] text-[#F1F3F4] text-xs font-semibold px-5 py-2.5 rounded-xl border border-[#272D33] cursor-pointer transition-all"
                >
                  View in Public Feed
                </button>
              </div>
            </div>
          ) : (
            /* MULTI-BOX STEPPED REPORTING FORM */
            <form onSubmit={handleFormSubmit} className="space-y-6">
              
              {/* ========================================================
                  BOX 1: BIN FILL STATUS & INCIDENT CLASSIFICATION
                  ======================================================== */}
              <div className={`bg-[#111417] p-6 rounded-2xl border border-[#272D33] shadow-sm space-y-5 transition-all ${
                activeStep === 1 ? 'ring-1 ring-emerald-500/40' : 'opacity-95'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-[#272D33]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs font-bold font-mono">
                      01
                    </span>
                    <h2 className="text-sm font-bold text-[#F1F3F4]">
                      Bin Fill Status &amp; Condition Details
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-[#171B1F] px-2.5 py-1 rounded-md border border-[#272D33]">
                    Step 1 of 3
                  </span>
                </div>

                {/* Fill Condition Selector */}
                <div>
                  <label className="text-xs font-bold text-[#9AA3AD] block mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4 text-emerald-400" />
                      Select Current Bin Status:
                    </span>
                    <span className="text-[10px] text-rose-400 font-semibold">*Required</span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { 
                        label: 'Fully Filled (100% Overflowing)', 
                        badge: '100% Critical', 
                        desc: 'Litter spilling onto ground & footpaths',
                        color: 'border-rose-600 text-rose-300 bg-rose-950/40' 
                      },
                      { 
                        label: 'Nearly Full (80-90%)', 
                        badge: '85% High', 
                        desc: 'Bin is almost topped, imminent overflow',
                        color: 'border-orange-600 text-orange-300 bg-orange-950/40' 
                      },
                      { 
                        label: 'Half Full (50%)', 
                        badge: '50% Moderate', 
                        desc: 'Standard fill level, routine pickup',
                        color: 'border-amber-600 text-amber-300 bg-amber-950/40' 
                      },
                      { 
                        label: 'Damaged / Broken Container', 
                        badge: 'Hardware Damage', 
                        desc: 'Broken pedal, missing lid, or cracked body',
                        color: 'border-indigo-600 text-indigo-300 bg-indigo-950/40' 
                      }
                    ].map((statusItem) => (
                      <button
                        key={statusItem.label}
                        type="button"
                        onClick={() => { sound.playClick(); setBinFillStatus(statusItem.label); }}
                        className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                          binFillStatus === statusItem.label
                            ? `${statusItem.color} ring-2 ring-emerald-500/50 shadow-md`
                            : 'bg-[#171B1F] border-[#272D33] text-[#9AA3AD] hover:border-[#38414A] hover:text-[#F1F3F4]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-emerald-400 font-mono bg-[#111417] px-2 py-0.5 rounded border border-[#272D33]">
                              {statusItem.badge}
                            </span>
                            {binFillStatus === statusItem.label && (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-[#F1F3F4] block mb-1">
                            {statusItem.label}
                          </span>
                          <span className="text-[11px] text-[#9AA3AD] leading-relaxed block">
                            {statusItem.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Incident Classification Categories */}
                <div className="pt-3 border-t border-[#272D33]/60">
                  <label className="text-xs font-bold text-[#9AA3AD] block mb-2">
                    Incident Classification Category:
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'overflow', label: 'Overflowing Bin' },
                      { id: 'damaged', label: 'Damaged Container' },
                      { id: 'illegal_dumping', label: 'Illegal Street Dumping' },
                      { id: 'odor_hazard', label: 'Sanitary Odor Hazard' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => { sound.playClick(); setReportType(cat.id as any); }}
                        className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer flex items-center justify-between ${
                          reportType === cat.id
                            ? 'bg-[#1C2126] border-emerald-600 text-[#F1F3F4] shadow-sm'
                            : 'bg-[#171B1F] border-[#272D33] text-[#9AA3AD] hover:text-[#F1F3F4]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {reportType === cat.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActiveStep(2); }}
                    className="flex items-center gap-1.5 bg-[#171B1F] hover:bg-[#272D33] text-[#F1F3F4] text-xs font-bold px-4 py-2 rounded-xl border border-[#272D33] cursor-pointer"
                  >
                    <span>Continue to Step 2 (Location)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ========================================================
                  BOX 2: BENGALURU LOCATION & DETAILED ADDRESS
                  ======================================================== */}
              <div className={`bg-[#111417] p-6 rounded-2xl border border-[#272D33] shadow-sm space-y-5 transition-all ${
                activeStep === 2 ? 'ring-1 ring-emerald-500/40' : 'opacity-95'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-[#272D33]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs font-bold font-mono">
                      02
                    </span>
                    <h2 className="text-sm font-bold text-[#F1F3F4]">
                      Bengaluru Zone &amp; Exact Location Address
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-[#171B1F] px-2.5 py-1 rounded-md border border-[#272D33]">
                    Step 2 of 3
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Zone Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#9AA3AD] block mb-1.5 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      Municipal Zone / BBMP Ward:
                    </label>
                    <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className="w-full text-xs font-medium bg-[#171B1F] border border-[#272D33] rounded-xl p-3 text-[#F1F3F4] focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      {areas.map(a => (
                        <option key={a.id} value={a.name} className="bg-[#171B1F] text-[#F1F3F4]">{a.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Bin ID / Landmark tag */}
                  <div>
                    <label className="text-xs font-bold text-[#9AA3AD] block mb-1.5">
                      Bin Identifier / QR Serial (Optional):
                    </label>
                    <input
                      type="text"
                      value={binIdRef}
                      onChange={(e) => setBinIdRef(e.target.value)}
                      placeholder="E.g. BIN-001 or Smart Hub #14"
                      className="w-full text-xs font-medium bg-[#171B1F] border border-[#272D33] rounded-xl p-3 text-[#F1F3F4] focus:outline-none focus:border-emerald-500 font-mono placeholder-[#68717B]"
                    />
                  </div>
                </div>

                {/* Specific Address Input */}
                <div>
                  <label className="text-xs font-bold text-[#9AA3AD] block mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      Detailed Street Address &amp; Nearest Landmark:
                    </span>
                    <span className="text-[10px] text-[#68717B]">Exact street or crossroad</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="E.g. 100 Feet Rd, near CMH Hospital, Indiranagar, Bengaluru 560038"
                    className="w-full text-xs font-medium bg-[#171B1F] border border-[#272D33] rounded-xl p-3 text-[#F1F3F4] focus:outline-none focus:border-emerald-500 placeholder-[#68717B]"
                  />

                  {/* Quick Bengaluru Location Chips */}
                  <div className="mt-3 p-3 bg-[#171B1F] rounded-xl border border-[#272D33]">
                    <span className="text-[11px] text-[#9AA3AD] font-bold block mb-2">
                      Quick Popular Bengaluru Presets (Click to autofill):
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {blrAddressPresets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setAddress(preset.address);
                            setSelectedArea(preset.zone);
                          }}
                          className="text-[11px] bg-[#111417] hover:bg-[#272D33] text-[#9AA3AD] hover:text-[#F1F3F4] px-2.5 py-1 rounded-lg border border-[#272D33] transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navigation Button */}
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActiveStep(1); }}
                    className="flex items-center gap-1 text-[#9AA3AD] hover:text-[#F1F3F4] text-xs font-semibold px-3 py-2 rounded-xl cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to Step 1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActiveStep(3); }}
                    className="flex items-center gap-1.5 bg-[#171B1F] hover:bg-[#272D33] text-[#F1F3F4] text-xs font-bold px-4 py-2 rounded-xl border border-[#272D33] cursor-pointer"
                  >
                    <span>Continue to Step 3 (Evidence)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ========================================================
                  BOX 3: PHOTOGRAPHIC EVIDENCE & REPORT DESCRIPTION
                  ======================================================== */}
              <div className={`bg-[#111417] p-6 rounded-2xl border border-[#272D33] shadow-sm space-y-5 transition-all ${
                activeStep === 3 ? 'ring-1 ring-emerald-500/40' : 'opacity-95'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-[#272D33]">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center text-xs font-bold font-mono">
                      03
                    </span>
                    <h2 className="text-sm font-bold text-[#F1F3F4]">
                      Photo Evidence &amp; Incident Notes
                    </h2>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-[#171B1F] px-2.5 py-1 rounded-md border border-[#272D33]">
                    Step 3 of 3
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Photo Evidence Upload Box */}
                  <div>
                    <label className="text-xs font-bold text-[#9AA3AD] block mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-emerald-400" />
                        Container Photo Evidence:
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">AI Verification</span>
                    </label>

                    <div className="relative border border-dashed border-[#272D33] rounded-2xl p-5 text-center bg-[#171B1F] hover:bg-[#1C2126] transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[140px]">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Upload bin photo"
                      />
                      
                      {uploadedImagePreview ? (
                        <div className="flex items-center gap-3">
                          <img 
                            src={uploadedImagePreview} 
                            alt="Uploaded preview" 
                            className="w-20 h-20 rounded-xl object-cover border border-emerald-500 shadow-md" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left">
                            <span className="text-xs font-bold text-[#F1F3F4] block">Photo Successfully Attached</span>
                            <span className="text-[11px] text-emerald-400">Ready for automated AI triage</span>
                            <span className="text-[10px] text-[#68717B] block mt-1">Click to select a different photo</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <Camera className="w-7 h-7 text-[#68717B] mx-auto" />
                          <div className="text-xs text-[#F1F3F4] font-medium">
                            Upload Container Image
                          </div>
                          <p className="text-[11px] text-[#9AA3AD]">
                            Click or drag and drop photo here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div>
                    <label className="text-xs font-bold text-[#9AA3AD] block mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      Detailed Incident Description:
                    </label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the overflow extent, bin condition, street obstruction, or bio-hazard in detail..."
                      className="w-full h-[140px] p-3.5 bg-[#171B1F] border border-[#272D33] rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-[#F1F3F4] placeholder-[#68717B] resize-none"
                    />
                  </div>
                </div>

                {/* SUBMIT ACTION CARD */}
                <div className="pt-4 border-t border-[#272D33] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => { sound.playClick(); setActiveStep(2); }}
                    className="flex items-center gap-1 text-[#9AA3AD] hover:text-[#F1F3F4] text-xs font-semibold cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back to Location</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto min-w-[280px] bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-emerald-600/40 shadow-md cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
                        <span>Gemini AI Triaging &amp; Dispatching BBMP Unit...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Bin Status &amp; Dispatch Compactor</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* ========================================================
            TAB 2: LIVE PUBLIC CITY TRANSPARENCY FEED
            ======================================================== */
        <div className="space-y-4">
          {/* Feed Filter & Search Bar */}
          <div className="bg-[#111417] p-4 rounded-2xl border border-[#272D33] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#68717B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={feedSearch}
                onChange={(e) => setFeedSearch(e.target.value)}
                placeholder="Search by address, zone, or report ID..."
                className="w-full pl-9 pr-3 py-2 bg-[#171B1F] border border-[#272D33] rounded-xl text-xs text-[#F1F3F4] placeholder-[#68717B] focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <span className="text-[11px] text-[#68717B] font-semibold flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3" /> Status:
              </span>
              {['ALL', 'VERIFIED', 'DISPATCHED', 'RESOLVED'].map((filterStatus) => (
                <button
                  key={filterStatus}
                  onClick={() => { sound.playClick(); setFeedFilter(filterStatus); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                    feedFilter === filterStatus
                      ? 'bg-[#272D33] text-[#F1F3F4] border border-[#38414A]'
                      : 'bg-[#171B1F] text-[#9AA3AD] hover:text-[#F1F3F4] border border-[#272D33]'
                  }`}
                >
                  {filterStatus}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] space-y-3 hover:border-[#38414A] transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {report.id}
                        </span>
                        <span className="text-xs font-bold text-[#F1F3F4]">
                          {report.reportType.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-[#9AA3AD] flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-medium text-[#F1F3F4]">{report.location.address}</span>
                      </p>
                      <span className="text-[11px] text-[#68717B] font-semibold block mt-0.5">
                        Ward: {report.areaName}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border shrink-0 ${
                      report.status === 'VERIFIED' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' :
                      report.status === 'DISPATCHED' ? 'bg-amber-950/80 text-amber-400 border-amber-800/80' : 'bg-[#1C2126] text-[#9AA3AD] border-[#272D33]'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <p className="text-xs text-[#9AA3AD] leading-relaxed bg-[#171B1F] p-3 rounded-xl border border-[#272D33]/60">
                    {report.description}
                  </p>

                  {report.aiAnalysis && (
                    <div className="bg-[#171B1F] p-3 rounded-xl border border-emerald-900/40 text-xs space-y-1">
                      <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>AI Triage: {report.aiAnalysis.severity} (Confidence {Math.round((report.aiAnalysis.confidence || 0.9) * 100)}%)</span>
                      </div>
                      <div className="text-[#9AA3AD] text-[11px]">
                        Action: <strong className="text-[#F1F3F4]">{report.aiAnalysis.suggestedAction}</strong>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-[#68717B] flex items-center justify-between pt-2 border-t border-[#272D33]">
                  <span>Reported: {report.timestamp}</span>
                  <span className="font-medium text-[#9AA3AD]">{report.reportedBy}</span>
                </div>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="bg-[#111417] p-12 rounded-2xl border border-[#272D33] text-center space-y-3">
              <Megaphone className="w-8 h-8 text-[#68717B] mx-auto" />
              <div className="text-sm font-bold text-[#F1F3F4]">No reports found</div>
              <p className="text-xs text-[#9AA3AD]">Try searching with a different keyword or filter.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
