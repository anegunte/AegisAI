import os
import json
import logging
from typing import Dict, Any
from app.config import settings

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Fallback generator for offline/unconfigured testing
def get_mock_briefing(disaster_type: str, location: str, population: int, severity: str, budget: float) -> Dict[str, Any]:
    dis = disaster_type.lower()
    
    # Generic placeholders customized based on inputs
    if "flood" in dis:
        situation = f"Heavy monsoon rains have triggered flash flooding in {location}, inundating low-lying residential sectors and critical roads. An estimated {population:,} individuals have been affected, with approximately 25% requiring immediate evacuation. Saturated ground conditions indicate high risk of mudslides."
        priority_actions = [
            f"Establish temporary shelters at designated elevated municipal sites, allocating {math_shelters(population, severity)} shelters.",
            "Deploy swift-water rescue units and coordinate with national defense forces for air evacuation in stranded zones.",
            "Distribute clean drinking water and food rations to prevent waterborne disease outbreaks.",
            "Set up mobile medical triage centers to handle emergency physical injuries and fever cases."
        ]
        key_risks = [
            "Outbreak of waterborne diseases (cholera, typhoid) due to contaminated water supply.",
            "Compromised bridge foundations leading to secondary transit grid collapses.",
            "Looting in evacuated commercial sectors during night hours."
        ]
        recommended_response = [
            "Activate Phase 1 Emergency Evacuation and command center integration within 2 hours.",
            "Issue emergency broadcast warnings directing citizens away from drainage paths and riverbanks.",
            "Coordinate with local water utility boards to deliver mobile filtration units."
        ]
        recovery = f"Draft a 6-month rehabilitation strategy starting with drainage dredging, debris removal, structural assessment of bridges, and low-interest reconstruction loans for {location} business owners."
        resilience = [
            "Upgrade drainage and storm-water systems to handle 100-year flood events.",
            "Enact strict zoning laws prohibiting residential construction in high-risk floodplains.",
            "Install telemetry-enabled river level gauges linked to automated SMS alerting platforms."
        ]
        stakeholder_coordination = [
            "National Disaster Management Authority (NDMA): Strategic resource command and federal asset release.",
            "Municipal Corporation & Police: Road blocks, evacuation management, and shelter security.",
            "Red Cross & local NGOs: Food kit distributions and volunteer mobilization.",
            "Armed Forces: Helicopter assets for heavy cargo delivery and isolated search-and-rescue."
        ]
    elif "earthquake" in dis:
        situation = f"A major seismic event has struck {location}, causing extensive structural damage to unreinforced concrete structures and key utility grids. Major arterial roads are blocked by debris. {population:,} citizens are impacted, and immediate medical triage is active."
        priority_actions = [
            "Execute immediate search-and-rescue protocols in collapsed structures using acoustic and canine teams.",
            "Deploy emergency medical personnel to open-field field hospitals to treat trauma and crush injuries.",
            "Construct temporary emergency housing structures using lightweight materials.",
            "Establish secure water and dry food supply depots in accessible open-space parks."
        ]
        key_risks = [
            "Aftershocks causing further collapse of structurally compromised buildings.",
            "Gas line leaks leading to widespread fire outbreaks in dense urban zones.",
            "Critical hospital systems operating on emergency generator backup with limited fuel."
        ]
        recommended_response = [
            "Mobilize heavy search-and-rescue machinery to clear key supply lines.",
            "Impose temporary evacuation notices on structures with visible load-bearing cracks.",
            "Establish an inter-agency unified command center at a seismically sound facility."
        ]
        recovery = "Implement structural safety checks for all multi-story housing and civic buildings. Repair central grid infrastructure and execute a 12-month housing relocation plan."
        resilience = [
            "Enforce seismic building codes with strict retrofitting mandates for older structures.",
            "Distribute personal earthquake readiness kits and conduct regular community response drills.",
            "Construct seismically isolated command centers and backup hospital facilities."
        ]
        stakeholder_coordination = [
            "Ministry of Infrastructure / Public Works: Debris removal and structural safety inspections.",
            "State Health Services: Trauma care surge, blood bank mobilization, and field hospitals.",
            "Civil Defense Volunteers: Shelter management, cataloging missing persons, and supply logistics.",
            "Utility Operators: Rapid isolation of natural gas mains and electricity grids to prevent fires."
        ]
    elif "pandemic" in dis:
        situation = f"An outbreak of a highly infectious viral pathogen has been confirmed in {location}, showing rapid community transmission. With an active case population scaling in the vicinity of {population:,} people, local clinical capacities are highly stressed."
        priority_actions = [
            "Establish widespread rapid diagnostic testing centers and isolate active cases.",
            "Distribute personal protective equipment (PPE) to all healthcare personnel and essential workers.",
            "Expand clinical bed capacity by converting convention centers into temporary care wards.",
            "Launch public service announcements detailing sanitation guidelines and movement restrictions."
        ]
        key_risks = [
            "Severe staff shortages in hospitals due to medical personnel contracting the virus.",
            "Supply chain disruption for basic food items and raw pharmaceutical ingredients.",
            "Public non-compliance with isolation policies leading to super-spreader events."
        ]
        recommended_response = [
            "Establish local quarantine zones and contact tracing systems.",
            "Procure antiviral treatments, oxygen concentrators, and specialized ventilators.",
            "Activate emergency logistics networks for grocery deliveries to isolated populations."
        ]
        recovery = "Implement a comprehensive vaccination program, set up post-viral recovery clinics, and provide economic support funds for affected families."
        resilience = [
            "Build permanent state-of-the-art biosafety laboratory facilities for early pathogen detection.",
            "Maintain a national strategic stockpile of PPE, ventilators, and essential vaccines.",
            "Establish decentralized primary healthcare channels capable of rapid triage."
        ]
        stakeholder_coordination = [
            "World Health Organization (WHO) & Ministry of Health: Epidemiological profiling and protocol updates.",
            "Police & Administration: Enforcement of sanitary regulations, quarantine boundaries, and curfew.",
            "Supermarket Chains & Logistics Providers: Home-delivery supply chain for quarantined households.",
            "Pharmaceutical Manufacturers: Fast-tracked supply and distribution of antiviral drugs."
        ]
    elif "cyclone" in dis:
        situation = f"A severe tropical cyclone has made landfall near {location}, bringing destructive winds and storm surges. Major parts of the grid are offline, and storm surges have inundated coastal settlements. Out of the {population:,} population, massive shelter support is required."
        priority_actions = [
            "Coordinate storm shelter management and clear downed trees blocking evacuation pathways.",
            "Distribute clean drinking water to prevent ingestion of saline/polluted water.",
            "Restore emergency telecommunications and satellite arrays for response command.",
            "Deploy mobile clinics to treat wind-borne debris injuries and lacerations."
        ]
        key_risks = [
            "Sustained high winds preventing rescue operations or supply drops for 24-48 hours.",
            "Contamination of drinking water wells with ocean storm surge saltwater.",
            "Failure of coastal dykes or embankments causing secondary flooding."
        ]
        recommended_response = [
            "Mobilize utility crews to isolate downed electrical lines.",
            "Dispatch search-and-rescue teams to low-lying coastal areas.",
            "Maintain food supply chains to temporary shelters."
        ]
        recovery = "Rebuild coastal protection walls, restore telecommunications grids, provide emergency crop-loss grants to farmers, and reconstruct roof structures."
        resilience = [
            "Construct multi-purpose, wind-resistant cyclone shelters in every high-risk village.",
            "Replant mangrove forests along coastlines to serve as natural storm-surge buffers.",
            "Underground cabling for electrical transmission in cyclone-prone coastal zones."
        ]
        stakeholder_coordination = [
            "Meteorological Department: Track storm trajectory and wind speeds for safe operations.",
            "Coast Guard & Navy: Amphibious craft deployment for coastal search-and-rescue.",
            "NGO Logistics Networks: Sourcing tarpaulins, blankets, and solar lanterns.",
            "Telecom Companies: Fast deployment of cellular-towers-on-wheels (COWs)."
        ]
    elif "wildfire" in dis:
        situation = f"A fast-moving wildfire has escaped containment lines in the forests adjacent to {location}, driven by dry winds and high temperatures. Evacuation alerts are active for suburban areas, affecting a population of {population:,}."
        priority_actions = [
            "Establish wildfire containment lines and mobilize aerial water-bombing tankers.",
            "Evacuate high-risk neighborhoods and coordinate shelter placement.",
            "Provide respirator masks to shelter occupants to combat severe smoke inhalation.",
            "Deploy veterinary teams to rescue and treat livestock and pets."
        ]
        key_risks = [
            "Sudden wind shifts trapping firefighting personnel and evacuating civilians.",
            "Dense smoke plumes shutting down local aviation and restricting road visibility.",
            "Damage to chemical storage or energy sub-stations creating hazardous smoke."
        ]
        recommended_response = [
            "Establish roadblock checkpoints to prevent civilian re-entry into active zones.",
            "Coordinate air quality updates and issue stay-at-home notices for neighboring districts.",
            "Deploy heavy bulldozers to clear firebreaks ahead of the fire line."
        ]
        recovery = "Clear toxic ash, survey damaged homes for structural integrity, implement soil erosion measures on burned slopes, and rebuild infrastructure."
        resilience = [
            "Establish smart thermal camera sensors and satellite monitoring for early hot-spot detection.",
            "Enforce defensible space regulations requiring fuel clearance around homes.",
            "Acquire advanced firefighting tankers and expand wildland-urban interface training."
        ]
        stakeholder_coordination = [
            "Forestry Commission & Fire Department: Joint tactical command on the fire line.",
            "Environmental Protection Agency: Air quality tracking and respiratory advisory services.",
            "Animal Protection Groups: Sourcing feed and staging veterinary hospitals for displaced animals.",
            "Search & Rescue Teams: Sweeping residential grids to ensure compliance with evacuation orders."
        ]
    else:
        situation = f"An emergency event of type '{disaster_type}' has impacted {location}. Emergency response protocols are activated. A population of {population:,} is affected, with initial response teams assessing structural integrity and immediate humanitarian needs."
        priority_actions = [
            "Activate the emergency operations center and establish inter-agency communications.",
            "Conduct rapid damage assessment to identify critical infrastructure needs.",
            "Provide temporary shelters and basic food/water resources for displaced individuals.",
            "Coordinate local volunteer networks to assist with basic distribution."
        ]
        key_risks = [
            "Resource constraints if the situation escalates.",
            "Secondary weather anomalies delaying rescue efforts.",
            "Supply chain delays for medical and food resources."
        ]
        recommended_response = [
            "Establish a clear chain of command and dispatch initial responders.",
            "Monitor localized updates and broadcast safety warnings to the public.",
            "Staging area setup for incoming rescue equipment and relief kits."
        ]
        recovery = "Inspect damaged structures, coordinate local recovery funds, and restore regular utility functions."
        resilience = [
            "Formulate detailed community response plans for similar events.",
            "Deliver regular emergency response training workshops for local community leaders.",
            "Integrate warning platforms with local broadcast channels."
        ]
        stakeholder_coordination = [
            "Local Municipal Body: Operations oversight and utility restoration.",
            "Red Cross: Shelter volunteers and basic medical triage support.",
            "Local Security Forces: Traffic control and public safety patrols."
        ]

    # Structure identical to Gemini API expected JSON
    return {
        "executiveBrief": f"AegisAI Crisis Briefing: A severity classification of '{severity.upper()}' has been verified for a {disaster_type} in {location}. Immediate resource allocation is under way targeting {population:,} affected people with a designated budget of ₹{budget:,.2f}.",
        "situationSummary": situation,
        "priorityActions": priority_actions,
        "keyRisks": key_risks,
        "recommendedResponse": recommended_response,
        "recoveryStrategy": recovery,
        "longTermResilience": resilience,
        "stakeholderCoordination": stakeholder_coordination
    }

def math_shelters(pop: int, sev: str) -> int:
    mult = 1.0 if sev.lower() == "critical" else 0.75 if sev.lower() == "high" else 0.5
    return max(1, round((pop * 0.25 * mult) / 50))

def generate_crisis_briefing(disaster_type: str, location: str, population: int, severity: str, budget: float) -> Dict[str, Any]:
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        logger.info("GEMINI_API_KEY not found. Using local template engine for Palantir/McKinsey style brief.")
        return get_mock_briefing(disaster_type, location, population, severity, budget)
    
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        
        # We use gemini-1.5-flash as it is highly stable, fast, and supports JSON output
        model = genai.GenerativeModel('gemini-1.5-flash', generation_config={"response_mime_type": "application/json"})
        
        prompt = f"""
        You are AegisAI, an elite crisis response intelligence platform built by top-tier systems engineers, principal designers, and disaster response experts.
        Analyze the following emergency scenario:
        - Disaster Type: {disaster_type}
        - Location: {location}
        - Population Impacted: {population:,}
        - Severity Level: {severity}
        - Budget Available: ₹{budget:,.2f}

        Generate an authoritative, executive-level Crisis Briefing. The tone must be McKinsey-style executive precision combined with Palantir Gotham operational clarity. All financial/budget references must be in Indian Rupees (INR, using the ₹ symbol).

        Return a JSON object matching this schema:
        {{
            "executiveBrief": "A high-level 2-3 sentence executive statement summarizing the crisis status and immediate decision action required.",
            "situationSummary": "A detailed, structured description of the physical, infrastructure, and human impact in the area.",
            "priorityActions": [
                "Action 1: Exact details of first immediate priority",
                "Action 2: Details of second priority",
                "Action 3: Details of third priority",
                "Action 4: Details of fourth priority"
            ],
            "keyRisks": [
                "Risk 1: Description of secondary risk (e.g., epidemics, power failure, aftershocks, fire)",
                "Risk 2: Description of another secondary risk",
                "Risk 3: Description of another secondary risk"
            ],
            "recommendedResponse": [
                "Phase 1 response recommendation",
                "Phase 2 response recommendation",
                "Phase 3 response recommendation"
            ],
            "recoveryStrategy": "An elegant paragraph describing the mid-to-long term rehabilitation plan (3-12 months).",
            "longTermResilience": [
                "Structural or policy recommendation 1",
                "Structural or policy recommendation 2",
                "Structural or policy recommendation 3"
            ],
            "stakeholderCoordination": [
                "Stakeholder 1 (e.g., National Command, Army, UN, specific NGOs): Roles and responsibilities",
                "Stakeholder 2: Roles and responsibilities",
                "Stakeholder 3: Roles and responsibilities"
            ]
        }}
        """
        
        response = model.generate_content(prompt)
        # Parse JSON
        result = json.loads(response.text)
        return result
        
    except Exception as e:
        logger.error(f"Error calling Gemini API: {str(e)}. Falling back to local template engine.")
        return get_mock_briefing(disaster_type, location, population, severity, budget)
