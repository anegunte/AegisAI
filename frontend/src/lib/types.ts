export interface DisasterScenario {
  id: string;
  name: string;
  disaster_type: string;
  location: string;
  population: number;
  severity: string;
  budget: number;
  latitude: number;
  longitude: number;
  description: string;
}

export interface BudgetDetail {
  percentage: number;
  amount: number;
}

export interface ResourceAllocation {
  foodKits: number;
  medicalTeams: number;
  shelters: number;
  ambulances: number;
  waterSupplyLiters: number;
  volunteers: number;
  budgetDistribution: {
    [category: string]: BudgetDetail;
  };
}

export interface RiskMetrics {
  populationScore: number;
  severityScore: number;
  disasterScore: number;
  budgetOffset: number;
}

export interface RiskAnalysis {
  score: number;
  classification: "Low" | "Moderate" | "High" | "Critical";
  urgency: string;
  predictedImpact: string;
  metrics: RiskMetrics;
}

export interface AIBriefing {
  executiveBrief: string;
  situationSummary: string;
  priorityActions: string[];
  keyRisks: string[];
  recommendedResponse: string[];
  recoveryStrategy: string;
  longTermResilience: string[];
  stakeholderCoordination: string[];
}

export interface CrisisPlanResponse {
  request: {
    disaster_type: string;
    location: string;
    population: number;
    severity: string;
    budget: number;
  };
  resources: ResourceAllocation;
  risk: RiskAnalysis;
  briefing: AIBriefing;
}
