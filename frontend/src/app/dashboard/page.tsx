"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AlertCircle, Shield, TrendingUp, Download, CheckCircle, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import KPICards from "@/components/KPICards";
import BriefingPanel from "@/components/BriefingPanel";
import { SAMPLE_SCENARIOS, generateCrisisPlan, downloadPDFReport } from "@/lib/api";
import { CrisisPlanResponse, DisasterScenario } from "@/lib/types";

// SSR-Safe dynamic import of Leaflet Map component
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 border border-gray-200">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        <span className="text-xs font-semibold text-gray-500">Initializing GIS Engine...</span>
      </div>
    </div>
  )
});

export default function Dashboard() {
  const [selectedScenarioId, setSelectedScenarioId] = useState("bangalore-flood");
  
  // Form States
  const [disasterType, setDisasterType] = useState("Flood");
  const [location, setLocation] = useState("Bangalore, India");
  const [population, setPopulation] = useState(45000);
  const [severity, setSeverity] = useState("High");
  const [budget, setBudget] = useState(1200000);
  const [lat, setLat] = useState(12.9716);
  const [lng, setLng] = useState(77.5946);

  // Computed Strategy Plan State
  const [plan, setPlan] = useState<CrisisPlanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load preset scenario
  const handleLoadPreset = (scenarioId: string) => {
    const s = SAMPLE_SCENARIOS.find((item) => item.id === scenarioId);
    if (s) {
      setSelectedScenarioId(scenarioId);
      setDisasterType(s.disaster_type);
      setLocation(s.location);
      setPopulation(s.population);
      setSeverity(s.severity);
      setBudget(s.budget);
      setLat(s.latitude);
      setLng(s.longitude);
      // Trigger execution of the plan
      runPlanGeneration(s);
    }
  };

  // Run planning logic
  const runPlanGeneration = async (customConfig?: Partial<DisasterScenario>) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const config = {
        disaster_type: customConfig?.disaster_type ?? disasterType,
        location: customConfig?.location ?? location,
        population: customConfig?.population ?? population,
        severity: customConfig?.severity ?? severity,
        budget: customConfig?.budget ?? budget
      };

      const response = await generateCrisisPlan(config);
      setPlan(response);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate crisis response plan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Export PDF Report from backend
  const handleExportPDF = async () => {
    if (!plan) return;
    setIsDownloadingPDF(true);
    try {
      const blob = await downloadPDFReport({
        disaster_type: plan.request.disaster_type,
        location: plan.request.location,
        population: plan.request.population,
        severity: plan.request.severity,
        budget: plan.request.budget
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `aegis_crisis_report_${plan.request.location.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      alert(err.message || "PDF generation is only supported when the Python backend server is active. Please start the backend and retry.");
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  // Initial generation on component mount
  useEffect(() => {
    handleLoadPreset("bangalore-flood");
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Dashboard Header & Preset Selector */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200/60 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Crisis Operations Center</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Simulate incidents, allocate assets, and draft executive briefings.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Incident Preset:</span>
            <select
              value={selectedScenarioId}
              onChange={(e) => handleLoadPreset(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-800 shadow-xs outline-none focus:border-gray-950 focus:ring-1 focus:ring-gray-950 transition-all cursor-pointer"
            >
              {SAMPLE_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.disaster_type})
                </option>
              ))}
              <option value="custom">-- Custom Scenario --</option>
            </select>
          </div>
        </div>

        {/* KPI metrics row */}
        {plan && (
          <KPICards
            population={plan.request.population}
            medicalTeams={plan.resources.medicalTeams}
            shelters={plan.resources.shelters}
            budget={plan.request.budget}
            severity={plan.request.severity}
          />
        )}

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Inputs Form (span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
              <h2 className="text-md font-bold text-gray-900 mb-5 flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-blue-600" />
                Scenario Config Matrix
              </h2>
              
              <div className="space-y-4">
                {/* Disaster Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Disaster Type</label>
                  <select
                    value={disasterType}
                    onChange={(e) => {
                      setDisasterType(e.target.value);
                      setSelectedScenarioId("custom");
                    }}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-800 outline-none focus:border-gray-950 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Flood">Flood</option>
                    <option value="Earthquake">Earthquake</option>
                    <option value="Pandemic">Pandemic</option>
                    <option value="Cyclone">Cyclone</option>
                    <option value="Wildfire">Wildfire</option>
                    <option value="Other">Other Emergency</option>
                  </select>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setSelectedScenarioId("custom");
                    }}
                    placeholder="e.g. San Francisco, CA"
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-800 outline-none focus:border-gray-950 focus:bg-white transition-all"
                  />
                </div>

                {/* Population */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Affected Population</label>
                  <input
                    type="number"
                    value={population}
                    onChange={(e) => {
                      setPopulation(Math.max(1, parseInt(e.target.value) || 0));
                      setSelectedScenarioId("custom");
                    }}
                    placeholder="Affected individuals"
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-800 outline-none focus:border-gray-950 focus:bg-white transition-all"
                  />
                </div>

                {/* Severity */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Severity Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["Low", "Moderate", "High", "Critical"].map((lvl) => {
                      const isActive = severity === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            setSeverity(lvl);
                            setSelectedScenarioId("custom");
                          }}
                          className={`rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            isActive
                              ? lvl === "Critical" ? "bg-red-600 text-white shadow-xs" :
                                lvl === "High" ? "bg-amber-500 text-white shadow-xs" :
                                lvl === "Moderate" ? "bg-blue-600 text-white shadow-xs" :
                                "bg-emerald-600 text-white shadow-xs"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Budget (INR)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => {
                      setBudget(Math.max(1000, parseFloat(e.target.value) || 0));
                      setSelectedScenarioId("custom");
                    }}
                    placeholder="Operation funds"
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-800 outline-none focus:border-gray-950 focus:bg-white transition-all"
                  />
                </div>

                {/* Custom Coordinates Selector if user chooses Custom location */}
                {selectedScenarioId === "custom" && (
                  <div className="grid grid-cols-2 gap-3.5 border-t border-gray-100 pt-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lat Coordinate</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value) || 0)}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs font-medium outline-none focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lng Coordinate</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={lng}
                        onChange={(e) => setLng(parseFloat(e.target.value) || 0)}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs font-medium outline-none focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  type="button"
                  onClick={() => runPlanGeneration()}
                  disabled={isLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-gray-950 hover:bg-gray-900 text-white font-bold py-3.5 text-xs tracking-wider uppercase transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                      Compiling Intelligence Plan...
                    </>
                  ) : (
                    "Generate Response Plan"
                  )}
                </button>
              </div>

              {errorMessage && (
                <div className="mt-4 flex gap-2 rounded-lg bg-red-50 p-3 border border-red-100">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-red-700 leading-normal">{errorMessage}</p>
                </div>
              )}
            </div>
            
            {/* Local calculations node status box */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs font-semibold flex justify-between items-center text-gray-600 shadow-xs">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Calculations Sandbox Mode
              </span>
              <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
            </div>

          </div>

          {/* Right Column: Risk Assessment & Map (span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Risk Assessment Panel */}
            {plan && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Score Dial (span 5) */}
                <div className="md:col-span-5 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Risk Exposure Index</span>
                  <div className="relative flex items-center justify-center h-32 w-32">
                    
                    {/* Ring Path representation */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="50" fill="transparent" stroke="#F3F4F6" strokeWidth="8" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="50" 
                        fill="transparent" 
                        stroke={
                          plan.risk.classification === "Critical" ? "#EF4444" : 
                          plan.risk.classification === "High" ? "#F59E0B" : 
                          plan.risk.classification === "Moderate" ? "#2563EB" : 
                          "#22C55E"
                        } 
                        strokeWidth="8" 
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - plan.risk.score / 100)}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    
                    {/* Inner Text */}
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-gray-900">{plan.risk.score}</span>
                      <span className="text-[10px] font-bold uppercase text-gray-400">Index Score</span>
                    </div>

                  </div>
                </div>

                {/* Detailed Categorization (span 7) */}
                <div className="md:col-span-7 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                      plan.risk.classification === "Critical" ? "bg-red-50 text-red-600 border border-red-100" :
                      plan.risk.classification === "High" ? "bg-amber-50 text-amber-500 border border-amber-100" :
                      plan.risk.classification === "Moderate" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    }`}>
                      {plan.risk.classification} Severity Threat
                    </span>
                    <span className="text-xs font-bold text-gray-400">/</span>
                    <span className="text-xs font-bold text-gray-500">{plan.risk.urgency}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Predicted Sector Impact</h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-semibold mt-1">
                      {plan.risk.predictedImpact}
                    </p>
                  </div>

                  <div className="flex gap-4 border-t border-gray-100 pt-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <div>Pop Scale: <span className="text-gray-950 font-extrabold">{plan.risk.metrics.populationScore}</span></div>
                    <div>Base Threat: <span className="text-gray-950 font-extrabold">{plan.risk.metrics.disasterScore}</span></div>
                    <div>Budget offset: <span className="text-gray-950 font-extrabold">{plan.risk.metrics.budgetOffset}</span></div>
                  </div>
                </div>

              </div>
            )}

            {/* GIS Map Canvas */}
            <div className="h-[450px] w-full">
              <MapComponent
                latitude={lat}
                longitude={lng}
                disasterType={disasterType}
                location={location}
                population={population}
                severity={severity}
              />
            </div>

          </div>

        </div>

        {/* AI Briefing Panel (span 12) */}
        {plan && (
          <div className="pt-4 pb-12">
            <BriefingPanel
              briefing={plan.briefing}
              onDownloadPDF={handleExportPDF}
              isDownloadingPDF={isDownloadingPDF}
            />
          </div>
        )}

      </main>
    </div>
  );
}
