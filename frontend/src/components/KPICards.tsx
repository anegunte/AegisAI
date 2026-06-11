"use client";

import { motion } from "framer-motion";
import { Users, Crosshair, Tent, IndianRupee, Clock } from "lucide-react";

interface KPICardsProps {
  population: number;
  medicalTeams: number;
  shelters: number;
  budget: number;
  severity: string;
}

export default function KPICards({ population, medicalTeams, shelters, budget, severity }: KPICardsProps) {
  
  // Calculate a realistic response target time based on severity
  let responseTime = "4 hours";
  if (severity.toLowerCase() === "critical") {
    responseTime = "45 mins";
  } else if (severity.toLowerCase() === "high") {
    responseTime = "90 mins";
  } else if (severity.toLowerCase() === "moderate") {
    responseTime = "3 hours";
  }

  const items = [
    {
      label: "Affected Population",
      value: population.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50/50",
      border: "border-blue-100",
      description: "Immediate triage scope"
    },
    {
      label: "Medical Teams Needed",
      value: `${medicalTeams} Units`,
      icon: Crosshair,
      color: "text-rose-600",
      bg: "bg-rose-50/50",
      border: "border-rose-100",
      description: "Field clinics & staff"
    },
    {
      label: "Shelters Needed",
      value: `${shelters} Blocks`,
      icon: Tent,
      color: "text-amber-600",
      bg: "bg-amber-50/50",
      border: "border-amber-100",
      description: "50-person capacity units"
    },
    {
      label: "Budget Required",
      value: `₹${(budget / 1000000).toFixed(2)}M`,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      description: "Total logistics allocation"
    },
    {
      label: "Response Target",
      value: responseTime,
      icon: Clock,
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
      border: "border-indigo-100",
      description: "Deployment SLA window"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardAnim = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={i}
            variants={cardAnim}
            className={`flex flex-col justify-between rounded-2xl border ${item.border} ${item.bg} p-5 shadow-xs transition-shadow duration-300 hover:shadow-md backdrop-blur-xs`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
              <div className={`rounded-xl p-2 bg-white shadow-xs border border-gray-100/50`}>
                <Icon className={`h-5 w-5 ${item.color}`} />
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">{item.value}</h3>
              <p className="mt-1 text-[11px] font-semibold text-gray-400">{item.description}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
