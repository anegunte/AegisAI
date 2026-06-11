import { DisasterScenario, CrisisPlanResponse, ResourceAllocation, RiskAnalysis, AIBriefing } from "./types";

const BACKEND_URL = "http://localhost:8000";

export const SAMPLE_SCENARIOS: DisasterScenario[] = [
  {
    id: "bangalore-flood",
    name: "Bangalore Urban Flood",
    disaster_type: "Flood",
    location: "Bangalore, India",
    population: 45000,
    severity: "High",
    budget: 1200000,
    latitude: 12.9716,
    longitude: 77.5946,
    description: "Severe monsoon inundation in Tech Corridor and low-lying sectors."
  },
  {
    id: "chennai-cyclone",
    name: "Chennai Coastal Cyclone",
    disaster_type: "Cyclone",
    location: "Chennai, India",
    population: 120000,
    severity: "Critical",
    budget: 3500000,
    latitude: 13.0827,
    longitude: 80.2707,
    description: "Category 4 storm surge impacting coastline, residential grids and ports."
  },
  {
    id: "delhi-pandemic",
    name: "Delhi Influenza Outbreak",
    disaster_type: "Pandemic",
    location: "Delhi, India",
    population: 850000,
    severity: "Critical",
    budget: 15000000,
    latitude: 28.6139,
    longitude: 77.2090,
    description: "Rapid viral spread straining urban tertiary care hospital networks."
  },
  {
    id: "nepal-earthquake",
    name: "Nepal Seismic Event",
    disaster_type: "Earthquake",
    location: "Kathmandu, Nepal",
    population: 65000,
    severity: "Critical",
    budget: 2500000,
    latitude: 27.7172,
    longitude: 85.3240,
    description: "7.2 Magnitude earthquake causing infrastructure collapse in valley regions."
  },
  {
    id: "california-wildfire",
    name: "California Wildfire",
    disaster_type: "Wildfire",
    location: "California, USA",
    population: 15000,
    severity: "High",
    budget: 5000000,
    latitude: 37.7749,
    longitude: -122.4194,
    description: "Wildland-urban interface fire threatening residential developments."
  }
];

// Local calculations fallback
function getSeverityMultiplier(severity: string): number {
  switch (severity.toLowerCase()) {
    case "low": return 0.25;
    case "moderate": return 0.50;
    case "high": return 0.75;
    case "critical": return 1.00;
    default: return 0.50;
  }
}

function computeLocalResources(disasterType: string, population: number, severity: string, budget: number): ResourceAllocation {
  const mult = getSeverityMultiplier(severity);
  const dis = disasterType.toLowerCase();
  
  let foodKits = 0;
  let medicalTeams = 0;
  let shelters = 0;
  let ambulances = 0;
  let waterSupplyLiters = 0;
  let volunteers = 0;
  let budgetDist: { [key: string]: number } = {};

  if (dis.includes("flood")) {
    foodKits = Math.ceil(population * 1.2 * mult);
    medicalTeams = Math.max(1, Math.round((population / 2500) * mult));
    shelters = Math.max(1, Math.round((population * 0.25 * mult) / 50));
    ambulances = Math.max(1, Math.round((population / 5000) * mult) + 2);
    waterSupplyLiters = Math.ceil(population * 15 * mult);
    volunteers = Math.max(5, Math.round((population / 200) * mult));
    budgetDist = {
      "Food & Clean Water": 0.30,
      "Shelter & Logistics": 0.30,
      "Medical Response": 0.20,
      "Rescue Operations": 0.15,
      "Ops & Comms": 0.05
    };
  } else if (dis.includes("earthquake")) {
    foodKits = Math.ceil(population * 1.0 * mult);
    medicalTeams = Math.max(2, Math.round((population / 1000) * mult));
    shelters = Math.max(1, Math.round((population * 0.40 * mult) / 40));
    ambulances = Math.max(2, Math.round((population / 2000) * mult) + 4);
    waterSupplyLiters = Math.ceil(population * 20 * mult);
    volunteers = Math.max(10, Math.round((population / 100) * mult));
    budgetDist = {
      "Shelter & Infrastructure": 0.35,
      "Medical Response": 0.25,
      "Search & Rescue": 0.20,
      "Food & Clean Water": 0.15,
      "Ops & Comms": 0.05
    };
  } else if (dis.includes("pandemic")) {
    foodKits = Math.ceil(population * 0.5 * mult);
    medicalTeams = Math.max(3, Math.round((population / 500) * mult));
    shelters = Math.max(1, Math.round((population * 0.05 * mult) / 20));
    ambulances = Math.max(3, Math.round((population / 1500) * mult) + 6);
    waterSupplyLiters = Math.ceil(population * 5 * mult);
    volunteers = Math.max(5, Math.round((population / 300) * mult));
    budgetDist = {
      "Medical Support & Testing": 0.50,
      "Isolation Centers": 0.20,
      "Public Awareness & Comms": 0.15,
      "Food Distribution": 0.10,
      "Logistics": 0.05
    };
  } else if (dis.includes("cyclone")) {
    foodKits = Math.ceil(population * 1.5 * mult);
    medicalTeams = Math.max(1, Math.round((population / 2000) * mult));
    shelters = Math.max(1, Math.round((population * 0.50 * mult) / 60));
    ambulances = Math.max(1, Math.round((population / 4000) * mult) + 3);
    waterSupplyLiters = Math.ceil(population * 18 * mult);
    volunteers = Math.max(8, Math.round((population / 150) * mult));
    budgetDist = {
      "Shelter & Evacuation": 0.35,
      "Food & Clean Water": 0.25,
      "Debris & Reconstruction": 0.20,
      "Medical Care": 0.15,
      "Ops & Comms": 0.05
    };
  } else if (dis.includes("wildfire")) {
    foodKits = Math.ceil(population * 0.8 * mult);
    medicalTeams = Math.max(2, Math.round((population / 1500) * mult));
    shelters = Math.max(1, Math.round((population * 0.35 * mult) / 50));
    ambulances = Math.max(2, Math.round((population / 3000) * mult) + 4);
    waterSupplyLiters = Math.ceil(population * 25 * mult);
    volunteers = Math.max(10, Math.round((population / 120) * mult));
    budgetDist = {
      "Fire Containment & Rescue": 0.40,
      "Evacuation & Shelters": 0.25,
      "Medical Support": 0.15,
      "Food & Clean Water": 0.15,
      "Ops & Comms": 0.05
    };
  } else {
    foodKits = Math.ceil(population * 1.0 * mult);
    medicalTeams = Math.max(1, Math.round((population / 2000) * mult));
    shelters = Math.max(1, Math.round((population * 0.30 * mult) / 50));
    ambulances = Math.max(1, Math.round((population / 4000) * mult) + 2);
    waterSupplyLiters = Math.ceil(population * 15 * mult);
    volunteers = Math.max(5, Math.round((population / 150) * mult));
    budgetDist = {
      "Immediate Relief": 0.40,
      "Infrastructure & Logistics": 0.30,
      "Medical Care": 0.20,
      "Ops & Comms": 0.10
    };
  }

  const budgetDistribution: { [key: string]: { percentage: number; amount: number } } = {};
  Object.keys(budgetDist).forEach(key => {
    const p = budgetDist[key];
    budgetDistribution[key] = {
      percentage: p * 100,
      amount: Math.round(budget * p * 100) / 100
    };
  });

  return {
    foodKits,
    medicalTeams,
    shelters,
    ambulances,
    waterSupplyLiters,
    volunteers,
    budgetDistribution
  };
}

function computeLocalRisk(disasterType: string, population: number, severity: string, budget: number): RiskAnalysis {
  const popScore = population <= 0 ? 0 : Math.min(30, Math.floor(Math.log10(Math.max(10, population)) * 5));
  
  let sevScore = 20;
  switch (severity.toLowerCase()) {
    case "low": sevScore = 10; break;
    case "moderate": sevScore = 20; break;
    case "high": sevScore = 30; break;
    case "critical": sevScore = 40; break;
  }

  let disasterScore = 10;
  const dis = disasterType.toLowerCase();
  if (dis.includes("pandemic")) disasterScore = 20;
  else if (dis.includes("earthquake")) disasterScore = 20;
  else if (dis.includes("cyclone")) disasterScore = 18;
  else if (dis.includes("wildfire")) disasterScore = 16;
  else if (dis.includes("flood")) disasterScore = 14;

  const budgetPerCapita = budget / Math.max(1, population);
  let budgetOffset = 0;
  if (budgetPerCapita >= 1000) budgetOffset = -15;
  else if (budgetPerCapita >= 500) budgetOffset = -10;
  else if (budgetPerCapita >= 150) budgetOffset = -5;
  else if (budgetPerCapita < 20) budgetOffset = 10;

  const score = Math.max(0, Math.min(100, popScore + sevScore + disasterScore + budgetOffset));
  
  let classification: "Low" | "Moderate" | "High" | "Critical" = "Moderate";
  let urgency = "High Priority";
  let impact = "";

  if (score <= 30) {
    classification = "Low";
    urgency = "Standard Response";
    impact = "Local emergency resources are fully adequate. Minor infrastructure disruption expected.";
  } else if (score <= 60) {
    classification = "Moderate";
    urgency = "High Priority";
    impact = "Moderate population displacement and localized power grid failure. Mutual aid assets deployed.";
  } else if (score <= 80) {
    classification = "High";
    urgency = "Immediate Deployment";
    impact = "Significant structure damage, widespread power outages, and medical surge capacity challenged.";
  } else {
    classification = "Critical";
    urgency = "State of Emergency";
    impact = "Catastrophic damage, severe immediate threat to life, food/water infrastructure disabled. International deployment required.";
  }

  return {
    score,
    classification,
    urgency,
    predictedImpact: impact,
    metrics: {
      populationScore: popScore,
      severityScore: sevScore,
      disasterScore: disasterScore,
      budgetOffset
    }
  };
}

function getLocalBriefing(disasterType: string, location: string, population: number, severity: string, budget: number): AIBriefing {
  const dis = disasterType.toLowerCase();
  let situation = "";
  let priorityActions: string[] = [];
  let keyRisks: string[] = [];
  let recommendedResponse: string[] = [];
  let recoveryStrategy = "";
  let longTermResilience: string[] = [];
  let stakeholderCoordination: string[] = [];

  const maxShelters = Math.max(1, Math.round((population * 0.25 * (severity.toLowerCase() === "critical" ? 1 : 0.75)) / 50));

  if (dis.includes("flood")) {
    situation = `Heavy monsoon rains have triggered flash flooding in ${location}, inundating low-lying residential sectors and critical roads. An estimated ${population.toLocaleString()} individuals have been affected, with approximately 25% requiring immediate evacuation. Saturated ground conditions indicate high risk of mudslides.`;
    priorityActions = [
      `Establish temporary shelters at designated elevated municipal sites, allocating ${maxShelters} shelters.`,
      "Deploy swift-water rescue units and coordinate with national defense forces for air evacuation in stranded zones.",
      "Distribute clean drinking water and food rations to prevent waterborne disease outbreaks.",
      "Set up mobile medical triage centers to handle emergency physical injuries and fever cases."
    ];
    keyRisks = [
      "Outbreak of waterborne diseases (cholera, typhoid) due to contaminated water supply.",
      "Compromised bridge foundations leading to secondary transit grid collapses.",
      "Looting in evacuated commercial sectors during night hours."
    ];
    recommendedResponse = [
      "Activate Phase 1 Emergency Evacuation and command center integration within 2 hours.",
      "Issue emergency broadcast warnings directing citizens away from drainage paths and riverbanks.",
      "Coordinate with local water utility boards to deliver mobile filtration units."
    ];
    recoveryStrategy = `Draft a 6-month rehabilitation strategy starting with drainage dredging, debris removal, structural assessment of bridges, and low-interest reconstruction loans for ${location} business owners.`;
    longTermResilience = [
      "Upgrade drainage and storm-water systems to handle 100-year flood events.",
      "Enact strict zoning laws prohibiting residential construction in high-risk floodplains.",
      "Install telemetry-enabled river level gauges linked to automated SMS alerting platforms."
    ];
    stakeholderCoordination = [
      "National Disaster Management Authority (NDMA): Strategic resource command and federal asset release.",
      "Municipal Corporation & Police: Road blocks, evacuation management, and shelter security.",
      "Red Cross & local NGOs: Food kit distributions and volunteer mobilization.",
      "Armed Forces: Helicopter assets for heavy cargo delivery and isolated search-and-rescue."
    ];
  } else if (dis.includes("earthquake")) {
    situation = `A major seismic event has struck ${location}, causing extensive structural damage to unreinforced concrete structures and key utility grids. Major arterial roads are blocked by debris. ${population.toLocaleString()} citizens are impacted, and immediate medical triage is active.`;
    priorityActions = [
      "Execute immediate search-and-rescue protocols in collapsed structures using acoustic and canine teams.",
      "Deploy emergency medical personnel to open-field field hospitals to treat trauma and crush injuries.",
      "Construct temporary emergency housing structures using lightweight materials.",
      "Establish secure water and dry food supply depots in accessible open-space parks."
    ];
    keyRisks = [
      "Aftershocks causing further collapse of structurally compromised buildings.",
      "Gas line leaks leading to widespread fire outbreaks in dense urban zones.",
      "Critical hospital systems operating on emergency generator backup with limited fuel."
    ];
    recommendedResponse = [
      "Mobilize heavy search-and-rescue machinery to clear key supply lines.",
      "Impose temporary evacuation notices on structures with visible load-bearing cracks.",
      "Establish an inter-agency unified command center at a seismically sound facility."
    ];
    recoveryStrategy = "Implement structural safety checks for all multi-story housing and civic buildings. Repair central grid infrastructure and execute a 12-month housing relocation plan.";
    longTermResilience = [
      "Enforce seismic building codes with strict retrofitting mandates for older structures.",
      "Distribute personal earthquake readiness kits and conduct regular community response drills.",
      "Construct seismically isolated command centers and backup hospital facilities."
    ];
    stakeholderCoordination = [
      "Ministry of Infrastructure / Public Works: Debris removal and structural safety inspections.",
      "State Health Services: Trauma care surge, blood bank mobilization, and field hospitals.",
      "Civil Defense Volunteers: Shelter management, cataloging missing persons, and supply logistics.",
      "Utility Operators: Rapid isolation of natural gas mains and electricity grids to prevent fires."
    ];
  } else if (dis.includes("pandemic")) {
    situation = `An outbreak of a highly infectious viral pathogen has been confirmed in ${location}, showing rapid community transmission. With an active case population scaling in the vicinity of ${population.toLocaleString()} people, local clinical capacities are highly stressed.`;
    priorityActions = [
      "Establish widespread rapid diagnostic testing centers and isolate active cases.",
      "Distribute personal protective equipment (PPE) to all healthcare personnel and essential workers.",
      "Expand clinical bed capacity by converting convention centers into temporary care wards.",
      "Launch public service announcements detailing sanitation guidelines and movement restrictions."
    ];
    keyRisks = [
      "Severe staff shortages in hospitals due to medical personnel contracting the virus.",
      "Supply chain disruption for basic food items and raw pharmaceutical ingredients.",
      "Public non-compliance with isolation policies leading to super-spreader events."
    ];
    recommendedResponse = [
      "Establish local quarantine zones and contact tracing systems.",
      "Procure antiviral treatments, oxygen concentrators, and specialized ventilators.",
      "Activate emergency logistics networks for grocery deliveries to isolated populations."
    ];
    recoveryStrategy = "Implement a comprehensive vaccination program, set up post-viral recovery clinics, and provide economic support funds for affected families.";
    longTermResilience = [
      "Build permanent state-of-the-art biosafety laboratory facilities for early pathogen detection.",
      "Maintain a national strategic stockpile of PPE, ventilators, and essential vaccines.",
      "Establish decentralized primary healthcare channels capable of rapid triage."
    ];
    stakeholderCoordination = [
      "World Health Organization (WHO) & Ministry of Health: Epidemiological profiling and protocol updates.",
      "Police & Administration: Enforcement of sanitary regulations, quarantine boundaries, and curfew.",
      "Supermarket Chains & Logistics Providers: Home-delivery supply chain for quarantined households.",
      "Pharmaceutical Manufacturers: Fast-tracked supply and distribution of antiviral drugs."
    ];
  } else if (dis.includes("cyclone")) {
    situation = `A severe tropical cyclone has made landfall near ${location}, bringing destructive winds and storm surges. Major parts of the grid are offline, and storm surges have inundated coastal settlements. Out of the ${population.toLocaleString()} population, massive shelter support is required.`;
    priorityActions = [
      "Coordinate storm shelter management and clear downed trees blocking evacuation pathways.",
      "Distribute clean drinking water to prevent ingestion of saline/polluted water.",
      "Restore emergency telecommunications and satellite arrays for response command.",
      "Deploy mobile clinics to treat wind-borne debris injuries and lacerations."
    ];
    keyRisks = [
      "Sustained high winds preventing rescue operations or supply drops for 24-48 hours.",
      "Contamination of drinking water wells with ocean storm surge saltwater.",
      "Failure of coastal dykes or embankments causing secondary flooding."
    ];
    recommendedResponse = [
      "Mobilize utility crews to isolate downed electrical lines.",
      "Dispatch search-and-rescue teams to low-lying coastal areas.",
      "Maintain food supply chains to temporary shelters."
    ];
    recoveryStrategy = "Rebuild coastal protection walls, restore telecommunications grids, provide emergency crop-loss grants to farmers, and reconstruct roof structures.";
    longTermResilience = [
      "Construct multi-purpose, wind-resistant cyclone shelters in every high-risk village.",
      "Replant mangrove forests along coastlines to serve as natural storm-surge buffers.",
      "Underground cabling for electrical transmission in cyclone-prone coastal zones."
    ];
    stakeholderCoordination = [
      "Meteorological Department: Track storm trajectory and wind speeds for safe operations.",
      "Coast Guard & Navy: Amphibious craft deployment for coastal search-and-rescue.",
      "NGO Logistics Networks: Sourcing tarpaulins, blankets, and solar lanterns.",
      "Telecom Companies: Fast deployment of cellular-towers-on-wheels (COWs)."
    ];
  } else if (dis.includes("wildfire")) {
    situation = `A fast-moving wildfire has escaped containment lines in the forests adjacent to ${location}, driven by dry winds and high temperatures. Evacuation alerts are active for suburban areas, affecting a population of ${population.toLocaleString()}.`;
    priorityActions = [
      "Establish wildfire containment lines and mobilize aerial water-bombing tankers.",
      "Evacuate high-risk neighborhoods and coordinate shelter placement.",
      "Provide respirator masks to shelter occupants to combat severe smoke inhalation.",
      "Deploy veterinary teams to rescue and treat livestock and pets."
    ];
    keyRisks = [
      "Sudden wind shifts trapping firefighting personnel and evacuating civilians.",
      "Dense smoke plumes shutting down local aviation and restricting road visibility.",
      "Damage to chemical storage or energy sub-stations creating hazardous smoke."
    ];
    recommendedResponse = [
      "Establish roadblock checkpoints to prevent civilian re-entry into active zones.",
      "Coordinate air quality updates and issue stay-at-home notices for neighboring districts.",
      "Deploy heavy bulldozers to clear firebreaks ahead of the fire line."
    ];
    recoveryStrategy = "Clear toxic ash, survey damaged homes for structural integrity, implement soil erosion measures on burned slopes, and rebuild infrastructure.";
    longTermResilience = [
      "Establish smart thermal camera sensors and satellite monitoring for early hot-spot detection.",
      "Enforce defensible space regulations requiring fuel clearance around homes.",
      "Acquire advanced firefighting tankers and expand wildland-urban interface training."
    ];
    stakeholderCoordination = [
      "Forestry Commission & Fire Department: Joint tactical command on the fire line.",
      "Environmental Protection Agency: Air quality tracking and respiratory advisory services.",
      "Animal Protection Groups: Sourcing feed and staging veterinary hospitals for displaced animals.",
      "Search & Rescue Teams: Sweeping residential grids to ensure compliance with evacuation orders."
    ];
  } else {
    situation = `An emergency event of type '${disasterType}' has impacted ${location}. Emergency response protocols are activated. A population of ${population.toLocaleString()} is affected, with initial response teams assessing structural integrity and immediate humanitarian needs.`;
    priorityActions = [
      "Activate the emergency operations center and establish inter-agency communications.",
      "Conduct rapid damage assessment to identify critical infrastructure needs.",
      "Provide temporary shelters and basic food/water resources for displaced individuals.",
      "Coordinate local volunteer networks to assist with basic distribution."
    ];
    keyRisks = [
      "Resource constraints if the situation escalates.",
      "Secondary weather anomalies delaying rescue efforts.",
      "Supply chain delays for medical and food resources."
    ];
    recommendedResponse = [
      "Establish a clear chain of command and dispatch initial responders.",
      "Monitor localized updates and broadcast safety warnings to the public.",
      "Staging area setup for incoming rescue equipment and relief kits."
    ];
    recoveryStrategy = "Inspect damaged structures, coordinate local recovery funds, and restore regular utility functions.";
    longTermResilience = [
      "Formulate detailed community response plans for similar events.",
      "Deliver regular emergency response training workshops for local community leaders.",
      "Integrate warning platforms with local broadcast channels."
    ];
    stakeholderCoordination = [
      "Local Municipal Body: Operations oversight and utility restoration.",
      "Red Cross: Shelter volunteers and basic medical triage support.",
      "Local Security Forces: Traffic control and public safety patrols."
    ];
  }

  return {
    executiveBrief: `AegisAI Crisis Briefing: A severity classification of '${severity.toUpperCase()}' has been verified for a ${disasterType} in ${location}. Immediate resource allocation is under way targeting ${population.toLocaleString()} affected people with a designated budget of ₹${budget.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}.`,
    situationSummary: situation,
    priorityActions,
    keyRisks,
    recommendedResponse,
    recoveryStrategy,
    longTermResilience,
    stakeholderCoordination
  };
}

export async function getScenarios(): Promise<DisasterScenario[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/scenarios`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable. Loading local sample scenarios fallback.");
    return SAMPLE_SCENARIOS;
  }
}

export async function generateCrisisPlan(req: {
  disaster_type: string;
  location: string;
  population: number;
  severity: string;
  budget: number;
}): Promise<CrisisPlanResponse> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req)
    });
    if (!res.ok) throw new Error("Plan compilation failed on backend");
    return await res.json();
  } catch (err) {
    console.warn("Backend API unavailable. Computing crisis response plan locally as fallback.");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const resources = computeLocalResources(req.disaster_type, req.population, req.severity, req.budget);
    const risk = computeLocalRisk(req.disaster_type, req.population, req.severity, req.budget);
    const briefing = getLocalBriefing(req.disaster_type, req.location, req.population, req.severity, req.budget);

    return {
      request: req,
      resources,
      risk,
      briefing
    };
  }
}

export async function downloadPDFReport(req: {
  disaster_type: string;
  location: string;
  population: number;
  severity: string;
  budget: number;
}): Promise<Blob> {
  const res = await fetch(`${BACKEND_URL}/api/export-pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req)
  });
  if (!res.ok) {
    throw new Error("Failed to export PDF briefing report. Make sure the backend server is active.");
  }
  return await res.blob();
}
