"use client";

import { useState } from "react";
import { FileText, Download, ShieldAlert, Award, Globe, HeartHandshake } from "lucide-react";
import Navbar from "@/components/Navbar";
import { SAMPLE_SCENARIOS, downloadPDFReport } from "@/lib/api";

export default function Reports() {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (scenario: typeof SAMPLE_SCENARIOS[0]) => {
    setDownloadingId(scenario.id);
    try {
      const blob = await downloadPDFReport({
        disaster_type: scenario.disaster_type,
        location: scenario.location,
        population: scenario.population,
        severity: scenario.severity,
        budget: scenario.budget
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `aegis_report_${scenario.id.replace(/-/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      alert(err.message || "Failed to download report. Ensure the Python backend server is active at http://localhost:8000.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-gray-200/60 pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-gray-950" />
            Executive Briefing Library
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Export official crisis briefing documentation in consulting-grade PDF format.
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-6 flex flex-col md:flex-row gap-5 items-start">
          <div className="p-3 bg-blue-600 rounded-xl text-white shadow-md shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-wider">McKinsey-Style Reporting Standard</h3>
            <p className="text-xs font-semibold text-blue-700/80 leading-relaxed mt-1.5">
              Each generated document compiles tactical resource layouts, operational milestones, budget models, and situation summaries. Output is formatted for immediate distribution to federal command chains, board members, and public governance leaders.
            </p>
          </div>
        </div>

        {/* Scenario Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_SCENARIOS.map((s) => {
            const isDownloading = downloadingId === s.id;
            return (
              <div 
                key={s.id} 
                className="flex flex-col justify-between p-6 rounded-2xl border border-gray-200 bg-white shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {s.disaster_type}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      s.severity === "Critical" ? "bg-red-50 text-red-600 border border-red-100" :
                      s.severity === "High" ? "bg-amber-50 text-amber-500 border border-amber-100" :
                      "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}>
                      {s.severity}
                    </span>
                  </div>

                  <h3 className="text-md font-bold text-gray-950 mt-3">{s.name}</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">{s.location}</p>
                  <p className="text-xs text-gray-600 font-medium leading-relaxed mt-3">{s.description}</p>
                  
                  <div className="mt-4 border-t border-gray-50 pt-3 grid grid-cols-2 gap-4 text-[11px] font-semibold text-gray-500">
                    <div>Population: <span className="text-gray-900 font-extrabold">{s.population.toLocaleString()}</span></div>
                    <div>Budget: <span className="text-gray-900 font-extrabold">₹{(s.budget / 1000000).toFixed(2)}M</span></div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(s)}
                  disabled={isDownloading}
                  className="w-full mt-6 flex items-center justify-center gap-2 rounded-xl bg-gray-950 hover:bg-gray-900 text-white text-xs font-bold py-3 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  {isDownloading ? "Generating PDF..." : "Export Briefing PDF"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Global standards credentials cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200/50">
          <div className="rounded-xl border border-gray-200/60 p-5 bg-white shadow-xs flex items-start gap-4">
            <Globe className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">UN-DHA Alignment</h4>
              <p className="text-[11px] text-gray-500 font-medium leading-normal mt-1">
                Data modeling structures conform to the UN Department of Humanitarian Affairs standard response nomenclature.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200/60 p-5 bg-white shadow-xs flex items-start gap-4">
            <HeartHandshake className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">NGO Liaison Protocols</h4>
              <p className="text-[11px] text-gray-500 font-medium leading-normal mt-1">
                Stakeholder briefings use Red Cross and USAID guidelines to support unified volunteer coordination patterns.
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-200/60 p-5 bg-white shadow-xs flex items-start gap-4">
            <ShieldAlert className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">Palantir Gotham Integrals</h4>
              <p className="text-[11px] text-gray-500 font-medium leading-normal mt-1">
                Coordinates mapping incorporates geo-tethered points of interest matching state defense GIS software components.
              </p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
