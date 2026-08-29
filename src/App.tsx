import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  WasteBin, 
  CollectionArea, 
  CollectionRoute, 
  DriverProfile, 
  CitizenReport, 
  AIPredictionResult 
} from './types';
import { 
  INITIAL_BINS, 
  INITIAL_AREAS, 
  INITIAL_ROUTES, 
  INITIAL_DRIVERS, 
  INITIAL_REPORTS,
  INITIAL_DEPOT
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar, AdminTab } from './components/Sidebar';
import { DashboardStats } from './components/DashboardStats';
import { InteractiveMap } from './components/InteractiveMap';
import { BinDetailDrawer } from './components/BinDetailDrawer';
import { RouteOptimizerView } from './components/RouteOptimizerView';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { PredictionsView } from './components/PredictionsView';
import { DriverPortal } from './components/DriverPortal';
import { CitizenPortal } from './components/CitizenPortal';
import { BinInventoryModal } from './components/BinInventoryModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { CommandPalette } from './components/CommandPalette';
import { LiveTelemetryBar } from './components/LiveTelemetryBar';
import { fetchAiAccumulationPredictions } from './services/aiService';
import { sound } from './services/soundService';
import { subscribeToAuth } from './lib/firebase';
import { 
  seedFirestoreIfEmpty, 
  subscribeToBins, 
  subscribeToRoutes, 
  subscribeToReports, 
  updateBinInFirestore, 
  updateRouteInFirestore, 
  saveCitizenReportToFirestore 
} from './services/firestoreService';
import { AlertOctagon, CheckCircle2, Flame, MapPin, Sparkles, Truck, ArrowLeft, X, LayoutDashboard, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

// Helper to ensure localStorage data is aligned with Bengaluru coordinates (lat ~12.9, lng ~77.6)
const isBengaluruDataset = (data: any[]): boolean => {
  if (!Array.isArray(data) || data.length === 0) return false;
  const first = data[0];
  if (first?.location) {
    return first.location.lat >= 12.0 && first.location.lat <= 14.0 && first.location.lng >= 77.0 && first.location.lng <= 78.5;
  }
  if (first?.latitude) {
    return first.latitude >= 12.0 && first.latitude <= 14.0 && first.longitude >= 77.0 && first.longitude <= 78.5;
  }
  return true;
};

import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';

export function App() {
  // Saved User State
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('wastewise_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('wastewise_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        if (u?.role) return u.role;
      } catch (e) {}
    }
    return 'citizen';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>('citizen');
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulatedTime, setSimulatedTime] = useState('08:45 AM (Morning Peak)');

  // Core Municipal Data State (with local persistence)
  const [bins, setBins] = useState<WasteBin[]>(() => {
    const saved = localStorage.getItem('wastewise_bins');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (isBengaluruDataset(parsed)) return parsed;
      } catch (e) {
        // Fallback to INITIAL_BINS
      }
    }
    return INITIAL_BINS;
  });

  const [areas, setAreas] = useState<CollectionArea[]>(() => {
    const saved = localStorage.getItem('wastewise_areas');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (isBengaluruDataset(parsed)) return parsed;
      } catch (e) {
        // Fallback to INITIAL_AREAS
      }
    }
    return INITIAL_AREAS;
  });

  const [routes, setRoutes] = useState<CollectionRoute[]>(() => {
    const saved = localStorage.getItem('wastewise_routes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        // Fallback to INITIAL_ROUTES
      }
    }
    return INITIAL_ROUTES;
  });

  const [drivers, setDrivers] = useState<DriverProfile[]>(() => {
    const saved = localStorage.getItem('wastewise_drivers');
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [reports, setReports] = useState<CitizenReport[]>(() => {
    const saved = localStorage.getItem('wastewise_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [depot] = useState(INITIAL_DEPOT);

  const [activeDriver, setActiveDriver] = useState<DriverProfile>(drivers[0]);
  const [selectedBin, setSelectedBin] = useState<WasteBin | null>(null);
  const [predictionData, setPredictionData] = useState<AIPredictionResult | null>(null);
  const [aiEngineStatus, setAiEngineStatus] = useState<'active' | 'processing' | 'idle'>('active');
  const [activeRouteOnMap, setActiveRouteOnMap] = useState<CollectionRoute | null>(routes[0] || null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Auth and Firestore Realtime Synchronization
  useEffect(() => {
    // 1. Subscribe to Firebase Auth
    const unsubscribeAuth = subscribeToAuth((firebaseUser) => {
      if (firebaseUser) {
        setUser((prev: any) => ({
          ...prev,
          uid: firebaseUser.uid,
          email: firebaseUser.email || prev?.email || 'user@wastewise.org',
          displayName: firebaseUser.displayName || prev?.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL || prev?.photoURL || null
        }));
      }
    });

    // 2. Initialize Firestore data seed & subscriptions
    seedFirestoreIfEmpty();

    const unsubscribeBins = subscribeToBins((firestoreBins) => {
      if (firestoreBins && firestoreBins.length > 0 && isBengaluruDataset(firestoreBins)) {
        setBins(firestoreBins);
      }
    });

    const unsubscribeRoutes = subscribeToRoutes((firestoreRoutes) => {
      if (firestoreRoutes && firestoreRoutes.length > 0) {
        setRoutes(firestoreRoutes);
      }
    });

    const unsubscribeReports = subscribeToReports((firestoreReports) => {
      if (firestoreReports && firestoreReports.length > 0) {
        setReports(firestoreReports);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeBins();
      unsubscribeRoutes();
      unsubscribeReports();
    };
  }, []);

  // Sync to local storage for offline resilience
  useEffect(() => {
    localStorage.setItem('wastewise_bins', JSON.stringify(bins));
  }, [bins]);

  useEffect(() => {
    localStorage.setItem('wastewise_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('wastewise_reports', JSON.stringify(reports));
  }, [reports]);

  // Global Keyboard Shortcuts (Cmd+K for Command Palette, Cmd+1/2/3 for roles)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        sound.playClick();
        setIsCommandPaletteOpen(prev => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        sound.playClick();
        setCurrentRole('admin');
      } else if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        sound.playClick();
        setCurrentRole('driver');
      } else if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        sound.playClick();
        setCurrentRole('citizen');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Background Live IoT Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setBins(prevBins => {
        // Randomly pick 1-2 bins to increment slightly
        const randomIndex = Math.floor(Math.random() * prevBins.length);
        return prevBins.map((bin, idx) => {
          if (idx === randomIndex) {
            const increment = Math.floor(Math.random() * 3) + 1;
            const newFill = Math.min(100, bin.currentFillPercent + increment);
            let risk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
            let status = bin.status;
            if (newFill >= 90) {
              risk = 'CRITICAL';
              status = 'overflow';
            } else if (newFill >= 75) {
              risk = 'HIGH';
              status = 'high';
            } else if (newFill >= 50) {
              risk = 'MODERATE';
              status = 'moderate';
            }

            return {
              ...bin,
              currentFillPercent: newFill,
              overflowRisk: risk,
              status
            };
          }
          return bin;
        });
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Initial AI Accumulation Forecasting on mount
  useEffect(() => {
    const loadAiPredictions = async () => {
      setAiEngineStatus('processing');
      try {
        const result = await fetchAiAccumulationPredictions(bins, areas, 1.2);
        setPredictionData(result);
      } catch (err) {
        console.error('Initial AI prediction load failed:', err);
      } finally {
        setAiEngineStatus('active');
      }
    };
    loadAiPredictions();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handler: Update bin fill level from simulation slider or IoT event
  const handleUpdateFillPercent = (binId: string, newFill: number) => {
    let overflowRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
    let status: WasteBin['status'] = 'optimal';
    if (newFill >= 90) {
      overflowRisk = 'CRITICAL';
      status = 'overflow';
    } else if (newFill >= 75) {
      overflowRisk = 'HIGH';
      status = 'high';
    } else if (newFill >= 50) {
      overflowRisk = 'MODERATE';
      status = 'moderate';
    } else {
      overflowRisk = 'LOW';
      status = 'optimal';
    }

    setBins(prev => prev.map(b => {
      if (b.id !== binId) return b;
      const updated = {
        ...b,
        currentFillPercent: newFill,
        overflowRisk,
        status,
        predictedOverflowTime: newFill >= 90 ? 'Immediate (<30m)' : b.predictedOverflowTime
      };

      if (selectedBin?.id === binId) {
        setSelectedBin(updated);
      }
      return updated;
    }));

    // Update in Firestore
    updateBinInFirestore(binId, {
      currentFillPercent: newFill,
      overflowRisk,
      status
    }).catch(err => console.warn('Firestore bin update notice:', err));
  };

  // Handler: Collect / Empty a bin
  const handleCollectBin = (binId: string) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    sound.playSuccess();
    handleUpdateFillPercent(binId, 5);
    showToast(`Bin ${binId} marked as collected and reset to 5% capacity.`);
  };

  // Handler: Rush hour surge simulation
  const handleSimulateSpike = () => {
    sound.playAlert();
    setBins(prev => prev.map(b => {
      // Add +15% to +28% to downtown & commercial bins
      const boost = Math.floor(Math.random() * 15) + 14;
      const newFill = Math.min(100, b.currentFillPercent + boost);
      let overflowRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
      let status = b.status;
      if (newFill >= 90) {
        overflowRisk = 'CRITICAL';
        status = 'overflow';
      } else if (newFill >= 75) {
        overflowRisk = 'HIGH';
        status = 'high';
      } else if (newFill >= 50) {
        overflowRisk = 'MODERATE';
        status = 'moderate';
      }

      return {
        ...b,
        currentFillPercent: newFill,
        overflowRisk,
        status
      };
    }));
    showToast('⚡ Rush Hour Surge simulated across municipal network (+18% average load)');
  };

  // Handler: Empty all critical bins
  const handleEmptyAllCritical = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    sound.playSuccess();
    setBins(prev => prev.map(b => {
      if (b.currentFillPercent >= 80 || b.overflowRisk === 'CRITICAL' || b.overflowRisk === 'HIGH') {
        const resetBin = {
          ...b,
          currentFillPercent: 5,
          overflowRisk: 'LOW' as const,
          status: 'optimal' as const,
          predictedOverflowTime: '18h 40m'
        };
        updateBinInFirestore(b.id, {
          currentFillPercent: 5,
          overflowRisk: 'LOW',
          status: 'optimal'
        }).catch(() => {});
        return resetBin;
      }
      return b;
    }));
    showToast('✨ All critical overflow containers flushed and reset to optimal status.');
  };

  // Handler: Driver completed collection stop
  const handleCompleteStop = (routeId: string, stopId: string, binId: string) => {
    handleUpdateFillPercent(binId, 5);

    setRoutes(prev => prev.map(route => {
      if (route.id !== routeId) return route;
      const updatedStops = route.stops.map(s => {
        if (s.id === stopId) {
          return { ...s, status: 'COLLECTED' as const, collectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        }
        return s;
      });
      const completedCount = updatedStops.filter(s => s.status === 'COLLECTED').length;
      const updatedRoute = {
        ...route,
        stops: updatedStops,
        completedStopsCount: completedCount,
        status: (completedCount === updatedStops.length ? 'COMPLETED' : 'IN_PROGRESS') as CollectionRoute['status']
      };

      updateRouteInFirestore(routeId, {
        stops: updatedStops,
        completedStopsCount: completedCount,
        status: updatedRoute.status
      }).catch(() => {});

      return updatedRoute;
    }));

    // Update driver shift weight
    setDrivers(prev => prev.map(d => {
      if (d.id === activeDriver.id) {
        const updatedWeight = d.collectedWeightKgToday + 280;
        const updated = { ...d, collectedWeightKgToday: updatedWeight };
        setActiveDriver(updated);
        return updated;
      }
      return d;
    }));

    showToast(`Collection stop verified. Sensor reset and weight added to payload.`);
  };

  // Handler: Deploy route to driver
  const handleDeployRoute = (route: CollectionRoute) => {
    const driver = drivers.find(d => d.id === route.assignedDriverId) || activeDriver;
    setActiveDriver(driver);
    setCurrentRole('driver');
    showToast(`Route "${route.name}" pushed to Driver Console for ${driver.name}.`);
  };

  // Handler: Report an issue
  const handleReportIssue = (binId: string, type: 'overflow' | 'damaged') => {
    const targetBin = bins.find(b => b.id === binId);
    const newReport: CitizenReport = {
      id: `REP-${Math.floor(100 + Math.random() * 900)}`,
      reportType: type,
      location: targetBin ? targetBin.location : { lat: 12.9716, lng: 77.5946, address: 'Bengaluru, Karnataka' },
      areaName: targetBin?.areaName || 'Indiranagar 100ft Corridor',
      binId,
      description: `${type.toUpperCase()} reported via IoT console for bin ${binId}.`,
      status: 'VERIFIED',
      urgency: type === 'overflow' ? 'critical' : 'medium',
      timestamp: 'Just now',
      reportedBy: user ? (user.displayName || user.email) : 'Staff Operator #4'
    };
    setReports(prev => [newReport, ...prev]);
    saveCitizenReportToFirestore(newReport).catch(() => {});
    showToast(`Issue report created and triaged for ${binId}.`);
  };

  // Calculations for sidebar & telemetry
  const criticalCount = bins.filter(b => b.currentFillPercent >= 90 || b.overflowRisk === 'CRITICAL').length;
  const unresolvedReportsCount = reports.filter(r => r.status !== 'RESOLVED').length;

  const handleLandingGetStarted = (preferredRole: UserRole = 'citizen') => {
    setAuthModalInitialRole(preferredRole);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccessFromModal = (userData: {
    displayName: string;
    email: string;
    photoURL?: string | null;
    role?: UserRole;
  }) => {
    setUser(userData);
    localStorage.setItem('wastewise_user', JSON.stringify(userData));
    if (userData.role) {
      setCurrentRole(userData.role);
    }
  };

  // If user is not logged in, show the Landing & Overview page first
  if (!user) {
    return (
      <>
        <LandingPage
          onGetStarted={handleLandingGetStarted}
          onOpenSignIn={(role) => {
            if (role) setAuthModalInitialRole(role);
            setIsAuthModalOpen(true);
          }}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialRole={authModalInitialRole}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccessFromModal}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#0B0D0F] font-sans text-[#F1F3F4] antialiased overflow-hidden">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C2126] text-[#F1F3F4] px-4 py-3 rounded-2xl shadow-2xl border border-[#272D33] flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeDriver={activeDriver}
        setActiveDriver={setActiveDriver}
        drivers={drivers}
        user={user}
        setUser={setUser}
        aiEngineStatus={aiEngineStatus}
        criticalBinsCount={criticalCount}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Only in Admin view) */}
        {currentRole === 'admin' && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            criticalCount={criticalCount}
            unresolvedReportsCount={unresolvedReportsCount}
            efficiencyPercent={94.2}
            totalCollectedTons={12.4}
            predictedTons={13.2}
            co2SavedKg={44.8}
          />
        )}

        {/* Dynamic Center Stage Content View */}
        <main className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto min-w-0 bg-[#0B0D0F]">
          {/* 1. ADMIN VIEW */}
          {currentRole === 'admin' && (
            <div className="space-y-5 max-w-7xl mx-auto w-full">
              {/* Live Telemetry Action Bar (on Dashboard) */}
              {activeTab === 'dashboard' ? (
                <LiveTelemetryBar
                  isSimulating={isSimulating}
                  onToggleSimulation={() => setIsSimulating(!isSimulating)}
                  onSimulateSpike={handleSimulateSpike}
                  onEmptyAllCritical={handleEmptyAllCritical}
                  onRandomEvent={() => {
                    const randomBin = bins[Math.floor(Math.random() * bins.length)];
                    if (randomBin) {
                      handleUpdateFillPercent(randomBin.id, Math.floor(Math.random() * 85) + 15);
                      showToast(`Sensor fluctuation simulated for ${randomBin.name}.`);
                    }
                  }}
                  criticalCount={criticalCount}
                  simulatedTime={simulatedTime}
                  onSelectTimeOfDay={setSimulatedTime}
                />
              ) : (
                /* Sleek Back to Dashboard Navigation Header for open tabs */
                <div className="bg-[#111417] border border-[#272D33] rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setActiveTab('dashboard');
                      }}
                      className="flex items-center gap-2 bg-[#171B1F] hover:bg-[#1C2126] text-[#F1F3F4] px-3.5 py-2 rounded-xl border border-[#272D33] font-bold text-xs transition-all shadow-sm group"
                      title="Return to main interactive map dashboard (Esc)"
                    >
                      <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Back to Dashboard</span>
                    </button>
                    <div className="h-4 w-px bg-[#272D33] hidden sm:block" />
                    <span className="text-xs font-semibold text-[#9AA3AD] hidden sm:inline-block">
                      {activeTab === 'routes' && 'Route Optimization & Fleet Dispatch'}
                      {activeTab === 'bins' && 'Smart Bin Inventory & Area Management'}
                      {activeTab === 'analytics' && 'Waste Analytics & Historical Trends'}
                      {activeTab === 'predictions' && 'AI Accumulation & Surge Predictions'}
                      {activeTab === 'alerts' && 'Imminent Overflow Incidents'}
                      {activeTab === 'reports' && 'Public Citizen Issue Reports'}
                      {activeTab === 'consultant' && 'AI Municipal Operations Consultant'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveTab('dashboard');
                    }}
                    className="p-2 rounded-xl text-[#9AA3AD] hover:text-[#F1F3F4] hover:bg-[#1C2126] transition-colors border border-transparent hover:border-[#272D33]"
                    title="Close view and return to dashboard"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Dashboard Main View */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Top Stats Metric Cards */}
                  <DashboardStats bins={bins} drivers={drivers} />

                  {/* Main Interactive Map Stage */}
                  <div className="h-[560px] w-full">
                    <InteractiveMap
                      bins={bins}
                      areas={areas}
                      depot={depot}
                      activeRoute={activeRouteOnMap}
                      selectedBin={selectedBin}
                      onSelectBin={setSelectedBin}
                      onDeployRouteToDriver={handleDeployRoute}
                      availableRoutes={routes}
                      onSelectRoute={setActiveRouteOnMap}
                      onCollectBin={handleCollectBin}
                    />
                  </div>

                  {/* Analytics & Volume Charts */}
                  <AnalyticsCharts areas={areas} bins={bins} />
                </div>
              )}

              {/* Route Optimization View */}
              {activeTab === 'routes' && (
                <RouteOptimizerView
                  routes={routes}
                  bins={bins}
                  areas={areas}
                  drivers={drivers}
                  onDeployRoute={handleDeployRoute}
                  onUpdateRoutes={setRoutes}
                  onSelectRouteForMap={(r) => {
                    setActiveRouteOnMap(r);
                    setActiveTab('dashboard');
                  }}
                />
              )}

              {/* Bin Inventory & Provisioning View */}
              {activeTab === 'bins' && (
                <BinInventoryModal
                  bins={bins}
                  areas={areas}
                  onAddBin={(newBin) => {
                    setBins(prev => [newBin, ...prev]);
                    showToast(`Smart Bin ${newBin.id} provisioned and connected.`);
                  }}
                  onUpdateBin={(updated) => {
                    setBins(prev => prev.map(b => b.id === updated.id ? updated : b));
                  }}
                  onDeleteBin={(binId) => {
                    setBins(prev => prev.filter(b => b.id !== binId));
                    showToast(`Bin ${binId} decommissioned.`);
                  }}
                  onSelectBin={setSelectedBin}
                />
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <AnalyticsCharts areas={areas} bins={bins} />
              )}

              {/* Accumulation Predictions View */}
              {activeTab === 'predictions' && (
                <PredictionsView
                  bins={bins}
                  areas={areas}
                  predictionData={predictionData}
                  onUpdatePredictions={setPredictionData}
                />
              )}

              {/* Overflow Alerts Incident Queue */}
              {activeTab === 'alerts' && (
                <div className="space-y-4">
                  <div className="bg-[#111417] p-5 rounded-2xl border border-[#272D33] shadow-sm flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#F1F3F4] flex items-center gap-2">
                        <Flame className="w-5 h-5 text-rose-400" />
                        Imminent Overflow &amp; High-Risk Containers
                      </h2>
                      <p className="text-xs text-[#9AA3AD] mt-0.5">
                        Containers predicted to breach capacity within the next 2 hours based on IoT filling gradient.
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-rose-950/80 border border-rose-800/80 text-rose-400 px-3 py-1 rounded-xl font-mono">
                      {criticalCount} Critical Containers
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {bins.filter(b => b.currentFillPercent >= 75).map(bin => (
                      <div
                        key={bin.id}
                        onClick={() => setSelectedBin(bin)}
                        className="p-5 rounded-2xl border border-[#272D33] bg-[#111417] shadow-sm cursor-pointer hover:border-[#38414A] transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-[#68717B] font-bold uppercase">{bin.id}</span>
                            <h4 className="text-sm font-bold text-[#F1F3F4] mt-0.5">{bin.name}</h4>
                            <p className="text-xs text-[#9AA3AD] mt-0.5">{bin.areaName}</p>
                          </div>
                          <span className={`text-xl font-bold font-mono ${bin.currentFillPercent >= 90 ? 'text-rose-400' : 'text-orange-400'}`}>
                            {bin.currentFillPercent}%
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-[#272D33] text-xs space-y-1">
                          <div className="flex justify-between text-[#9AA3AD]">
                            <span>Predicted Breach:</span>
                            <strong className="text-rose-400 font-mono">{bin.predictedOverflowTime}</strong>
                          </div>
                          <div className="flex justify-between text-[#9AA3AD]">
                            <span>Action Required:</span>
                            <span className="font-semibold text-[#F1F3F4]">{bin.recommendedCollectionTime}</span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCollectBin(bin.id);
                          }}
                          className="mt-3 w-full bg-[#1C2126] hover:bg-[#272D33] text-[#F1F3F4] border border-[#272D33] font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Dispatch Emergency Collection</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Public Citizen Reports Review Queue */}
              {activeTab === 'reports' && (
                <CitizenPortal
                  reports={reports}
                  areas={areas}
                  user={user}
                  onSubmitReport={(newRep) => {
                    setReports(prev => [newRep, ...prev]);
                    showToast('Public report verified and added to dispatch queue.');
                  }}
                />
              )}

              {/* AI Municipal Consultant */}
              {activeTab === 'consultant' && (
                <AiAssistantModal
                  bins={bins}
                  areas={areas}
                  routes={routes}
                />
              )}
            </div>
          )}

          {/* 2. DRIVER VIEW */}
          {currentRole === 'driver' && (
            <div className="max-w-6xl mx-auto w-full space-y-4">
              <div className="bg-[#111417] border border-[#272D33] rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentRole('admin');
                    }}
                    className="flex items-center gap-2 bg-[#171B1F] hover:bg-[#1C2126] text-[#F1F3F4] px-3.5 py-2 rounded-xl border border-[#272D33] font-bold text-xs transition-all shadow-sm group"
                    title="Return to Municipal Admin Dashboard"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Admin Dashboard</span>
                  </button>
                  <div className="h-4 w-px bg-[#272D33] hidden sm:block" />
                  <span className="text-xs font-semibold text-[#9AA3AD] hidden sm:inline-block">
                    Driver Collection &amp; Route Navigation Console
                  </span>
                </div>
              </div>

              <DriverPortal
                driver={activeDriver}
                assignedRoute={routes.find(r => r.assignedDriverId === activeDriver.id) || routes[0] || null}
                bins={bins}
                onCompleteStop={handleCompleteStop}
                onQuickCollectBin={handleCollectBin}
                onReportDriverIssue={(binId, type, notes) => {
                  handleReportIssue(binId, type);
                }}
                onSelectBin={setSelectedBin}
                selectedBin={selectedBin}
              />
            </div>
          )}

          {/* 3. CITIZEN VIEW */}
          {currentRole === 'citizen' && (
            <div className="max-w-5xl mx-auto w-full space-y-4">
              <div className="bg-[#111417] border border-[#272D33] rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentRole('admin');
                    }}
                    className="flex items-center gap-2 bg-[#171B1F] hover:bg-[#1C2126] text-[#F1F3F4] px-3.5 py-2 rounded-xl border border-[#272D33] font-bold text-xs transition-all shadow-sm group"
                    title="Return to Municipal Admin Dashboard"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back to Admin Dashboard</span>
                  </button>
                  <div className="h-4 w-px bg-[#272D33] hidden sm:block" />
                  <span className="text-xs font-semibold text-[#9AA3AD] hidden sm:inline-block">
                    Citizen Community Cleanup &amp; Reporting Portal
                  </span>
                </div>
              </div>

              <CitizenPortal
                reports={reports}
                areas={areas}
                user={user}
                onSubmitReport={(newRep) => {
                  setReports(prev => [newRep, ...prev]);
                  showToast('Thank you! Your report has been submitted to the municipal cleanup team.');
                }}
              />
            </div>
          )}
        </main>
      </div>

      {/* Selected Bin Inspector Drawer */}
      <BinDetailDrawer
        bin={selectedBin}
        onClose={() => setSelectedBin(null)}
        onUpdateFillPercent={handleUpdateFillPercent}
        onCollectBin={handleCollectBin}
        onReportIssue={handleReportIssue}
      />

      {/* Global Quick Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        bins={bins}
        routes={routes}
        drivers={drivers}
        reports={reports}
        user={user}
        onSelectBin={(bin) => {
          setSelectedBin(bin);
          if (currentRole !== 'admin') setCurrentRole('admin');
        }}
        onSelectRoute={(route) => {
          setActiveRouteOnMap(route);
          if (currentRole !== 'admin') setCurrentRole('admin');
          setActiveTab('dashboard');
        }}
        onChangeRole={(role) => {
          setCurrentRole(role);
        }}
        onSimulateSpike={handleSimulateSpike}
        onOpenAiConsultant={() => {
          setCurrentRole('admin');
          setActiveTab('consultant');
        }}
      />
    </div>
  );
}

export default App;
