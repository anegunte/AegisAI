"use client";

import { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line,
  ScatterChart, Scatter, ZAxis
} from "recharts";
import { ShieldAlert, BarChart3, PieChartIcon, Activity, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SAMPLE_SCENARIOS } from "@/lib/api";

export default function Analytics() {
  const [activeScenarioId, setActiveScenarioId] = useState("bangalore-flood");

  // Mock comparison datasets based on formulas for the 5 scenarios
  const comparisonData = [
    { name: "Bangalore Flood", Volunteers: 225, MedicalTeams: 18, Shelters: 225, FoodKits: 40500 },
    { name: "Chennai Cyclone", Volunteers: 800, MedicalTeams: 60, Shelters: 1000, FoodKits: 180000 },
    { name: "Delhi Pandemic", Volunteers: 2833, MedicalTeams: 1700, Shelters: 2125, FoodKits: 425000 },
    { name: "Nepal Earthquake", Volunteers: 650, MedicalTeams: 65, Shelters: 650, FoodKits: 65000 },
    { name: "California Wildfire", Volunteers: 125, MedicalTeams: 10, Shelters: 105, FoodKits: 12000 }
  ];

  const riskTrends = [
    { name: "Bangalore Flood", Score: 64, Level: "High" },
    { name: "Chennai Cyclone", Score: 83, Level: "Critical" },
    { name: "Delhi Pandemic", Score: 90, Level: "Critical" },
    { name: "Nepal Earthquake", Score: 81, Level: "Critical" },
    { name: "California Wildfire", Score: 66, Level: "High" }
  ];

  // Pie chart budget distribution details for selected scenario
  const getBudgetDistribution = (id: string) => {
    switch (id) {
      case "bangalore-flood":
        return [
          { name: "Food & Clean Water", value: 360000 },
          { name: "Shelter & Logistics", value: 360000 },
          { name: "Medical Response", value: 240000 },
          { name: "Rescue Operations", value: 180000 },
          { name: "Ops & Comms", value: 60000 }
        ];
      case "chennai-cyclone":
        return [
          { name: "Shelter & Evacuation", value: 1225000 },
          { name: "Food & Clean Water", value: 875000 },
          { name: "Debris & Reconstruction", value: 700000 },
          { name: "Medical Care", value: 525000 },
          { name: "Ops & Comms", value: 175000 }
        ];
      case "delhi-pandemic":
        return [
          { name: "Medical Support & Testing", value: 7500000 },
          { name: "Isolation Centers", value: 3000000 },
          { name: "Public Awareness & Comms", value: 2250000 },
          { name: "Food Distribution", value: 1500000 },
          { name: "Logistics", value: 750000 }
        ];
      case "nepal-earthquake":
        return [
          { name: "Shelter & Infrastructure", value: 875000 },
          { name: "Medical Response", value: 625000 },
          { name: "Search & Rescue", value: 500000 },
          { name: "Food & Clean Water", value: 375000 },
          { name: "Ops & Comms", value: 125000 }
        ];
      case "california-wildfire":
        return [
          { name: "Fire Containment & Rescue", value: 2000000 },
          { name: "Evacuation & Shelters", value: 1250000 },
          { name: "Medical Support", value: 750000 },
          { name: "Food & Clean Water", value: 750000 },
          { name: "Ops & Comms", value: 250000 }
        ];
      default:
        return [];
    }
  };

  // Scatter data showing (X: Population in thousands, Y: Budget in millions, Z: Risk Score, Name)
  const scatterData = [
    { x: 45, y: 1.2, z: 64, name: "Bangalore Flood" },
    { x: 120, y: 3.5, z: 83, name: "Chennai Cyclone" },
    { x: 850, y: 15.0, z: 90, name: "Delhi Pandemic" },
    { x: 65, y: 2.5, z: 81, name: "Nepal Earthquake" },
    { x: 15, y: 5.0, z: 66, name: "California Wildfire" }
  ];

  const COLORS = ["#111827", "#2563EB", "#22C55E", "#F59E0B", "#EF4444"];
  const currentBudgetPie = getBudgetDistribution(activeScenarioId);
  const activeScenario = SAMPLE_SCENARIOS.find(s => s.id === activeScenarioId);

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-gray-200/60 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-gray-950" />
              Strategic Crisis Analytics
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Comparative models and logistics trends across active emergency scenarios.
            </p>
          </div>
          
          {/* Select dropdown for Pie chart focus */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Budget Drill-Down:</span>
            <select
              value={activeScenarioId}
              onChange={(e) => setActiveScenarioId(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-800 shadow-xs outline-none focus:border-gray-950 transition-all cursor-pointer"
            >
              {SAMPLE_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 1: Bar Chart & Pie Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Bar Chart (span 7) */}
          <div className="lg:col-span-7 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-blue-600" />
                Resource Requirement Comparison
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Calculated volunteers, shelters, and medical teams required.</p>
            </div>
            
            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: "bold" }} stroke="#9CA3AF" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Volunteers" fill="#111827" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Shelters" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="MedicalTeams" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart (span 5) */}
          <div className="lg:col-span-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <PieChartIcon className="h-4.5 w-4.5 text-blue-600" />
                Budget Breakdown Matrix
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Distribution of total allocation for {activeScenario?.name}.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
              {/* Chart */}
              <div className="h-56 w-56 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={currentBudgetPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {currentBudgetPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center total */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-extrabold text-gray-900">
                    ₹{((activeScenario?.budget || 0) / 1000000).toFixed(1)}M
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">Total budget</span>
                </div>
              </div>

              {/* Labels list */}
              <div className="space-y-2 w-full text-xs font-semibold">
                {currentBudgetPie.map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                      <span className="truncate max-w-[140px]">{entry.name}</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">₹{(entry.value / 1000).toFixed(0)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Line Chart & Scatter Plot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Risk Trends Line (span 6) */}
          <div className="lg:col-span-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="mb-4">
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-4.5 w-4.5 text-blue-600" />
                Risk Index Comparison
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Calculated composite risk scores across incident types.</p>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={riskTrends} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fontWeight: "bold" }} stroke="#9CA3AF" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="Score" 
                    stroke="#111827" 
                    strokeWidth={3} 
                    activeDot={{ r: 6 }} 
                    dot={{ r: 4, stroke: "#2563EB", strokeWidth: 2, fill: "white" }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Population vs. Budget Bubble Map (span 6) */}
          <div className="lg:col-span-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
            <div className="mb-4">
              <h2 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-blue-600" />
                Population Affected vs. Operation Budget
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Correlation mapping (bubble size indicates calculated risk score).</p>
            </div>

            <div className="h-72 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Population" 
                    unit="k" 
                    tick={{ fontSize: 10 }} 
                    stroke="#9CA3AF" 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Budget" 
                    unit="M" 
                    tick={{ fontSize: 10 }} 
                    stroke="#9CA3AF" 
                  />
                  <ZAxis type="number" dataKey="z" range={[80, 500]} name="Risk Score" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                  <Scatter name="Disaster Scenarios" data={scatterData} fill="#2563EB">
                    {scatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
